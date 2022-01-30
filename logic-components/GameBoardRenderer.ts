// This module contains functions that implement the rendering of the game board by determining
// the contents of the corresponding GLView component for each frame.

import vertexShader from './VertexShader.ts';
import fragmentShader from './FragmentShader.ts';
import { cellModel, getLineModels, modelElements } from './GameBoardModels.ts';
import { gameBoardObject, handleUpdateEvent, handleResetEvent } from './GameLogic.ts';
import { control } from './StateController.ts';

// These global variables are assigned values related to the OpenGL context that will be needed to
// render the game board each frame.
var gl;
var glP;

// This function is used to encapsulate values related to the OpenGL context in an object, a
// reference to which is assigned to global variable glP when the renderer is initialised.
function glParameters(uniform_modToClip, uniform_colour, attribute_modPosition,
                      vertexBuffer_cellModel, vertexBuffer_verticalLineModel,
                      vertexBuffer_horizontalLineModel, elementBuffer) {
  const frustumScale = 1;
  const zNear = 0.5;
  const zFar = 100;
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

// This function determines the colour of cells when the stability colour fade option is enabled.
// Cells fade over a user defined range depending on how long they've been alive.
function applyColourFade(colourFadeSet, gameTime, lastBornOn) {
  const phase = Math.min(gameTime - lastBornOn, 15);
  const red = colourFadeSet.redStart + phase * colourFadeSet.redRate;
  const green = colourFadeSet.greenStart + phase * colourFadeSet.greenRate;
  const blue = colourFadeSet.blueStart + phase * colourFadeSet.blueRate;
  return [red, green, blue, 1];
}

// This function applies the model to clip space transform function for each live cell on the
// game board, thereby allowing a cell model to be rendered in each corresponding position.
function genCellTransforms(gameBoard, gameTime, colourFadeSet, transformFunction, transformArray,
                           arrayMax, minI, maxI, minJ, maxJ) {
  const colourRange = lastBornOn => applyColourFade(colourFadeSet, gameTime, lastBornOn);
  for (let i = 0; i <= arrayMax; i++) {
    for (let j = 0; j <= arrayMax; j++) {
      if (gameBoard[i][j].quadrant1 && i <= maxI && j <= maxJ) {
        let cellColour = colourRange(gameBoard[i][j].q1LastBornOn);
        transformArray.push({transform: transformFunction(j, -i), colour: cellColour});
      }

      if (gameBoard[i][j].quadrant2 && -i >= minI && j <= maxJ) {
        let cellColour = colourRange(gameBoard[i][j].q2LastBornOn);
        transformArray.push({transform: transformFunction(j, i), colour: cellColour});
      }

      if (gameBoard[i][j].quadrant3 && -i >= minI && -j >= minJ) {
        let cellColour = colourRange(gameBoard[i][j].q3LastBornOn);
        transformArray.push({transform: transformFunction(-j, i), colour: cellColour});
      }

      if (gameBoard[i][j].quadrant4 && i <= maxI && -j >= minJ) {
        let cellColour = colourRange(gameBoard[i][j].q4LastBornOn);
        transformArray.push({transform: transformFunction(-j, -i), colour: cellColour});
      }
    }
  }
}

// This function is used to apply the model to clip space transform function for each vertical and
// horizontal grid line on the game board, thereby allowing these grid lines to optionally be
// rendered.  The boundary of the board is always rendered.
function genGridTransforms(transformFunction, transformArray, i, j, diffI, diffJ, cMax) {
  const gridColour_ = control.getGridColour();
  const gridColour = [gridColour_.red, gridColour_.green, gridColour_.blue, gridColour_.alpha];
  const showGrid = control.getShowGrid();
  for (let c = 0; c <= cMax; c++) {
    if (showGrid || c === 0 || c === cMax) {
      transformArray.push({transform: transformFunction(i, j), colour: gridColour});
    }
    i += diffI;
    j += diffJ;
  }
}

// This function is used to render all the cell, vertical or horizontal graph line models
// for the current frame.
function renderModels(transformArray, uniform_modToClip, uniform_colour, attribute_modPosition,
                      vertexBuffer, elementBuffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(attribute_modPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribute_modPosition);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);

  while (transformArray.length != 0) {
    let transform = transformArray.pop();
    gl.uniformMatrix4fv(uniform_modToClip, true, transform.transform);
    gl.uniform4fv(uniform_colour, transform.colour);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  } 
}

