// This module contains the game board state and functions that implement the game logic that
// update it at each game time tick.

import testBoardState5 from './TestBoardStates';
import { store, setLastCellTouched } from './StateController';

// The gameBoard and nextGameBoard arrays hold the state of the game board itself.
// The boardUpdateTable array holds meta data that allows an optimisation to be applied, such that
// certain dead cells that have no chance of becoming live at the next game time tick don't
// have the game logic applied to them.
const gameBoardObject = {
  gameBoard: [],
  nextGameBoard: [],
  boardUpdateTable: [],
  gameTime: 0,
  totalPopulation: 0
};

// The cell updater functions are passed to setCellState to specialise its functionality at
// call time.
function cellUpdaterQ1_1(table : typeof BoardCell[], state: boolean | number,
                         i : number, j : number) : void {
  table[i][j].quadrant1 = state;
}

function cellUpdaterQ2_1(table : typeof BoardCell[], state: boolean | number,
                         i : number, j : number) : void {
  table[i][j].quadrant2 = state;
}

function cellUpdaterQ3_1(table : typeof BoardCell[], state: boolean | number,
                         i : number, j : number) : void {
  table[i][j].quadrant3 = state;
}

function cellUpdaterQ4_1(table : typeof BoardCell[], state: boolean | number,
                         i : number, j : number) : void {
  table[i][j].quadrant4 = state;
}

function cellUpdaterQ1_2(table : typeof BoardCell[], state : boolean, i : number, j : number,
                         gameTime : number) : void {
  table[i][j].quadrant1 = state;
  table[i][j].q1LastBornOn = gameTime;
}

function cellUpdaterQ2_2(table : typeof BoardCell[], state : boolean, i : number, j : number,
                         gameTime : number) : void {
  table[i][j].quadrant2 = state;
  table[i][j].q2LastBornOn = gameTime;
}

function cellUpdaterQ3_2(table : typeof BoardCell[], state : boolean , i : number, j : number,
                         gameTime : number) : void {
  table[i][j].quadrant3 = state;
  table[i][j].q3LastBornOn = gameTime;
}

function cellUpdaterQ4_2(table : typeof BoardCell[], state : boolean, i : number, j : number,
                         gameTime : number) : void {
  table[i][j].quadrant4 = state;
  table[i][j].q4LastBornOn = gameTime;
}

// These two global objects are convenience holders for the cellUpdaterQ1_1... functions defined
// above.
const cellUpdaterFunctions1 = {
  quadrant1: cellUpdaterQ1_1, quadrant2: cellUpdaterQ2_1, quadrant3: cellUpdaterQ3_1,
  quadrant4: cellUpdaterQ4_1
};

const cellUpdaterFunctions2 = {
  quadrant1: cellUpdaterQ1_2, quadrant2: cellUpdaterQ2_2, quadrant3: cellUpdaterQ3_2,
  quadrant4: cellUpdaterQ4_2
};

// For testing purposes.
function initTestBoard(gameBoard, min, max) {
  let k = 0;
  for (let i = min; i <= max; i++) {
    for (let j = min; j <= max; j++) {
      if (testBoardState5[k] === 1) {setCellState(gameBoard, true, 0, cellUpdaterFunctions1,
                                        i, j);}
      k++;
    }
  }
}

// These two functions are constructors for the types used to populate the gameBoard and
// boardUpdateTable arrays, respectively.
function BoardCell(q1 = 0, q2 = 0, q3 = 0, q4 = 0) : void {
  this. quadrant1 = false;
  this. quadrant2 = false;
  this. quadrant3 = false;
  this. quadrant4 = false;
  this.q1LastBornOn = q1;
  this.q2LastBornOn = q2;
  this.q3LastBornOn = q3;
  this.q4LastBornOn = q4;
}

function UpdateTableCell(q1 = 0, q2 = 0, q3 = 0, q4 = 0)
                        : void {
  this. quadrant1 = q1;
  this. quadrant2 = q2;
  this. quadrant3 = q3;
  this. quadrant4 = q4;
}

