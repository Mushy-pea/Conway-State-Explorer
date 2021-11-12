// This module contains functions that implement the rendering of the game board by determining
// the contents of the corresponding GLView component for each frame.

import {matrix, multiply} from 'mathjs';
import vertexShader from './VertexShader.js';
import fragmentShader from './FragmentShader.js';
import {cellModel, verticalLineModel, horizontalLineModel, modelElements} from './GameBoardModels.js';

// These global variables are assigned values related to the OpenGL context that will be needed to
// render the game board each frame.
var gl;
const glParameters = {
  uniform_modToClip: 0,
  uniform_colour: 0,
  attribute_modPosition: 0,
  vertexBuffer_cellModel: 0,
  vertexBuffer_verticalLineModel: 0,
  vertexBuffer_horizontalLineModel: 0,
  elementBuffer: 0
};

const frontendState = {
  mode: "creative",
  cameraPosition: {
    x: 0, y: 0, z: 5
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
function genModelTransformFunction(x, y, z, frustumScale0, frustumScale1, zNear, zFar) {
  const axesInversion = matrix([[0, -1, 0, 0], [0, 0, 1, 0], [-1, 0, 0, 0], [0, 0, 0, 1]]);
  const worldToCamera = multiply(axesInversion, translate(x, y, z));
  const cameraToClip = matrix([[frustumScale0, 0, 0, 0], [0, frustumScale1, 0, 0], [0, 0,
                                ((zFar + zNear) / (zNear - zFar)),
                                ((2 * zFar * zNear) / (zNear - zFar))], [0, 0, -1, 0]]);
  const worldToClip = multiply(cameraToClip, worldToCamera);

  function modelTransformFunction(i, j) {
    const modelToWorld = translate(i, j, 0);
    const modelToClip = multiply(worldToClip, modelToWorld);
    return modelToClip;
  }

  return modelTransformFunction;
}

// This function is called when the corresponding GLView component is first rendered in App.
// It creates the single GL shader program used for rendering the game board and assigns values
// related to the GL context to the global variables gl and glParameters.
function onContextCreation(_gl) {
  _gl.viewport(0, 0, _gl.drawingBufferWidth, _gl.drawingBufferHeight);
  _gl.clearColor(1, 1, 1, 1);

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
  glParameters.uniform_modToClip = _gl.getUniformLocation(shaderProgram, "modToClip");
  glParameters.uniform_colour = _gl.getUniformLocation(shaderProgram, "colour");
  glParameters.attribute_modPosition = _gl.getAttribLocation(shaderProgram, "modPosition");
  glParameters.vertexBuffer_cellModel = loadBuffer(cellModel, null);
  glParameters.vertexBuffer_verticalLineModel = loadBuffer(verticalLineModel, null);
  glParameters.vertexBuffer_horizontalLineModel = loadBuffer(horizontalLineModel, null);
  glParameters.elementBuffer = loadBuffer(null, modelElements);
  gl.useProgram(shaderProgram);

  setInterval(handleRenderEvent, 16.67, frontendState.mode, frontendState.cameraPosition);

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

function handleRenderEvent(mode, cameraPosition) {
  const transformFunction = genModelTransformFunction(cameraPosition.x, cameraPosition.y, cameraPosition.z, 1.25, 1.25, 0.5, 100);
  renderGameBoard(transformFunction);
}

function renderGameBoard(transformFunction) {
  const testTransform = transformFunction(0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, glParameters.vertexBuffer_cellModel);
  gl.vertexAttribPointer(glParameters.attribute_modPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(glParameters.attribute_modPosition);

  gl.uniformMatrix4fv(glParameters.uniform_modToClip, false, testTransform);
  gl.uniform4fv(glParameters.uniform_colour, new Float32Array([0, 0, 1, 1]));

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glParameters.elementBuffer);
  gl.drawElements(gl.TRIANGLES, 6, gl.FLOAT, 0);

}

export {onContextCreation};
