// This module contains functions that implement the rendering of the game board by determining
// the contents of the corresponding GLView component for each frame.

import {matrix, multiply} from 'mathjs';

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