// This function is used to reset the gameBoard, nextGameBoard and boardUpdateTable arrays with
// default values.  It also copies the q1LastBornOn... properties from gameBoard to nextGameBoard.
function resetBoardArray(arr : typeof BoardCell[] | typeof UpdateTableCell[],
                         constructor : (q1 : number, q2 : number, q3 : number, q4 : number) => void,
                         max : number, newGameBoard : typeof BoardCell[]) : void {
  for (let i = 0; i <= max; i++) {
    for (let j = 0; j <= max; j++) {
      let q1LastBornOn : number, q2LastBornOn : number, q3LastBornOn : number;
      let q4LastBornOn : number;
      if (newGameBoard !== null) {
        q1LastBornOn = newGameBoard[i][j].q1LastBornOn;
        q2LastBornOn = newGameBoard[i][j].q2LastBornOn;
        q3LastBornOn = newGameBoard[i][j].q3LastBornOn;
        q4LastBornOn = newGameBoard[i][j].q4LastBornOn;
      }
      arr[i][j] = new constructor(q1LastBornOn, q2LastBornOn, q3LastBornOn, q4LastBornOn);
    }
  }
}

// This is an accessor function (get) for the gameBoard and boardUpdateTable arrays.
function getCellState(table : typeof BoardCell[] | typeof UpdateTableCell[], i : number, j : number)
                     : {exists: boolean, cellState: boolean | number} {
  const absoluteI = Math.abs(i);
  const absoluteJ = Math.abs(j);
  if (absoluteI >= table.length || absoluteJ >= table.length) {
    return {exists: false, cellState: false};
  }
    
  if (i >= 0 && j >= 0) {
    return {exists: true, cellState: table[absoluteI][absoluteJ].quadrant1};
  }
  else if (i < 0 && j >= 0) {
    return {exists: true, cellState: table[absoluteI][absoluteJ].quadrant2};
  }
  else if (i < 0 && j < 0) {
    return {exists: true, cellState: table[absoluteI][absoluteJ].quadrant3};
  }
  else {
    return {exists: true, cellState: table[absoluteI][absoluteJ].quadrant4};
  }
}

// This is an accessor function (set) for the nextGameBoard and boardUpdateTable arrays.
function setCellState(table : typeof BoardCell[] | typeof UpdateTableCell[],
                      state: boolean | number, gameTime : number, updaterFunctions,
                      i : number, j : number) : boolean {
  const absoluteI = Math.abs(i);
  const absoluteJ = Math.abs(j);
  if (absoluteI >= table.length || absoluteJ >= table.length) {
    return false;
  }

  if (i >= 0 && j >= 0) {
    updaterFunctions.quadrant1(table, state, absoluteI, absoluteJ, gameTime);
  }
  else if (i < 0 && j >= 0) {
    updaterFunctions.quadrant2(table, state, absoluteI, absoluteJ, gameTime);
  }
  else if (i < 0 && j < 0) {
    updaterFunctions.quadrant3(table, state, absoluteI, absoluteJ, gameTime);
  }
  else {
    updaterFunctions.quadrant4(table, state, absoluteI, absoluteJ, gameTime);
  }
  return true;
}

// This function is used by updateGameBoard to set the current cell and each of its neighbours to
// true in boardUpdateTable.
function setUpdateTable(boardUpdateTable : typeof UpdateTableCell[], gameTime : number,
                        i : number, j : number) : void {
  setCellState(boardUpdateTable, gameTime, null, cellUpdaterFunctions1, i, j);
  setCellState(boardUpdateTable, gameTime, null, cellUpdaterFunctions1, i + 1, j);
  setCellState(boardUpdateTable, gameTime, null, cellUpdaterFunctions1, i, j + 1);
  setCellState(boardUpdateTable, gameTime, null, cellUpdaterFunctions1, i - 1, j);
  setCellState(boardUpdateTable, gameTime, null, cellUpdaterFunctions1, i, j - 1);
  setCellState(boardUpdateTable, gameTime, null, cellUpdaterFunctions1, i + 1, j + 1);
  setCellState(boardUpdateTable, gameTime, null, cellUpdaterFunctions1, i - 1, j - 1);
  setCellState(boardUpdateTable, gameTime, null, cellUpdaterFunctions1, i + 1, j - 1);
  setCellState(boardUpdateTable, gameTime, null, cellUpdaterFunctions1, i - 1, j + 1);
}

