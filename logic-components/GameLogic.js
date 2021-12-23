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

// These two global objects are convenience holders for the cellUpdaterQ1_1... functions defined
// later.
const cellUpdaterFunctions1 = {
  quadrant1: cellUpdaterQ1_1, quadrant2: cellUpdaterQ2_1, quadrant3: cellUpdaterQ3_1,
  quadrant4: cellUpdaterQ4_1
};

const cellUpdaterFunctions2 = {
  quadrant1: cellUpdaterQ1_2, quadrant2: cellUpdaterQ2_2, quadrant3: cellUpdaterQ3_2,
  quadrant4: cellUpdaterQ4_2
};

function initTestBoard(gameBoard, min, max) {
  let k = 0;
  for (let i = min; i <= max; i++) {
    for (let j = min; j <= max; j++) {
      if (testBoardState4[k] === 1) {setCellState(gameBoard, true, 0, cellUpdaterFunctions1,
                                        i, j);}
      k++;
    }
  }
}

// These two functions are constructors for the types used to populate the gameBoard and
// boardUpdateTable arrays, respectively.
function BoardCell(q1 = 0, q2 = 0, q3 = 0, q4 = 0) {
  return {
    quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: false,
    q1LastBornOn: q1, q2LastBornOn: q2, q3LastBornOn: q3, q4LastBornOn: q4
  };
}

function UpdateTableCell() {
  return {
    quadrant1: 0, quadrant2: 0, quadrant3: 0, quadrant4: 0
  };
}

// This function is used to reset the gameBoard, nextGameBoard and boardUpdateTable arrays with
// default values.  It also copies the q1LastBornOn... properties from gameBoard to nextGameBoard.
function resetBoardArray(arr, constructor, max, newGameBoard) {
  let q1LastBornOn, q2LastBornOn, q3LastBornOn, q4LastBornOn;
  for (let i = 0; i <= max; i++) {
    for (let j = 0; j <= max; j++) {
      if (newGameBoard !== null) {
        q1LastBornOn = newGameBoard[i][j].q1LastBornOn;
        q2LastBornOn = newGameBoard[i][j].q2LastBornOn;
        q3LastBornOn = newGameBoard[i][j].q3LastBornOn;
        q4LastBornOn = newGameBoard[i][j].q4LastBornOn;
      }
      arr[i][j] = constructor(q1LastBornOn, q2LastBornOn, q3LastBornOn, q4LastBornOn);
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

// The cell updater functions are passed to setCellState to specialise its functionality at
// call time.
function cellUpdaterQ1_1(table, state, i, j) {
  table[i][j].quadrant1 = state;
}

function cellUpdaterQ2_1(table, state, i, j) {
  table[i][j].quadrant2 = state;
}

function cellUpdaterQ3_1(table, state, i, j) {
  table[i][j].quadrant3 = state;
}

function cellUpdaterQ4_1(table, state, i, j) {
  table[i][j].quadrant4 = state;
}

function cellUpdaterQ1_2(table, state, i, j, gameTime) {
  table[i][j].quadrant1 = state;
  table[i][j].q1LastBornOn = gameTime;
}

function cellUpdaterQ2_2(table, state, i, j, gameTime) {
  table[i][j].quadrant2 = state;
  table[i][j].q2LastBornOn = gameTime;
}

function cellUpdaterQ3_2(table, state, i, j, gameTime) {
  table[i][j].quadrant3 = state;
  table[i][j].q3LastBornOn = gameTime;
}

function cellUpdaterQ4_2(table, state, i, j, gameTime) {
  table[i][j].quadrant4 = state;
  table[i][j].q4LastBornOn = gameTime;
}

// This is an accessor function (set) for the nextGameBoard and boardUpdateTable arrays.
function setCellState(table, state, gameTime, updaterFunctions, i, j) {
  let absoluteI = Math.abs(i);
  let absoluteJ = Math.abs(j);
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
function setUpdateTable(boardUpdateTable, gameTime, i, j) {
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
              setCellState(nextGameBoard, true, null, cellUpdaterFunctions1, i, j);
              setUpdateTable(boardUpdateTable, gameTime + 1, i, j);
            }
          })
        }
        else {
          birthRules.forEach((x, index) => {
            if (x && index === localPopulation) {
              setCellState(nextGameBoard, true, gameTime, cellUpdaterFunctions2, i, j);
              setUpdateTable(boardUpdateTable, gameTime + 1, i, j);
            }
          })
        }
      }
    }
  }
}

// This function is called from GameBoardRenderer to cause a reset of the game board state.
function handleResetEvent(boardArraySize) {
  const max = boardArraySize - 1;
  const min = -max;
  gameBoardObject.gameBoard =
    Array(boardArraySize).fill(0).map(() => new Array(boardArraySize).fill(0));
  gameBoardObject.nextGameBoard =
    Array(boardArraySize).fill(0).map(() => new Array(boardArraySize).fill(0));
  gameBoardObject.boardUpdateTable =
    Array(boardArraySize).fill(0).map(() => new Array(boardArraySize).fill(0));
  resetBoardArray(gameBoardObject.gameBoard, BoardCell, max, null);
  resetBoardArray(gameBoardObject.nextGameBoard, BoardCell, max, null);
  resetBoardArray(gameBoardObject.boardUpdateTable, UpdateTableCell, max, null);
  gameBoardObject.gameTime = 0;
  initTestBoard(gameBoardObject.gameBoard, min, max);
}

// This function is called from GameBoardRenderer to cause an update of the game board state.
function handleUpdateEvent(boardArraySize) {
  const max = boardArraySize - 1;
  const min = -max;
  updateGameBoard(gameBoardObject.gameBoard, gameBoardObject.nextGameBoard,
                  gameBoardObject.boardUpdateTable,
                  [false, false, true, true, false, false, false, false, false],
                  [false, false, false, true, false, false, false, false, false],
                  gameBoardObject.gameTime, min, max);
  gameBoardObject.gameBoard = gameBoardObject.nextGameBoard;
  gameBoardObject.nextGameBoard =
    Array(boardArraySize).fill(0).map(() => new Array(boardArraySize).fill(0));
  resetBoardArray(gameBoardObject.nextGameBoard, BoardCell, max, gameBoardObject.gameBoard);
  gameBoardObject.gameTime++;
}

// export {createGameBoard, createUpdateTable, getCellState, setCellState, updateGameBoard,
//         testGameBoard};

export {gameBoardObject, handleUpdateEvent, handleResetEvent};
