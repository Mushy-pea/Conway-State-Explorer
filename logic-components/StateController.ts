import { createStore } from 'redux';
import { gameBoardObject, getCellState, setCellState, setUpdateTable, cellUpdaterFunctions2 }
from './GameLogic';

// This function processes touch input captured by the game board container component in MainScreen
// and updates the state of the game board accordingly.
function flipCellStateOnTouch(event: string, window: {width : number, height: number},
                              touch: {x : number, y: number}) : void {
  if (store.getState().mode === "simulation") {return null}
  const lastCellTouched = store.getState().lastCellTouched;
  const camera = store.getState().camera;
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
    store.dispatch(setLastCellTouched(null, null));
  }
  else if (event === "touchMoved" && lastCellTouched !== null) {
    if (! (i === lastCellTouched.i && j === lastCellTouched.j)) {
      flipCell(lastCellTouched.i, lastCellTouched.j);
      store.dispatch(setLastCellTouched(i, j));
    }
  }
  else {
    store.dispatch(setLastCellTouched(i, j));
  }
}

// The top level application state that can be modified through the UI is held in the
// controlReducer Redux store.  This includes everything except the game board state.
const INITIAL_STATE = {
  mode: "creative",
  intervalID: null,
  showGrid: true,
  camera: {
    x: -0.611501, y: 1.478003, z: -45
  },
  gridColour: {red: 0, green: 0, blue: 1, alpha: 1},
  backgroundColour: {red: 1, green: 1, blue: 1, alpha: 1},
  colourFadeSet: {
    redStart: 0, redRate: 0.067, greenStart: 0, greenRate: 0, blueStart: 1, blueRate: 0,
    enabled: false
  },
  boardArraySize: 41,
  scale: 2.25,
  lastCellTouched: null,
  patternName: "[userName defined]",
  survivalRules: [false, false, true, true, false, false, false, false, false],
  birthRules: [false, false, false, true, false, false, false, false, false]
};

const controlReducer = (state = INITIAL_STATE, action) => {
  let newState = {...state};
  let newCamera;
  let newCameraZ;
  switch (action.type) {
    case "CHANGE_MODE":
      const resetSwitch : boolean = action.payload;
      let newMode;
      if (resetSwitch) {
        if (state.mode !== "reset") {
          newMode = "reset";
        }
        else {
          newMode = "creative";
        }
      }
      else if (state.mode === "creative") {newMode = "simulation"}
      else {newMode = "creative"}

      newState.mode = newMode;
      return newState;
    case "SET_INTERVAL_ID":
      const intervalID : NodeJS.Timer = action.payload;
      newState.intervalID = intervalID;
      return newState;
    case "SET_SHOW_GRID":
      const showGrid : boolean = action.payload;
      newState.showGrid = showGrid;
      return newState;
    case "MOVE_CAMERA_LEFT":
      newCamera = {
        x: state.camera.x += state.scale, y: state.camera.y, z: state.camera.z
      };
      newState.camera = newCamera;
      return newState;
    case "MOVE_CAMERA_RIGHT":
      newCamera = {
        x: state.camera.x -= state.scale, y: state.camera.y, z: state.camera.z
      };
      newState.camera = newCamera;
      return newState;
    case "MOVE_CAMERA_UP":
      newCamera = {
        x: state.camera.x, y: state.camera.y -= state.scale, z: state.camera.z
      };
      newState.camera = newCamera;
      return newState;
    case "MOVE_CAMERA_DOWN":
      newCamera = {
        x: state.camera.x, y: state.camera.y += state.scale, z: state.camera.z
      };
      newState.camera = newCamera;
      return newState;
    case "MOVE_CAMERA_BACK":
      if (state.camera.z <= -44) {newCameraZ = -45}
      else {newCameraZ = state.camera.z -= 1}
      newCamera = {
        x: state.camera.x, y: state.camera.y, z: newCameraZ
      };
      newState.camera = newCamera;
      newState.scale = Math.abs(newCameraZ) / 20;
      return newState;
    case "MOVE_CAMERA_FORWARD":
      if (state.camera.z >= -6) {newCameraZ = -5}
      else {newCameraZ = state.camera.z += 1}
      newCamera = {
        x: state.camera.x, y: state.camera.y, z: newCameraZ
      };
      newState.camera = newCamera;
      newState.scale = Math.abs(newCameraZ) / 20;
      return newState;
    case "SET_GRID_COLOUR":
      newState.gridColour = {red: action.payload.red,
                             green: action.payload.green,
                             blue: action.payload.blue,
                             alpha: action.payload.alpha};
      return newState;
    case "SET_BACKGROUND_COLOUR":
      newState.backgroundColour = {red: action.payload.red,
                                   green: action.payload.green,
                                   blue: action.payload.blue,
                                   alpha: action.payload.alpha};
      return newState;
    case "SET_COLOUR_FADE_SET":
      if (action.payload.enabled !== null) {
        newState.colourFadeSet.enabled = action.payload.enabled;
      }
      if (action.payload.redStart !== null) {
        newState.colourFadeSet.redStart = action.payload.redStart;
      }
      if (action.payload.redRate !== null) {
        newState.colourFadeSet.redRate = action.payload.redRate;
      }
      if (action.payload.greenStart !== null) {
        newState.colourFadeSet.greenStart = action.payload.greenStart;
      }
      if (action.payload.greenRate !== null) {
        newState.colourFadeSet.greenRate = action.payload.greenRate;
      }
      if (action.payload.blueStart !== null) {
        newState.colourFadeSet.blueStart = action.payload.blueStart;
      }
      if (action.payload.blueRate !== null) {
        newState.colourFadeSet.blueRate = action.payload.blueRate;
      }
      return newState;
    case "SET_LAST_CELL_TOUCHED":
      if (action.payload.i === null) {
        newState.lastCellTouched = null;
      }
      else {
        newState.lastCellTouched = {i: action.payload.i, j: action.payload.j};
      }
      return newState;
    case "SET_BOARD_ARRAY_SIZE":
      newState.boardArraySize = action.payload;
      return newState;
    case "SET_PATTERN_NAME":
      newState.patternName = action.payload;
      return newState;
    case "SET_SURVIVAL_RULES":
      newState.survivalRules = action.payload;
      return newState;
    case "SET_BIRTH_RULES":
      newState.birthRules = action.payload;
      return newState;
    default:
      return state
  }
};

