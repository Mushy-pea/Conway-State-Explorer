// This module contains functions that implement the rendering of the game board by determining
// the contents of the corresponding GLView component for each frame.

import {matrix, multiply} from 'mathjs';
import vertexShader from './VertexShader.js';
import fragmentShader from './FragmentShader.js';

// This global variable is assigned a reference to the GL context that is created when the game
// board view is first rendered in App. 
var glContext;

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

function onContextCreation(gl) {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(1, 1, 1, 1);

  const vert = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vert, vertexShader);
  gl.compileShader(vert);

  const frag = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(frag, fragmentShader);
  gl.compileShader(frag);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vert);
  gl.attachShader(shaderProgram, frag);
  gl.linkProgram(shaderProgram);
  gl.validateProgram(shaderProgram);
  let vertStatus = gl.getShaderParameter(vert, gl.COMPILE_STATUS);
  let fragStatus = gl.getShaderParameter(frag, gl.COMPILE_STATUS);
  let linkStatus = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
  let programValid = gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS);
  console.log("Vertex shader status: " + vertStatus);
  console.log("Fragment shader status: " + fragStatus);
  console.log("Program link status: " + linkStatus);
  console.log("Program validate status: " + programValid);
  glContext = gl;

}

export {onContextCreation};
