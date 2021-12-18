// This module contains functions that implement the rendering of the game board by determining
// the contents of the corresponding GLView component for each frame.

import vertexShader from './VertexShader.js';
import fragmentShader from './FragmentShader.js';
import {cellModel, verticalLineModel, horizontalLineModel, modelElements}
from './GameBoardModels.js';
import {gameBoardObject, handleUpdateEvent, handleResetEvent} from './GameLogic.js';

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

// The top level application state that can be modified through the UI is encapsulated in the object
// returned by getControlObject.  This includes everything except the game board state.
// A reference to this object is assigned to global variable control when the renderer
// is initialised.
var control;

function getControlObject() {
  let mode = "creative";
  let showGrid = true;
  const camera = {
    x: 0, y: 0, z: -72
  };
  let foregroundColour = {red: 0, green: 0, blue: 1, alpha: 1};
  let backgroundColour = {red: 1, green: 1, blue: 1, alpha: 1};
  let colourFadeSet = {
    redStart: 0, redRate: 0.067, greenStart: 0, greenRate: 0, blueStart: 1, blueRate: 0
  };
  let boardAxisSize = 41;
  let scale = Math.abs(camera.z) / 8;

  return {
    setMode: function(newMode) {
      mode = newMode;
    },
    setShowGrid: function(newMode) {
      showGrid = newMode;
    },
    moveCameraLeft: function() {
      camera.x += scale;
    },
    moveCameraRight: function() {
      camera.x -= scale;
    },
    moveCameraUp: function() {
      camera.y -= scale;
    },
    moveCameraDown: function() {
      camera.y += scale;
    },
    moveCameraBack: function() {
      camera.z -= 1;
    },
    moveCameraForward: function() {
      camera.z += 1;
    },
    setForegroundColour: function(red, green, blue, alpha) {
      foregroundColour.red = red;
      foregroundColour.green = green;
      foregroundColour.blue = blue;
      foregroundColour.alpha = alpha;
    },
    setBackgroundColour: function(red, green, blue, alpha) {
      backgroundColour.red = red;
      backgroundColour.green = green;
      backgroundColour.blue = blue;
      backgroundColour.alpha = alpha;
    },
    setBoardAxisSize: function(size) {
      boardAxisSize = size;
    },
    getMode: function() {
      return mode;
    },
    getShowGrid: function() {
      return showGrid;
    },
    getCamera: function() {
      return {
        x: camera.x, y: camera.y, z: camera.z
      };
    },
    getForegroundColour: function() {
      return [foregroundColour.red, foregroundColour.green, foregroundColour.blue,
              foregroundColour.alpha];
    },
    getBackgroundColour: function() {
      return [backgroundColour.red, backgroundColour.green, backgroundColour.blue,
              backgroundColour.alpha];
    },
    getColourFadeSet: function() {
      return {
        redStart: colourFadeSet.redStart, redRate: colourFadeSet.redRate,
        greenStart: colourFadeSet.greenStart, greenRate: colourFadeSet.greenRate,
        blueStart: colourFadeSet.blueStart, blueRate: colourFadeSet.blueRate
      };
    },
    getBoardAxisSize: function() {
      return boardAxisSize;
    }
  }
}

// This function is called from App before GL context creation so that the controls are ready to
// use in time.
function initialiseControls() {
  control = getControlObject();
}

