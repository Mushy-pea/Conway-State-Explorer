// This module contains the game board state and functions that implement the game logic that
// update it at each game time tick.

import {testBoardState4} from './TestBoardStates.js';

// The gameBoard and nextGameBoard arrays hold the state of the game board itself.
// The boardUpdateTable array holds meta data that allows an optimisation to be applied, such that
// certain dead cells that have no chance of becoming live at the next game time tick don't
// have the game logic applied to them.
const gameBoardObject = {
  gameBoard: [],
  nextGameBoard: [],
  boardUpdateTable: [],
  gameTime: 0,
};

function initTestBoard(gameBoard, min, max) {
  for (let i = min; i <= max; i++) {
    for (let j = min; j <= max; j++) {
      if (testBoardState4.pop() === 1) {setCellState(gameBoard, true, 0, i, j);}
    }
  }
}

// These two functions are constructors for the object types used to populate the gameBoard and
// boardUpdateTable arrays, respectively.
function BoardCell() {
  return {
    quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: false,
    q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0
  };
}

function UpdateTableCell() {
  return {
    quadrant1: 0, quadrant2: 0, quadrant3: 0, quadrant4: 0
  };
}

// This function is used to reset the gameBoard, nextGameBoard and boardUpdateTable arrays with
// default values.
function resetBoardArray(arr, constructor, max) {
  for (let i = 0; i <= max; i++) {
    for (let j = 0; j <= max; j++) {
      arr[i][j] = constructor();
    }
  }
}

// This is an accessor function (get) for the gameBoard and boardUpdateTable arrays.
function getCellState(table, i, j) {
  let absoluteI = Math.abs(i);
  let absoluteJ = Math.abs(j);
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
function setCellState(table, state, gameTime, i, j) {
  let absoluteI = Math.abs(i);
  let absoluteJ = Math.abs(j);
  if (absoluteI >= table.length || absoluteJ >= table.length) {
    return false;
  }

  if (i >= 0 && j >= 0) {
    table[absoluteI][absoluteJ].quadrant1 = state;
    table[absoluteI][absoluteJ].q1LastBornOn = gameTime;
  }
  else if (i < 0 && j >= 0) {
    table[absoluteI][absoluteJ].quadrant2 = state;
    table[absoluteI][absoluteJ].q2LastBornOn = gameTime;
  }
  else if (i < 0 && j < 0) {
    table[absoluteI][absoluteJ].quadrant3 = state;
    table[absoluteI][absoluteJ].q3LastBornOn = gameTime;
  }
  else {
    table[absoluteI][absoluteJ].quadrant4 = state;
    table[absoluteI][absoluteJ].q4LastBornOn = gameTime;
  }
  return true;
}

// This function is used by updateGameBoard to set the current cell and each of its neighbours to
// true in boardUpdateTable.
function setUpdateTable(boardUpdateTable, gameTime, i, j) {
  setCellState(boardUpdateTable, gameTime, gameTime, i, j);
  setCellState(boardUpdateTable, gameTime, gameTime, i + 1, j);
  setCellState(boardUpdateTable, gameTime, gameTime, i, j + 1);
  setCellState(boardUpdateTable, gameTime, gameTime, i - 1, j);
  setCellState(boardUpdateTable, gameTime, gameTime, i, j - 1);
  setCellState(boardUpdateTable, gameTime, gameTime, i + 1, j + 1);
  setCellState(boardUpdateTable, gameTime, gameTime, i - 1, j - 1);
  setCellState(boardUpdateTable, gameTime, gameTime, i + 1, j - 1);
  setCellState(boardUpdateTable, gameTime, gameTime, i - 1, j + 1);
}

// This function applies the game logic to each cell on the board where the corresponding cell
// in boardUpdateTable >= gameTime.
function updateGameBoard(gameBoard, nextGameBoard, boardUpdateTable, survivalRules, birthRules,
                         gameTime, min, max) {
  for (let i = min; i <= max; i++) {
    for (let j = min; j <= max; j++) {
      if (getCellState(boardUpdateTable, i, j).cellState >= gameTime) {
        let localSurvey = [];
        localSurvey.push(getCellState(gameBoard, i + 1, j), getCellState(gameBoard, i - 1, j),
                    getCellState(gameBoard, i, j + 1), getCellState(gameBoard, i, j - 1),
                    getCellState(gameBoard, i + 1, j + 1), getCellState(gameBoard, i - 1, j + 1),
                    getCellState(gameBoard, i - 1, j - 1), getCellState(gameBoard, i + 1, j - 1));
        let localPopulation = localSurvey.reduce((total, obj) => {
          if (obj.cellState) {return total + 1}
          else {return total}}, 0);
        if (getCellState(gameBoard, i, j).cellState) {
          survivalRules.forEach((x, index) => {
            if (x && index === localPopulation) {
              setCellState(nextGameBoard, true, 0, i, j);
              setUpdateTable(boardUpdateTable, gameTime + 1, i, j);
            }
          })
        }
        else {
          birthRules.forEach((x, index) => {
            if (x && index === localPopulation) {
              setCellState(nextGameBoard, true, gameTime, i, j);
              setUpdateTable(boardUpdateTable, gameTime + 1, i, j);
            }
          })
        }
      }
    }
  }
}

// This function is called from GameBoardRenderer to cause a reset of the game board state.
function handleResetEvent(boardAxisSize) {
  const max = boardAxisSize - 1;
  const min = -max;
  gameBoardObject.gameBoard =
    Array(boardAxisSize).fill(0).map(() => new Array(boardAxisSize).fill(0));
  gameBoardObject.nextGameBoard =
    Array(boardAxisSize).fill(0).map(() => new Array(boardAxisSize).fill(0));
  gameBoardObject.boardUpdateTable =
    Array(boardAxisSize).fill(0).map(() => new Array(boardAxisSize).fill(0));
  resetBoardArray(gameBoardObject.gameBoard, BoardCell, max);
  resetBoardArray(gameBoardObject.nextGameBoard, BoardCell, max);
  resetBoardArray(gameBoardObject.boardUpdateTable, UpdateTableCell, max);
  gameBoardObject.gameTime = 0;
  initTestBoard(gameBoardObject.gameBoard, min, max);  
}

// This function is called from GameBoardRenderer to cause an update of the game board state.
function handleUpdateEvent(boardAxisSize) {
  const max = boardAxisSize - 1;
  const min = -max;
  updateGameBoard(gameBoardObject.gameBoard, gameBoardObject.nextGameBoard,
                  gameBoardObject.boardUpdateTable,
                  [false, false, true, true, false, false, false, false, false],
                  [false, false, false, true, false, false, false, false, false],
                  gameBoardObject.gameTime, min, max);
  gameBoardObject.gameBoard = gameBoardObject.nextGameBoard;
  gameBoardObject.nextGameBoard =
    Array(boardAxisSize).fill(0).map(() => new Array(boardAxisSize).fill(0));
  resetBoardArray(gameBoardObject.nextGameBoard, BoardCell, max);
  gameBoardObject.gameTime++;
}

// export {createGameBoard, createUpdateTable, getCellState, setCellState, updateGameBoard,
//         testGameBoard};

export {gameBoardObject, handleUpdateEvent, handleResetEvent};
