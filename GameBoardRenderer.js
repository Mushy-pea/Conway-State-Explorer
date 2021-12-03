// This module contains functions that implement the rendering of the game board by determining
// the contents of the corresponding GLView component for each frame.

import {matrix, multiply} from 'mathjs';
import vertexShader from './VertexShader.js';
import fragmentShader from './FragmentShader.js';
import {cellModel, verticalLineModel, horizontalLineModel, modelElements}
from './GameBoardModels.js';
import {testGameBoard} from './GameLogic.js';

// These global variables are assigned values related to the OpenGL context that will be needed to
// render the game board each frame.
var gl;
var glP;

// This function is used to encapsulate values related to the OpenGL context in an object, a
// reference to which is assigned to global variable glP when the renderer is initialised.
function glParameters(uniform_modToClip, uniform_colour, attribute_modPosition,
                      vertexBuffer_cellModel, vertexBuffer_verticalLineModel,
                      vertexBuffer_horizontalLineModel, elementBuffer) {
  let frustumScale = 1;
  let zNear = 0.5;
  let zFar = 100;
  return {
    uniform_modToClip: function() {
      return uniform_modToClip;
    },
    uniform_colour: function() {
      return uniform_colour;
    },
    attribute_modPosition: function() {
      return attribute_modPosition;
    },
    vertexBuffer_cellModel: function() {
      return vertexBuffer_cellModel;
    },
    vertexBuffer_verticalLineModel: function() {
      return vertexBuffer_verticalLineModel;
    },
    vertexBuffer_horizontalLineModel: function() {
      return vertexBuffer_horizontalLineModel;
    },
    elementBuffer: function() {
      return elementBuffer;
    },
    frustumScale: function() {
      return frustumScale;
    },
    zNear: function() {
      return zNear;
    },
    zFar: function() {
      return zFar;
    }
  }
}

// These global variables are exposed to App so they can be modified in response to UI inputs.
const control = {
  mode: 0,
  cam: {
    x: 0, y: 0, z: -8
  }
};

// This function generates a 4 - vector translation matrix.
function translate(x, y, z) {
  return (
    matrix([[1, 0, 0, x], [0, 1, 0, y], [0, 0, 1, z], [0, 0, 0, 1]])
  );
}

// This function returns a function that is used to generate the transformation matrix that is
// passed to the vertex shader for each model rendered.
function genModelTransformFunction(x, y, z, frustumScale, zNear, zFar) {
  const window = {width: gl.drawingBufferWidth, height: gl.drawingBufferHeight};
  const worldToCamera = translate(x, y, z);
  const cameraToClip =
  matrix([[frustumScale / (window.width / window.height), 0, 0, 0],
          [0, frustumScale, 0, 0],
          [0, 0, ((zFar + zNear) / (zNear - zFar)), ((2 * zFar * zNear) / (zNear - zFar))],
          [0, 0, -1, 0]]);
  const worldToClip = multiply(cameraToClip, worldToCamera);

  function modelTransformFunction(i, j) {
    const modelToWorld = translate(i, j, 0);
    const modelToClip = multiply(worldToClip, modelToWorld);
    let index = 0;
    const modelToClipArray = Array(16).fill(0);
    modelToClip.forEach((value) => {modelToClipArray[index] = value;
                                    index++;});
    return modelToClipArray;
  }

  return modelTransformFunction;
}

// This function is called when the corresponding GLView component is first rendered in App.
// It creates the single GL shader program used for rendering the game board and assigns values
// related to the GL context to the global variables gl and glP.
function onContextCreation(_gl) {
  _gl.viewport(0, 0, _gl.drawingBufferWidth, _gl.drawingBufferHeight);
  _gl.clearColor(1, 1, 1, 1);
  _gl.clear(_gl.COLOR_BUFFER_BIT);

  const vert = _gl.createShader(_gl.VERTEX_SHADER);
  _gl.shaderSource(vert, vertexShader);
  _gl.compileShader(vert);

  const frag = _gl.createShader(_gl.FRAGMENT_SHADER);
  _gl.shaderSource(frag, fragmentShader);
  _gl.compileShader(frag);

  const shaderProgram = _gl.createProgram();
  _gl.attachShader(shaderProgram, vert);
  _gl.attachShader(shaderProgram, frag);
  _gl.linkProgram(shaderProgram);
  _gl.validateProgram(shaderProgram);
  const vertStatus = _gl.getShaderParameter(vert, _gl.COMPILE_STATUS);
  const fragStatus = _gl.getShaderParameter(frag, _gl.COMPILE_STATUS);
  const linkStatus = _gl.getProgramParameter(shaderProgram, _gl.LINK_STATUS);
  const programValid = _gl.getProgramParameter(shaderProgram, _gl.VALIDATE_STATUS);
  console.log("Vertex shader status: " + vertStatus);
  console.log("Fragment shader status: " + fragStatus);
  console.log("Program link status: " + linkStatus);
  console.log("Program validate status: " + programValid);

  const uniform_modToClip = _gl.getUniformLocation(shaderProgram, "modToClip");
  const uniform_colour = _gl.getUniformLocation(shaderProgram, "colour");
  const attribute_modPosition = _gl.getAttribLocation(shaderProgram, "modPosition");
  const vertexBuffer_cellModel = loadBuffer(cellModel, null, _gl);
  const vertexBuffer_verticalLineModel = loadBuffer(verticalLineModel, null, _gl);
  const vertexBuffer_horizontalLineModel = loadBuffer(horizontalLineModel, null, _gl);
  const elementBuffer = loadBuffer(null, modelElements, _gl);
  glP = glParameters(uniform_modToClip, uniform_colour, attribute_modPosition,
                     vertexBuffer_cellModel, vertexBuffer_verticalLineModel,
                     vertexBuffer_horizontalLineModel, elementBuffer);
  _gl.useProgram(shaderProgram);

  gl = _gl;
  setInterval(handleRenderEvent, 11);
}