// This function is the central branching point of this module and is called through an interval
// timer.
function handleRenderEvent() {
  const boardArraySize = control.getBoardArraySize();
  
  if (control.getMode() === "simulation") {handleUpdateEvent(boardArraySize)}
  else if (control.getMode() === "reset") {
    handleResetEvent(boardArraySize);
    control.changeMode(true);
  }
  
  const {cameraX, cameraY, cameraZ} = control.getCamera();
  transformFunction = genModelTransformFunction(cameraX, cameraY, cameraZ, glP.frustumScale(),
                                                glP.zNear(), glP.zFar());
  gl.clear(gl.COLOR_BUFFER_BIT);
  const aspectRatio = gl.drawingBufferHeight / gl.drawingBufferWidth;
  const renderRange = {minI: Math.trunc(cameraY - 1.478003 - 41),
                       maxI: Math.trunc(cameraY - 1.478003 + 41 + 80 * (aspectRatio - 1)),
                       minJ: Math.trunc(-(cameraX + 0.611501) - 41),
                       maxJ: Math.trunc(-(cameraX + 0.611501) + 41)};
  const max = boardArraySize - 1;
  const min = -max;
  const colourFadeSet = control.getColourFadeSet();
  let transformArray = [];
  genCellTransforms(gameBoardObject.gameBoard, gameBoardObject.gameTime, colourFadeSet,
                    transformFunction, transformArray, max, renderRange.minI, renderRange.maxI,
                    renderRange.minJ, renderRange.maxJ);
  renderModels(transformArray, glP.uniform_modToClip(), glP.uniform_colour(),
               glP.attribute_modPosition(), glP.vertexBuffer_cellModel(), glP.elementBuffer());
  const boardAxisSize = (boardArraySize - 1) * 2 + 1;
  genGridTransforms(transformFunction, transformArray, min, 0, 1, 0, boardAxisSize);
  renderModels(transformArray, glP.uniform_modToClip(), glP.uniform_colour(),
               glP.attribute_modPosition(), glP.vertexBuffer_horizontalLineModel(),
               glP.elementBuffer());
  genGridTransforms(transformFunction, transformArray, 0, min, 0, 1, boardAxisSize);
  renderModels(transformArray, glP.uniform_modToClip(), glP.uniform_colour(),
               glP.attribute_modPosition(), glP.vertexBuffer_verticalLineModel(),
               glP.elementBuffer());
  gl.flush();
  gl.endFrameEXP();
}

// This function is called when the corresponding GLView component is first rendered in App.
// It creates the single GL shader program used for rendering the game board and assigns values
// related to the GL context to the global variables gl and glP.
function onContextCreation(_gl) {
  _gl.viewport(0, 0, _gl.drawingBufferWidth, _gl.drawingBufferHeight);
  const {red, green, blue, alpha} = control.getBackgroundColour();
  _gl.clearColor(red, green, blue, alpha);
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
  console.log(`Vertex shader status: ${_gl.getShaderParameter(vert, _gl.COMPILE_STATUS)}`);
  console.log(`Fragment shader status: ${_gl.getShaderParameter(frag, _gl.COMPILE_STATUS)}`);
  console.log(`Program link status: ${_gl.getProgramParameter(shaderProgram, _gl.LINK_STATUS)}`);
  console.log(`Program validate status:
               ${_gl.getProgramParameter(shaderProgram, _gl.VALIDATE_STATUS)}`);
  const uniform_modToClip = _gl.getUniformLocation(shaderProgram, "modToClip");
  const uniform_colour = _gl.getUniformLocation(shaderProgram, "colour");
  const attribute_modPosition = _gl.getAttribLocation(shaderProgram, "modPosition");
  const vertexBuffer_cellModel = loadBuffer(cellModel, null, _gl);
  const boardArraySize = control.getBoardArraySize();
  const lineModels = getLineModels(boardArraySize);
  const vertexBuffer_verticalLineModel = loadBuffer(lineModels.verticalLineModel, null, _gl);
  const vertexBuffer_horizontalLineModel = loadBuffer(lineModels.horizontalLineModel, null, _gl);
  const elementBuffer = loadBuffer(null, modelElements, _gl);
  glP = glParameters(uniform_modToClip, uniform_colour, attribute_modPosition,
                     vertexBuffer_cellModel, vertexBuffer_verticalLineModel,
                     vertexBuffer_horizontalLineModel, elementBuffer);
  _gl.useProgram(shaderProgram);

  gl = _gl;
  if (control.getIntervalID() === null) {handleResetEvent(boardArraySize)}
  control.setIntervalID(setInterval(handleRenderEvent, 200));
}

export {onContextCreation};