// This function returns a function that is used to generate the transformation matrix that is
// passed to the vertex shader for each model rendered.
function genModelTransformFunction(x, y, z, frustumTerm1, zNear, zFar) {
  const window = {width: gl.drawingBufferWidth, height: gl.drawingBufferHeight};
  const frustumTerm0 = frustumTerm1 / (window.width / window.height);
  const frustumTerm2 = (zFar + zNear) / (zNear - zFar);
  const frustumTerm3 = (2 * zFar * zNear) / (zNear - zFar);

  function modelTransformFunction(i, j) {
    const modelToClip = [frustumTerm0, 0, 0, frustumTerm0 * (x + i),
                         0, frustumTerm1, 0, frustumTerm1 * (y + j),
                         0, 0, frustumTerm2, frustumTerm2 * z + frustumTerm3,
                         0, 0, -1, -z];
    return modelToClip;
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
  let boardAxisSize = control.getBoardAxisSize();
  handleResetEvent(boardAxisSize);
  setInterval(handleRenderEvent, 200);
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

// This function is used to apply the model to clip space transform function for each vertical or
// horizontal grid line on the game board, thereby allowing these grid lines to optionally be
// rendered.
function genGridTransforms(transformFunction, transformArray, i, j, diffI, diffJ, cMax) {
  let gridColour = control.getForegroundColour();
  for (let c = 0; c <= cMax; c++) {
    transformArray.push({transform: transformFunction(i, j), colour: gridColour});
    i += diffI;
    j += diffJ;
  }
}

// This function determines the colour of cells when the stability colour fade option is enabled.
// Cells fade over a user defined range depending on how long they've been alive.
function applyColourFade(colourFadeSet, lastBornOn, gameTime) {
  const phase = Math.min(gameTime - lastBornOn, 15);
  const red = colourFadeSet.redStart + phase * colourFadeSet.redRate;
  const green = colourFadeSet.greenStart + phase * colourFadeSet.greenRate;
  const blue = colourFadeSet.blueStart + phase * colourFadeSet.blueRate;
  return [red, green, blue, 1];
}

// This function applies the model to clip space transform function for each live cell on the
// game board, thereby allowing a cell model to be rendered in each corresponding position.
function genCellTransforms(gameBoard, gameTime, colourFadeSet, transformFunction, transformArray,
                           max) {
  for (let i = 0; i <= max; i++) {
    for (let j = 0; j <= max; j++) {
      if (gameBoard[i][j].quadrant1) {
        let cellColour =
          applyColourFade(colourFadeSet, gameBoard[i][j].q1LastBornOn, gameTime, i, j);
        transformArray.push({transform: transformFunction(i, j), colour: cellColour});
      }

      if (gameBoard[i][j].quadrant2) {
        let cellColour =
          applyColourFade(colourFadeSet, gameBoard[i][j].q2LastBornOn, gameTime, -i, j);
        transformArray.push({transform: transformFunction(-i, j), colour: cellColour});
      }

      if (gameBoard[i][j].quadrant3) {
        let cellColour =
          applyColourFade(colourFadeSet, gameBoard[i][j].q3LastBornOn, gameTime, -i, -j);
        transformArray.push({transform: transformFunction(-i, -j), colour: cellColour});
      }

      if (gameBoard[i][j].quadrant4) {
        let cellColour =
          applyColourFade(colourFadeSet, gameBoard[i][j].q4LastBornOn, gameTime, i, -j);
        transformArray.push({transform: transformFunction(i, -j), colour: cellColour});
      }
    }
  }
}

// This function is the central branching point of this module and is called through an interval
// timer.
function handleRenderEvent() {
  const boardAxisSize = control.getBoardAxisSize();
  const max = boardAxisSize - 1;
  const {x, y, z} = control.getCamera();
  const gameTime = gameBoardObject.gameTime;
  const colourFadeSet = control.getColourFadeSet();
  handleUpdateEvent(boardAxisSize);
  transformFunction = genModelTransformFunction(x, y, z, glP.frustumScale(), glP.zNear(),
                                                glP.zFar());
  gl.clear(gl.COLOR_BUFFER_BIT);
  let transformArray = [];
  genCellTransforms(gameBoardObject.gameBoard, gameTime, colourFadeSet, transformFunction,
                    transformArray, max);
  renderModels(transformArray, glP.uniform_modToClip(), glP.uniform_colour(),
               glP.attribute_modPosition(), glP.vertexBuffer_cellModel(), glP.elementBuffer());
  genGridTransforms(transformFunction, transformArray, -64, 0, 1, 0, 127);
  renderModels(transformArray, glP.uniform_modToClip(), glP.uniform_colour(),
              glP.attribute_modPosition(), glP.vertexBuffer_horizontalLineModel(),
              glP.elementBuffer());
  genGridTransforms(transformFunction, transformArray, 0, -64, 0, 1, 127);
  renderModels(transformArray, glP.uniform_modToClip(), glP.uniform_colour(),
              glP.attribute_modPosition(), glP.vertexBuffer_verticalLineModel(),
              glP.elementBuffer());
  gl.flush();
  gl.endFrameEXP();
}

// This function is used to render all the cell, vertical or horizontal graph line models
// for the current frame.
function renderModels(transformArray, uniform_modToClip, uniform_colour, attribute_modPosition,
                      vertexBuffer, elementBuffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(attribute_modPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribute_modPosition);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);

  do {
    let transform = transformArray.pop();
    gl.uniformMatrix4fv(uniform_modToClip, true, transform.transform);
    gl.uniform4fv(uniform_colour, transform.colour);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  } while (transformArray.length != 0)
}

export {onContextCreation, control, initialiseControls};