// This function loads vertex and element drawing data into GL buffers, which will be used to
// perform the rendering for each frame.
function loadBuffer(vertexArray, elementArray, _gl) {
  let buffer;
  if (elementArray === null) {
    buffer = _gl.createBuffer();
    _gl.bindBuffer(_gl.ARRAY_BUFFER, buffer);
    _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(vertexArray), _gl.STREAM_DRAW);
  }
  else {
    buffer = _gl.createBuffer();
    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, buffer);
    _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elementArray), _gl.STREAM_DRAW);
  }

  return buffer;
}

// This function applies the model to clip space transform function to the cell model for each
// live cell on the game board, thereby allowing a cell model to be rendered in each corresponding
// position.
function genCellTransforms(gameBoard, transformFunction, transformArray, i, j, maxI, maxJ) {
  if (i > maxI) {return;}

  if (gameBoard[i][j].quadrant1) {transformArray.push(transformFunction(i, j));}

  if (gameBoard[i][j].quadrant2) {transformArray.push(transformFunction(-i, j));}

  if (gameBoard[i][j].quadrant3) {transformArray.push(transformFunction(-i, -j));}

  if (gameBoard[i][j].quadrant4) {transformArray.push(transformFunction(i, -j));}

  if (j === maxJ) {
    genCellTransforms(gameBoard, transformFunction, transformArray, i + 1, 0, maxI, maxJ);
  }
  else {genCellTransforms(gameBoard, transformFunction, transformArray, i, j + 1, maxI, maxJ);}
}

function handleRenderEvent() {
  let transformArray = [];
  transformFunction = genModelTransformFunction(control.cam.x, control.cam.y, control.cam.z,
                                                glP.frustumScale(), glP.zNear(), glP.zFar());
  genCellTransforms(testGameBoard, transformFunction, transformArray, 0, 0, 4, 4);
  renderModels(1, transformArray, glP.uniform_modToClip(), glP.uniform_colour(),
               glP.attribute_modPosition(), glP.vertexBuffer_cellModel(),
               glP.vertexBuffer_verticalLineModel(), glP.vertexBuffer_horizontalLineModel(),
               glP.elementBuffer());
  gl.flush();
  gl.endFrameEXP();
}

// This function is used to render all the cell, vertical or horizontal graph line models
// for the current frame.
function renderModels(mode, transformArray, uniform_modToClip, uniform_colour,
                      attribute_modPosition, vertexBuffer_cellModel,
                      vertexBuffer_verticalLineModel, vertexBuffer_horizontalLineModel,
                      elementBuffer) {
  if (mode === 0) {
    if (transformArray.length === 0) {return;}
    let transform = transformArray.pop();
    gl.uniformMatrix4fv(uniform_modToClip, true, transform);
    gl.uniform4fv(uniform_colour, [0, 0, 1, 1]);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    renderModels(0, transformArray, uniform_modToClip, uniform_colour, attribute_modPosition,
                 vertexBuffer_cellModel, vertexBuffer_verticalLineModel,
                 vertexBuffer_horizontalLineModel, elementBuffer);
  }
  else {
    if (mode === 1) {gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer_cellModel);}
    else if (mode === 2) {gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer_verticalLineModel);}
    else {gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer_horizontalLineModel);}

    gl.vertexAttribPointer(attribute_modPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribute_modPosition);
    renderModels(0, transformArray, uniform_modToClip, uniform_colour, attribute_modPosition,
                 vertexBuffer_cellModel, vertexBuffer_verticalLineModel,
                 vertexBuffer_horizontalLineModel, elementBuffer);
  }
}

export {onContextCreation, control};
