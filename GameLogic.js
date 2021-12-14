// This module contains the game board state and functions that implement the game logic that
// update it at each game time tick.

import {testBoardState3} from './TestBoardStates.js';

// The gameBoard and nextGameBoard arrays hold the state of the game board itself.
// The boardUpdateTable array holds meta data that allows an optimisation to be applied, such that
// certain dead cells that have no chance of becoming live at the next game time tick don't
// have the game logic applied to them.
var gameBoard;
var nextGameBoard;
var boardUpdateTable;
var gameTime;

function initTestBoard(min, max) {
  for (let i = min; i <= max; i++) {
    for (let j = min; j <= max; j++) {
      if (testBoardState3.pop() === 1) {setCellState(i, j, true, gameBoard);}
    }
  }
}

// This function is used to initialise the gameBoard and nextGameBoard arrays.
function createGameBoard(board, max) {
  for (let i = 0; i <= max; i++) {
    for (let j = 0; j <= max; j++) {
      board[i][j] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: false};
    }
  }
}

// This function is used to initialise the boardUpdateTable array.
function createUpdateTable(table, max) {
  for (let i = 0; i <= max; i++) {
    for (let j = 0; j <= max; j++) {
      table[i][j] = {quadrant1: 0, quadrant2: 0, quadrant3: 0, quadrant4: 0};
    }
  }
}

// This is an accessor function (get) for the gameBoard and boardUpdateTable arrays.
function getCellState(i, j, board) {
  let absoluteI = Math.abs(i);
  let absoluteJ = Math.abs(j);
  if (absoluteI >= board.length || absoluteJ >= board.length) {
    return {exists: false, cellState: false};
  }
    
  if (i >= 0 && j >= 0) {
    return {exists: true, cellState: board[absoluteI][absoluteJ].quadrant1};
  }
  else if (i < 0 && j >= 0) {
    return {exists: true, cellState: board[absoluteI][absoluteJ].quadrant2};
  }
  else if (i < 0 && j < 0) {
    return {exists: true, cellState: board[absoluteI][absoluteJ].quadrant3};
  }
  else {return {exists: true, cellState: board[absoluteI][absoluteJ].quadrant4};}
}

// This is an accessor function (set) for the nextGameBoard and boardUpdateTable arrays.
function setCellState(i, j, state, board) {
  let absoluteI = Math.abs(i);
  let absoluteJ = Math.abs(j);
  if (absoluteI >= board.length || absoluteJ >= board.length) {
    return false;
  }

  if (i >= 0 && j >= 0) {
    board[absoluteI][absoluteJ].quadrant1 = state;
  }
  else if (i < 0 && j >= 0) {
    board[absoluteI][absoluteJ].quadrant2 = state;
  }
  else if (i < 0 && j < 0) {
    board[absoluteI][absoluteJ].quadrant3 = state;
  }
  else {board[absoluteI][absoluteJ].quadrant4 = state;}
  return true;
}

// This function is used by updateGameBoard to set the current cell and each of its neighbours to
// true in boardUpdateTable.
function setUpdateTable(i, j, gameT, updateTable) {
  setCellState(i, j, gameT, updateTable);
  setCellState(i + 1, j, gameT, updateTable);
  setCellState(i, j + 1, gameT, updateTable);
  setCellState(i - 1, j, gameT, updateTable);
  setCellState(i, j - 1, gameT, updateTable);
  setCellState(i + 1, j + 1, gameT, updateTable);
  setCellState(i - 1, j - 1, gameT, updateTable);
  setCellState(i + 1, j - 1, gameT, updateTable);
  setCellState(i - 1, j + 1, gameT, updateTable);
}

// This function applies the game logic to each cell on the board where the corresponding cell
// in boardUpdateTable >= gameT.
function updateGameBoard(updateTable, board, newBoard, survivalRules, birthRules, gameT, min, max) {
  for (let i = min; i <= max; i++) {
    for (let j = min; j <= max; j++) {
      if (getCellState(i, j, updateTable).cellState >= gameT) {
        let localSurvey = [];
        localSurvey.push(getCellState(i + 1, j, board), getCellState(i - 1, j, board),
                    getCellState(i, j + 1, board), getCellState(i, j - 1, board),
                    getCellState(i + 1, j + 1, board), getCellState(i - 1, j + 1, board),
                    getCellState(i - 1, j - 1, board), getCellState(i + 1, j - 1, board));
        let localPopulation = localSurvey.reduce((total, obj) => {
          if (obj.cellState) {return total + 1}
          else {return total}}, 0);
        if (getCellState(i, j, board).cellState) {
          survivalRules.forEach((x, index) => {
            if (x && index === localPopulation) {
              setCellState(i, j, true, newBoard);
              setUpdateTable(i, j, gameT + 1, updateTable);
            }
          })
        }
        else {
          birthRules.forEach((x, index) => {
            if (x && index === localPopulation) {
              setCellState(i, j, true, newBoard);
              setUpdateTable(i, j, gameT + 1, updateTable);
            }
          })
        }
      }
    }
  }
}

function handleSetEvent(i, j) {
  setCellState(i, j, true, gameBoard);
}

// This function is called from GameBoardRenderer to cause a reset of the game board state.
function handleResetEvent(boardAxisSize) {
  const max = boardAxisSize - 1;
  const min = -max;
  gameBoard = Array(boardAxisSize).fill(0).map(() => new Array(boardAxisSize).fill(0));
  nextGameBoard = Array(boardAxisSize).fill(0).map(() => new Array(boardAxisSize).fill(0));
  boardUpdateTable = Array(boardAxisSize).fill(0).map(() => new Array(boardAxisSize).fill(0));
  gameTime = 0;
  createGameBoard(gameBoard, max);
  createGameBoard(nextGameBoard, max);
  createUpdateTable(boardUpdateTable, max);
  initTestBoard(min, max);
}

// This function is called from GameBoardRenderer to cause an update of the game board state.
function handleUpdateEvent(boardAxisSize) {
  const max = boardAxisSize - 1;
  const min = -max;
  updateGameBoard(boardUpdateTable, gameBoard, nextGameBoard,
                 [false, false, true, true, false, false, false, false, false],
                 [false, false, false, true, false, false, false, false, false], gameTime, 
                 min, max);
  gameBoard = nextGameBoard;
  nextGameBoard = Array(boardAxisSize).fill(0).map(() => new Array(boardAxisSize).fill(0));
  createGameBoard(nextGameBoard, max);
  gameTime++;
}

// export {createGameBoard, createUpdateTable, getCellState, setCellState, updateGameBoard,
//         testGameBoard};

export {gameBoard, handleUpdateEvent, handleResetEvent};