// The types of actions handled by controlReducer are defined here.
const changeMode = (resetSwitch : boolean) => (
  {
    type: "CHANGE_MODE",
    payload: resetSwitch
  }
);

const setIntervalID = (intervalID : NodeJS.Timer) => (
  {
    type: "SET_INTERVAL_ID",
    payload: intervalID
  }
);

const setShowGrid = (showGrid : boolean) => (
  {
    type: "SET_SHOW_GRID",
    payload: showGrid
  }
);

const moveCameraLeft = () => (
  {
    type: "MOVE_CAMERA_LEFT"
  }
);

const moveCameraRight = () => (
  {
    type: "MOVE_CAMERA_RIGHT"
  }
);
const moveCameraUp = () => (
  {
    type: "MOVE_CAMERA_UP"
  }
);
const moveCameraDown = () => (
  {
    type: "MOVE_CAMERA_DOWN"
  }
);

const moveCameraBack = () => (
  {
    type: "MOVE_CAMERA_BACK"
  }
);

const moveCameraForward = () => (
  {
    type: "MOVE_CAMERA_FORWARD"
  }
);

const setGridColour = (red : number, green : number, blue : number, alpha : number) => (
  {
    type: "SET_GRID_COLOUR",
    payload: {red: red, green: green, blue: blue, alpha: alpha}
  }
);

const setBackgroundColour = (red : number, green : number, blue : number, alpha : number) => (
  {
    type: "SET_BACKGROUND_COLOUR",
    payload: {red: red, green: green, blue: blue, alpha: alpha}
  }
);

const setColourFadeSet = (enabled : boolean, redStart : number | null, redRate : number | null,
                          greenStart : number | null, greenRate : number | null,
                          blueStart : number | null, blueRate : number | null) => (
  {
    type: "SET_COLOUR_FADE_SET",
    payload: {enabled: enabled, redStart: redStart, redRate: redRate, greenStart: greenStart,
              greenRate: greenRate, blueStart: blueStart, blueRate: blueRate}
  }
);

const setBoardArraySize = (size : number) => (
  {
    type: "SET_BOARD_ARRAY_SIZE",
    payload: size
  }
);

const setLastCellTouched = (i : number, j : number) => (
  {
    type: "SET_LAST_CELL_TOUCHED",
    payload: {i: i, j: j}
  }
);

const setPatternName = patternName => (
  {
    type: "SET_PATTERN_NAME",
    payload: patternName
  }
);

const setSurvivalRules = survivalRules => (
  {
    type: "SET_SURVIVAL_RULES",
    payload: survivalRules
  }
);

const setBirthRules = birthRules => (
  {
    type: "SET_BIRTH_RULES",
    payload: birthRules
  }
);

// These three helper functions are used with the MetaDataBar component in MainScreen.
function getBoardDimensions() : string {
  const boardArraySize = store.getState().boardArraySize;
  const dimension = (boardArraySize - 1) * 2 + 1;
  return (`${dimension} * ${dimension}`);
}

function getGameTime() : string {
  return (`${gameBoardObject.gameTime}`);
}

function getTotalPopulation() : string {
  return (`${gameBoardObject.totalPopulation}`);
}

const store = createStore(controlReducer);

export {store, changeMode, setIntervalID, setShowGrid, moveCameraLeft, moveCameraRight,
        moveCameraUp, moveCameraDown, moveCameraBack, moveCameraForward, setGridColour,
        setBackgroundColour, setColourFadeSet, setBoardArraySize, setPatternName,
        flipCellStateOnTouch, getBoardDimensions, getGameTime, getTotalPopulation};
