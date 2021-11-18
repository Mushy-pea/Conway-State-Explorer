// This module contains functions that implement the rendering of the game board by determining
// the contents of the corresponding GLView component for each frame.

import {matrix, multiply} from 'mathjs';
import vertexShader from './VertexShader.js';
import fragmentShader from './FragmentShader.js';
import {cellModel, verticalLineModel, horizontalLineModel, modelElements}
from './GameBoardModels.js';

// These global variables are assigned values related to the OpenGL context that will be needed to
// render the game board each frame.
var gl;
const glP = {
  uniform_modToClip: 0,
  uniform_colour: 0,
  attribute_modPosition: 0,
  vertexBuffer_cellModel: 0,
  vertexBuffer_verticalLineModel: 0,
  vertexBuffer_horizontalLineModel: 0,
  elementBuffer: 0,

  frustumScale0: 1,
  frustumScale1: 1,
  zNear: 0.5,
  zFar: 100
};

// These global variables are exposed to App so they can be modified in response to UI inputs.
const control = {
  mode: "simulation",
  cam: {
    x: 0, y: 0, z: -4
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
function genModelTransformFunction(x, y, z) {
  const worldToCamera = translate(x, y, z);
  const cameraToClip =
  matrix([[glP.frustumScale0, 0, 0, 0],
          [0, glP.frustumScale1, 0, 0],
          [0, 0, ((glP.zFar + glP.zNear) / (glP.zNear - glP.zFar)), ((2 * glP.zFar * glP.zNear) / (glP.zNear - glP.zFar))],
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

  gl = _gl;
  glP.uniform_modToClip = _gl.getUniformLocation(shaderProgram, "modToClip");
  glP.uniform_colour = _gl.getUniformLocation(shaderProgram, "colour");
  glP.attribute_modPosition = _gl.getAttribLocation(shaderProgram, "modPosition");
  glP.vertexBuffer_cellModel = loadBuffer(cellModel, null);
  glP.vertexBuffer_verticalLineModel = loadBuffer(verticalLineModel, null);
  glP.vertexBuffer_horizontalLineModel = loadBuffer(horizontalLineModel, null);
  glP.elementBuffer = loadBuffer(null, modelElements);
  gl.useProgram(shaderProgram);

  setInterval(handleRenderEvent, 11.11);

}

// This function loads vertex and element drawing data into GL buffers, which will be used to
// perform the rendering for each frame.
function loadBuffer(vertexArray, elementArray) {
  let buffer;
  if (elementArray === null) {
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STREAM_DRAW);
  }
  else {
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elementArray), gl.STREAM_DRAW);
  }

  return buffer;
}

function handleRenderEvent() {
  const transformFunction = genModelTransformFunction(control.cam.x, control.cam.y, control.cam.z);
  renderGameBoard(transformFunction);
  
}

function renderGameBoard(transformFunction) {
  const testTransform = transformFunction(0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, glP.vertexBuffer_cellModel);
  gl.vertexAttribPointer(glP.attribute_modPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(glP.attribute_modPosition);

  gl.uniformMatrix4fv(glP.uniform_modToClip, false, testTransform);
  gl.uniform4fv(glP.uniform_colour, [0, 0, 1, 1]);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glP.elementBuffer);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  gl.flush();
  gl.endFrameEXP();
  
  if (control.mode === 0) {
    console.log("\ntransform: " + JSON.stringify(testTransform));
    const errorLog = gl.getError();
    console.log("\n:GL error log: " + errorLog);
    
    const cellModel0 = matrix([0, 0, 0, 1]);
    const cellModel1 = matrix([1, 0, 0, 1]);
    const cellModel2 = matrix([1, 1, 0, 1]);
    const cellModel3 = matrix([0, 1, 0, 1]);

    const cellModelClip0 = multiply(testTransform, cellModel0);
    const cellModelClip1 = multiply(testTransform, cellModel1);
    const cellModelClip2 = multiply(testTransform, cellModel2);
    const cellModelClip3 = multiply(testTransform, cellModel3);

    console.log("\n\ncellModelClip0: " + JSON.stringify(cellModelClip0));
    console.log("\ncellModelClip1: " + JSON.stringify(cellModelClip1));
    console.log("\ncellModelClip2: " + JSON.stringify(cellModelClip2));
    console.log("\ncellModelClip3: " + JSON.stringify(cellModelClip3));
    control.mode = 1;

    
  }

}

export {onContextCreation};