// This function applies the game logic to each cell on the board where the corresponding cell
// in boardUpdateTable >= gameTime.
function updateGameBoard(gameBoard : typeof BoardCell[], nextGameBoard : typeof BoardCell[],
                        boardUpdateTable : typeof UpdateTableCell[], survivalRules : boolean[],
                        birthRules : boolean[], gameTime : number, min : number, max : number)
                        : number {
  let totalPopulation = 0;
  for (let i = min; i <= max; i++) {
    for (let j = min; j <= max; j++) {
      if (getCellState(boardUpdateTable, i, j).cellState >= gameTime) {
        const localSurvey = [];
        localSurvey.push(getCellState(gameBoard, i + 1, j), getCellState(gameBoard, i - 1, j),
                    getCellState(gameBoard, i, j + 1), getCellState(gameBoard, i, j - 1),
                    getCellState(gameBoard, i + 1, j + 1), getCellState(gameBoard, i - 1, j + 1),
                    getCellState(gameBoard, i - 1, j - 1), getCellState(gameBoard, i + 1, j - 1));
        const localPopulation = localSurvey.reduce((total, obj) => {
          if (obj.cellState) {return total + 1}
          else {return total}}, 0);
        if (getCellState(gameBoard, i, j).cellState) {
          survivalRules.forEach((x, index) => {
            if (x && index === localPopulation) {
              setCellState(nextGameBoard, true, null, cellUpdaterFunctions1, i, j);
              setUpdateTable(boardUpdateTable, gameTime + 1, i, j);
              totalPopulation++;
            }
          })
        }
        else {
          birthRules.forEach((x, index) => {
            if (x && index === localPopulation) {
              setCellState(nextGameBoard, true, gameTime, cellUpdaterFunctions2, i, j);
              setUpdateTable(boardUpdateTable, gameTime + 1, i, j);
              totalPopulation++;
            }
          })
        }
      }
    }
  }
  return totalPopulation;
}

// This function is called from GameBoardRenderer to cause a reset of the game board state.
function handleResetEvent(boardArraySize : number) : void {
  gameBoardObject.gameBoard =
    Array(boardArraySize).fill(0).map(() => new Array(boardArraySize).fill(0));
  gameBoardObject.nextGameBoard =
    Array(boardArraySize).fill(0).map(() => new Array(boardArraySize).fill(0));
  gameBoardObject.boardUpdateTable =
    Array(boardArraySize).fill(0).map(() => new Array(boardArraySize).fill(0));
  const max = boardArraySize - 1;
  const min = -max;

  resetBoardArray(gameBoardObject.gameBoard, BoardCell, max, null);
  resetBoardArray(gameBoardObject.nextGameBoard, BoardCell, max, null);
  resetBoardArray(gameBoardObject.boardUpdateTable, UpdateTableCell, max, null);
  gameBoardObject.gameTime = 0;
  gameBoardObject.totalPopulation = 0;
  initTestBoard(gameBoardObject.gameBoard, min, max);
}

// This function is called from GameBoardRenderer to cause an update of the game board state.
function handleUpdateEvent(boardArraySize : number) : void {
  const max = boardArraySize - 1;
  const min = -max;
  const survivalRules = store.getState().survivalRules;
  const birthRules = store.getState().birthRules;
  gameBoardObject.totalPopulation =
    updateGameBoard(gameBoardObject.gameBoard, gameBoardObject.nextGameBoard,
                    gameBoardObject.boardUpdateTable, survivalRules, birthRules,
                    gameBoardObject.gameTime, min, max);
  gameBoardObject.gameBoard = gameBoardObject.nextGameBoard;
  gameBoardObject.nextGameBoard =
    Array(boardArraySize).fill(0).map(() => new Array(boardArraySize).fill(0));
  resetBoardArray(gameBoardObject.nextGameBoard, BoardCell, max, gameBoardObject.gameBoard);
  gameBoardObject.gameTime++;
}

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

// These two helper functions are used with the MetaDataBar component in MainScreen.
function getGameTime() : string {
  return (`${gameBoardObject.gameTime}`);
}

function getTotalPopulation() : string {
  return (`${gameBoardObject.totalPopulation}`);
}

export {gameBoardObject, handleUpdateEvent, handleResetEvent, flipCellStateOnTouch, getGameTime,
        getTotalPopulation};
