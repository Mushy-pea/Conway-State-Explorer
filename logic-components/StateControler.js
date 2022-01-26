import { gameBoardObject, getCellState, setCellState, setUpdateTable, cellUpdaterFunctions2 }
from './GameLogic.js';

// The top level application state that can be modified through the UI is encapsulated in the object
// returned by getControlObject.  This includes everything except the game board state.
var control;

function getControlObject() {
  let mode = "creative";
  let intervalID = null;
  let showGrid = true;
  const camera = {
    x: -0.611501, y: 1.478003, z: -45
  };
  const foregroundColour = {red: 0, green: 0, blue: 1, alpha: 1};
  const backgroundColour = {red: 1, green: 1, blue: 1, alpha: 1};
  const colourFadeSet = {
    redStart: 0, redRate: 0.067, greenStart: 0, greenRate: 0, blueStart: 1, blueRate: 0
  };
  let boardArraySize = 41;
  let scale = Math.abs(camera.z) / 20;
  let lastCellTouched = null;
  let tpsT1 = null;
  let lastFrameTime = null;
  let patternName = "[userName defined]";

  return {
    changeMode: function(resetSwitch) {
      if (resetSwitch) {
        if (mode !== "reset") {
          mode = "reset";
          return;
        }
        else {
          mode = "creative";
          return;
        }
      }
    
      if (mode === "creative") {mode = "simulation"}
      else {mode = "creative"}
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
      if (camera.z <= -44) {camera.z = -45}
      else {camera.z -= 1}
      scale = Math.abs(camera.z) / 20;
    },
    moveCameraForward: function() {
      if (camera.z >= -6) {camera.z = -5}
      else {camera.z += 1}
      scale = Math.abs(camera.z) / 20;
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
    setBoardArraySize: function(size) {
      boardArraySize = size;
    },
    setPatternName: function(name) {
      patternName = name;
    },
    getMode: function() {
      return mode;
    },
    getShowGrid: function() {
      return showGrid;
    },
    getCamera: function() {
      return {
        cameraX: camera.x, cameraY: camera.y, cameraZ: camera.z
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
    getBoardArraySize: function() {
      return boardArraySize;
    },
    getBoardDimensions: function() {
      const dimension = (boardArraySize - 1) * 2 + 1;
      return (`${dimension} * ${dimension}`);
    },
    getGameTime: function() {
      return (`${gameBoardObject.gameTime}`);
    },
    getTotalPopulation: function() {
      return (`${gameBoardObject.totalPopulation}`);
    },
    getFrameCheckInterval: function() {
      if (gameBoardObject.gameTime % 5 !== 0) {return `${lastFrameTime} ms`}
      const t2 = new Date();
      if (tpsT1 === null) {
        tpsT1 = t2;
        return null;
      }
      else {
        const frameTime = (t2.getMilliseconds() - tpsT1.getMilliseconds()) / 5;
        tpsT1 = t2;
        lastFrameTime = frameTime;
        return (`${t2.getMilliseconds() - tpsT1.getMilliseconds()} ms`);
      }
    },
    getPatternName: function() {
      return patternName;
    },
    flipCellStateOnTouch: function(event, window, touch) {
      lastCellTouched = flipCellStateOnTouch(event, window, touch, camera, lastCellTouched);
    },
    setIntervalID: function(id) {
      intervalID = id;
    },
    getIntervalID: function() {
      return intervalID;
    }
  }
}

// This function processes touch input captured by the game board container component in MainScreen
// and updates the state of the game board accordingly.
function flipCellStateOnTouch(event, window, touch, camera, lastCellTouched) {
  if (control.getMode() === "simulation") {return null}
  const applyTruncation = x => {
    if (x < 0) {return Math.trunc(x) - 1}
    else {return Math.trunc(x)}
  };
  const flipCell = (i, j) => {
    const nextCellState = ! getCellState(gameBoardObject.gameBoard, i, j).cellState;
    setCellState(gameBoardObject.gameBoard, nextCellState, gameBoardObject.gameTime,
                 cellUpdaterFunctions2, i, j);
    setUpdateTable(gameBoardObject.boardUpdateTable, gameBoardObject.gameTime, i, j);
  };
  const cameraXYDiff = {x: camera.x - 35.48849883999984, y: camera.y + 36.02199604000001};
  const cameraZRatio = camera.z / -5;
  const cameraZDiff = {x: -((9 * cameraZRatio) - 9) / 2, y: -((9.9 * cameraZRatio) - 9.9) / 2};
  const scaling = window.width / (9 * cameraZRatio);
  const i = applyTruncation(touch.y / scaling + cameraXYDiff.y + cameraZDiff.y - 40);
  const j = applyTruncation(touch.x / scaling - cameraXYDiff.x + cameraZDiff.x - 40);
  if (event === "touchReleased" ) {
    flipCell(i, j);
    lastCellTouched = null;
  }
  else if (event === "touchMoved" && lastCellTouched !== null) {
    if (! (i === lastCellTouched.i && j === lastCellTouched.j)) {
      flipCell(lastCellTouched.i, lastCellTouched.j);
      lastCellTouched = {i: i, j: j};
    }
  }
  else {
    lastCellTouched = {i: i, j: j};
  }

  return lastCellTouched;
}

// This function is called from MainScreen before GL context creation so that the controls are ready
// to use in time.
function initialiseControls() {
  control = getControlObject();
}

export {control, initialiseControls};
