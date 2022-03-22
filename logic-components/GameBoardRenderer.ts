// This module contains functions that implement the rendering of the game board by determining
// the contents of the corresponding GLView component for each frame.

import vertexShader from './VertexShader';
import fragmentShader from './FragmentShader';
import { cellModel, LineModels, modelElements } from './GameBoardModels';
import { gameBoardObject, handleUpdateEvent, handleResetEvent } from './GameLogic';
import { store, changeMode, setIntervalID, ColourFadeSet } from './StateController';
import { BoardCell , getCellState } from './GameLogicTypes';

// This global const holds a handle to the OpenGL context created when onContextCreation is called.
const gl = {
  context: null
};

// This global const is assigned an object ready to hold the seven OpenGL state values that
// will be needed to perform the required rendering each frame.
const glP = glParameters();

// This function is used to encapsulate values related to the OpenGL context in an object, a
// reference to which is assigned to global variable glP when the renderer is initialised.
function glParameters() {
  const frustumScale = 1;
  const zNear = 0.5;
  const zFar = 100;
  let uniform_modToClip;
  let uniform_colour;
  let attribute_modPosition;
  let vertexBuffer_cellModel;
  let vertexBuffer_verticalLineModel;
  let vertexBuffer_horizontalLineModel;
  let elementBuffer;

  return {
    setUniform_modToClip: function(modToClip) {
      uniform_modToClip = modToClip;
    },
    setUniform_colour: function(colour) {
      uniform_colour = colour;
    },
    setAttribute_modPosition: function(modPosition) {
      attribute_modPosition = modPosition;
    },
    setVertexBuffer_cellModel: function(cellModel) {
      vertexBuffer_cellModel = cellModel;
    },
    setVertexBuffer_verticalLineModel: function(verticalLineModel) {
      vertexBuffer_verticalLineModel = verticalLineModel;
    },
    setVertexBuffer_horizontalLineModel: function(horizontalLineModel) {
      vertexBuffer_horizontalLineModel = horizontalLineModel;
    },
    setElementBuffer: function (newElementBuffer) {
      elementBuffer = newElementBuffer;
    },
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
function genModelTransformFunction(x : number, y : number, z : number, frustumTerm1 : number,
                                   zNear : number, zFar: number)
                                  : (i: number, j: number) => number[] {
  const window = {width: gl.context.drawingBufferWidth, height: gl.context.drawingBufferHeight};
  const frustumTerm0 = frustumTerm1 / (window.width / window.height);
  const frustumTerm2 = (zFar + zNear) / (zNear - zFar);
  const frustumTerm3 = (2 * zFar * zNear) / (zNear - zFar);

  function modelTransformFunction(i : number, j: number) {
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
function applyColourFade(colourFadeSet : ColourFadeSet, gameTime : number, lastBornOn : number)
                        : number[] {
  const phase = Math.min(gameTime - lastBornOn, 15);
  const red = colourFadeSet.redStart + phase * colourFadeSet.redRate;
  const green = colourFadeSet.greenStart + phase * colourFadeSet.greenRate;
  const blue = colourFadeSet.blueStart + phase * colourFadeSet.blueRate;
  return [red, green, blue, 1];
}

// This function applies the model to clip space transform function for each live cell on the
// game board, thereby allowing a cell model to be rendered in each corresponding position.
function genCellTransforms(gameBoard : BoardCell[], gameTime : number,
                           colourFadeSet : ColourFadeSet,
                           transformFunction : (i: number, j: number) => number[],
                           transformArray : object[], minI : number,
                           maxI : number, minJ : number, maxJ : number) : void {
  for (let i = minI; i <= maxI; i++) {
    for (let j = minJ; j <= maxJ; j++) {
      const cell = getCellState(gameBoard, i, j);
      if (cell.cellState) {
        const cellColour = applyColourFade(colourFadeSet, gameTime, cell.lastBornOn);
        transformArray.push({transform: transformFunction(j, -i), colour: cellColour});
      }
    }
  }
}

// This function is used to apply the model to clip space transform function for each vertical and
// horizontal grid line on the game board, thereby allowing these grid lines to optionally be
// rendered.  The boundary of the board is always rendered.
function genGridTransforms(transformFunction : (i: number, j: number) => number[],
                           transformArray : object[], i : number, j : number, diffI : number,
                           diffJ : number, cMax : number) : void {
  const {red, green, blue, alpha} = store.getState().gridColour;
  const gridColour = [red, green, blue, alpha];
  const showGrid = store.getState().showGrid;
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
function renderModels(transformArray, uniform_modToClip, uniform_colour,
                      attribute_modPosition, vertexBuffer, elementBuffer) {
  gl.context.bindBuffer(gl.context.ARRAY_BUFFER, vertexBuffer);
  gl.context.vertexAttribPointer(attribute_modPosition, 4, gl.context.FLOAT, false, 0, 0);
  gl.context.enableVertexAttribArray(attribute_modPosition);
  gl.context.bindBuffer(gl.context.ELEMENT_ARRAY_BUFFER, elementBuffer);

  while (transformArray.length != 0) {
    const transform = transformArray.pop();
    gl.context.uniformMatrix4fv(uniform_modToClip, true, transform.transform);
    gl.context.uniform4fv(uniform_colour, transform.colour);
    gl.context.drawElements(gl.context.TRIANGLES, 6, gl.context.UNSIGNED_SHORT, 0);
  } 
}

// This function is the central branching point of this module and is called through an interval
// timer.
function handleRenderEvent(updateCycle : boolean) : void {
  const boardArraySize = store.getState().boardArraySize;
  const mode = store.getState().mode;
  
  if (mode === "simulation" && updateCycle) {handleUpdateEvent(boardArraySize)}
  else if (mode === "reset") {
    handleResetEvent(boardArraySize, []);
    store.dispatch(changeMode(true));
  }
  
  const camera = store.getState().camera;
  const transformFunction = genModelTransformFunction(camera.x, camera.y, camera.z,
                                                      glP.frustumScale(), glP.zNear(), glP.zFar());
  gl.context.clear(gl.context.COLOR_BUFFER_BIT);
  const aspectRatio = gl.context.drawingBufferHeight / gl.context.drawingBufferWidth;
  const renderRange = {minI: Math.trunc(camera.y - 1.478003 - 41),
                       maxI: Math.trunc(camera.y - 1.478003 + 41 + 80 * (aspectRatio - 1)),
                       minJ: Math.trunc(-(camera.x + 0.611501) - 41),
                       maxJ: Math.trunc(-(camera.x + 0.611501) + 41)};
  const max = boardArraySize - 1;
  const min = -max;
  const colourFadeSet = store.getState().colourFadeSet;
  const colourFadeSet_ = {...colourFadeSet};
  if (! colourFadeSet.enabled) {
    colourFadeSet_.redRate = 0;
    colourFadeSet_.greenRate = 0;
    colourFadeSet_.blueRate = 0;
  }
  const transformArray = [];
  genCellTransforms(gameBoardObject.gameBoard, gameBoardObject.gameTime, colourFadeSet_,
                    transformFunction, transformArray, renderRange.minI, renderRange.maxI,
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
  gl.context.flush();
  gl.context.endFrameEXP();
}

// This function is called when the corresponding GLView component is first rendered in App.
// It creates the single GL shader program used for rendering the game board and assigns values
// related to the GL context to the global variables gl and glP.
function onContextCreation(_gl) : void {
  _gl.viewport(0, 0, _gl.drawingBufferWidth, _gl.drawingBufferHeight);
  const {red, green, blue, alpha} = store.getState().backgroundColour;
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
  const boardArraySize = store.getState().boardArraySize;
  const lineModels = new LineModels(boardArraySize);
  glP.setUniform_modToClip(_gl.getUniformLocation(shaderProgram, "modToClip"));
  glP.setUniform_colour(_gl.getUniformLocation(shaderProgram, "colour"));
  glP.setAttribute_modPosition(_gl.getAttribLocation(shaderProgram, "modPosition"));
  glP.setVertexBuffer_cellModel(loadBuffer(cellModel, null, _gl));
  glP.setVertexBuffer_verticalLineModel(loadBuffer(lineModels.verticalLineModel, null, _gl));
  glP.setVertexBuffer_horizontalLineModel(loadBuffer(lineModels.horizontalLineModel, null, _gl));
  glP.setElementBuffer(loadBuffer(null, modelElements, _gl));
  _gl.useProgram(shaderProgram);

  gl.context = _gl;
  if (store.getState().intervalID === null) {handleResetEvent(boardArraySize, [])}
  store.dispatch(setIntervalID(setInterval(handleRenderEvent, 200, true)));
}

export {onContextCreation, handleRenderEvent};
