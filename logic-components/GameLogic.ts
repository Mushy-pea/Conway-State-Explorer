// This module contains the game board state and functions that update it at each game time tick.

import { BoardCell, boardCell, UpdateTableCell, updateTableCell, cellUpdaterFunctions1,
         cellUpdaterFunctions2, getCellState, setCellState, resetBoardArray }
from './GameLogicTypes';
import { store, setLastCellTouched } from './StateController';
import testBoardState5 from './TestBoardStates';

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

// This function loads a game board pattern given pattern data fetched from the server.
function loadPattern(gameBoard : BoardCell[], pattern : {i: number, j: number}[]) {
  pattern.forEach(liveCell => {
    setCellState(gameBoard, true, 0, cellUpdaterFunctions1, liveCell.i, liveCell.j)
  });
}

// This function is used by updateGameBoard to set the current cell and each of its neighbours to
// true in boardUpdateTable.
function setUpdateTable(boardUpdateTable : UpdateTableCell[], gameTime : number,
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
function updateGameBoard(gameBoard : BoardCell[], nextGameBoard : BoardCell[],
                        boardUpdateTable : UpdateTableCell[], survivalRules : boolean[],
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
    Array(boardArraySize).fill(boardCell).map(() => new Array(boardArraySize).fill(boardCell));
  gameBoardObject.nextGameBoard =
    Array(boardArraySize).fill(boardCell).map(() => new Array(boardArraySize).fill(boardCell));
  gameBoardObject.boardUpdateTable =
    Array(boardArraySize).fill(updateTableCell).map(() => new Array(boardArraySize)
    .fill(updateTableCell));
  const max = boardArraySize - 1;
  const min = -max;

  resetBoardArray(gameBoardObject.gameBoard, boardCell, max, null);
  resetBoardArray(gameBoardObject.nextGameBoard, boardCell, max, null);
  resetBoardArray(gameBoardObject.boardUpdateTable, updateTableCell, max, null);
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
  resetBoardArray(gameBoardObject.nextGameBoard, boardCell, max, gameBoardObject.gameBoard);
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
