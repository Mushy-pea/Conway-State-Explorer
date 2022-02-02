import { gameBoardObject, getCellState, setCellState, setUpdateTable, cellUpdaterFunctions2 }
from './GameLogic';

// The top level application state that can be modified through the UI is encapsulated in the object
// returned by getControlObject.  This includes everything except the game board state.
const control = getControlObject();

function getControlObject() {
  let mode = "creative";
  let intervalID = null;
  let showGrid = true;
  const camera = {
    x: -0.611501, y: 1.478003, z: -45
  };
  const gridColour = {red: 0, green: 0, blue: 1, alpha: 1};
  const backgroundColour = {red: 1, green: 1, blue: 1, alpha: 1};
  const colourFadeSet = {
    redStart: 0, redRate: 0.067, greenStart: 0, greenRate: 0, blueStart: 1, blueRate: 0,
    enabled: false
  };
  let boardArraySize = 41;
  let scale = Math.abs(camera.z) / 20;
  let lastCellTouched = null;
  let tpsT1 = null;
  let lastFrameTime = null;
  let patternName = "[userName defined]";

  return {
    changeMode: function(resetSwitch : boolean) : void {
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
    setShowGrid: function(newMode : boolean) : void {
      showGrid = newMode;
    },
    moveCameraLeft: function() : void {
      camera.x += scale;
    },
    moveCameraRight: function() : void {
      camera.x -= scale;
    },
    moveCameraUp: function() : void {
      camera.y -= scale;
    },
    moveCameraDown: function() : void {
      camera.y += scale;
    },
    moveCameraBack: function() : void {
      if (camera.z <= -44) {camera.z = -45}
      else {camera.z -= 1}
      scale = Math.abs(camera.z) / 20;
    },
    moveCameraForward: function() : void {
      if (camera.z >= -6) {camera.z = -5}
      else {camera.z += 1}
      scale = Math.abs(camera.z) / 20;
    },
    setGridColour: function(red : number, green : number, blue : number, alpha : number) : void {
      gridColour.red = red;
      gridColour.green = green;
      gridColour.blue = blue;
      gridColour.alpha = alpha;
    },
    setBackgroundColour: function(red : number, green : number, blue : number, alpha : number)
                                 : void {
      backgroundColour.red = red;
      backgroundColour.green = green;
      backgroundColour.blue = blue;
      backgroundColour.alpha = alpha;
    },
    setColourFadeSet: function(enabled : boolean, redStart : number | null, redRate : number | null,
                               greenStart : number | null, greenRate : number | null,
                               blueStart : number | null, blueRate : number | null) : void {
      if (enabled !== null) {colourFadeSet.enabled = enabled}
      if (redStart !== null) {colourFadeSet.redStart = redStart}
      if (redRate !== null) {colourFadeSet.redRate = redRate}
      if (greenStart !== null) {colourFadeSet.greenStart = greenStart}
      if (greenRate !== null) {colourFadeSet.greenRate = greenRate}
      if (blueStart !== null) {colourFadeSet.blueStart = blueStart}
      if (blueRate !== null) {colourFadeSet.blueRate = blueRate}  
    },
    setBoardArraySize: function(size : number) : void {
      boardArraySize = size;
    },
    setPatternName: function(name : string) : void {
      patternName = name;
    },
    getMode: function() : string {
      return mode;
    },
    getShowGrid: function() : boolean {
      return showGrid;
    },
    getCamera: function() : {cameraX : number, cameraY : number, cameraZ : number} {
      return {
        cameraX: camera.x, cameraY: camera.y, cameraZ: camera.z
      };
    },
    getGridColour: function() : {red : number, green : number, blue : number, alpha : number} {
      return {red: gridColour.red, green: gridColour.green, blue: gridColour.blue,
              alpha: gridColour.alpha};
    },
    getBackgroundColour: function() : {red : number, green : number, blue : number, alpha : number} {
      return {red: backgroundColour.red, green: backgroundColour.green, blue: backgroundColour.blue,
              alpha: backgroundColour.alpha};
    },
    getColourFadeSet: function(mode : number) : {redStart : number, redRate : number,
                               greenStart : number, greenRate : number, blueStart : number,
                               blueRate : number, enabled: boolean} {
      if (colourFadeSet.enabled || mode === 1) {
        return {
          redStart: colourFadeSet.redStart, redRate: colourFadeSet.redRate,
          greenStart: colourFadeSet.greenStart, greenRate: colourFadeSet.greenRate,
          blueStart: colourFadeSet.blueStart, blueRate: colourFadeSet.blueRate,
          enabled: colourFadeSet.enabled
        };
      }
      else {
        return {
          redStart: colourFadeSet.redStart, redRate: 0,
          greenStart: colourFadeSet.greenStart, greenRate: 0,
          blueStart: colourFadeSet.blueStart, blueRate: 0,
          enabled: colourFadeSet.enabled
        };
      }
    },
    getBoardArraySize: function() : number {
      return boardArraySize;
    },
    getBoardDimensions: function() : string {
      const dimension = (boardArraySize - 1) * 2 + 1;
      return (`${dimension} * ${dimension}`);
    },
    getGameTime: function() : string {
      return (`${gameBoardObject.gameTime}`);
    },
    getTotalPopulation: function() : string {
      return (`${gameBoardObject.totalPopulation}`);
    },
    getFrameCheckInterval: function() : string | null {
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
    getPatternName: function() : string {
      return patternName;
    },
    flipCellStateOnTouch: function(event : string, window : {width: number, height: number},
                                   touch : {x : number, y : number}) : void {
      lastCellTouched = flipCellStateOnTouch(event, window, touch, camera, lastCellTouched);
    },
    setIntervalID: function(id : NodeJS.Timer) : void {
      intervalID = id;
    },
    getIntervalID: function()  : NodeJS.Timer{
      return intervalID;
    }
  }
}

// This function processes touch input captured by the game board container component in MainScreen
// and updates the state of the game board accordingly.
function flipCellStateOnTouch(event: string, window: {width : number, height: number},
                              touch: {x : number, y: number},
                              camera: {x: number, y: number, z: number},
                              lastCellTouched: {i: number, j: number}) : {i: number, j: number} {
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

export {control};
