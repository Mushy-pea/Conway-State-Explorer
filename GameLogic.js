// The gameBoard and newGameBoard arrays hold the state of the game board itself.
// The boardUpdateTable array holds meta data that allows an optimisation to be applied, such that
// certain dead cells that have no chance of becoming live at the next game time tick don't
// have the game logic applied to them.

import {testBoardState1} from './TestBoardStates.js';

var gameBoard = Array(26).fill(0).map(() => new Array(26).fill(0));
var newGameBoard = Array(26).fill(0).map(() => new Array(26).fill(0));
var boardUpdateTable = Array(26).fill(0).map(() => new Array(26).fill(0));
var gameTime = 0;
createGameBoard(gameBoard);
createGameBoard(newGameBoard);
createUpdateTable(boardUpdateTable);

initTestBoard(-25, -25, -25, 25);

function initTestBoard(i, j, min, max) {
  if (i > max) {return;}

  if (testBoardState1.pop() === 1) {setCellState(i, j, true, gameBoard);}

  if (j === max) {initTestBoard(i + 1, min, min, max);}
  else {initTestBoard(i, j + 1, min, max);}
}

// This function is used to initialise the gameBoard and newGameBoard arrays.
function createGameBoard(board) {
  for (let i = 0; i <= 25; i++) {
    for (let j = 0; j <= 25; j++) {
      board[i][j] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: false};
    }
  }
}

// This function is used to initialise the boardUpdateTable array.
function createUpdateTable(table) {
  for (let i = 0; i <= 25; i++) {
    for (let j = 0; j <= 25; j++) {
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

// This is an accessor function (set) for the newGameBoard and boardUpdateTable arrays.
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
function updateGameBoard(updateTable, board, newBoard, survivalRules, birthRules,
                         gameT, i, j, min, max) {
  if (i > max) {return true;}

  if (getCellState(i, j, updateTable).cellState >= gameT) {
    let localSurvey = [], boundaryTest;
    localSurvey.push(getCellState(i + 1, j, board), getCellState(i - 1, j, board),
                     getCellState(i, j + 1, board), getCellState(i, j - 1, board),
                     getCellState(i + 1, j + 1, board), getCellState(i - 1, j + 1, board),
                     getCellState(i - 1, j - 1, board), getCellState(i + 1, j - 1, board));
    //boundaryTest = localSurvey.find(obj => obj.exists === false);
    //if (boundaryTest === {exists: false, cellState: false}) {return false;}
  
    let localPopulation = localSurvey.reduce((total, obj) => {if (obj.cellState) {return total + 1}
                                                              else {return total;}}, 0);
    if (getCellState(i, j, board).cellState) {
      survivalRules.forEach((x, index) =>
        {if (x && index === localPopulation) {setCellState(i, j, true, newBoard);
                                              setUpdateTable(i, j, gameT + 1, updateTable);}});
    }
    else {
      birthRules.forEach((x, index) =>
        {if (x && index === localPopulation) {setCellState(i, j, true, newBoard);
                                              setUpdateTable(i, j, gameT + 1, updateTable);}});
    }
  }

  if (j === max) {updateGameBoard(updateTable, board, newBoard, survivalRules, birthRules,
                                   gameT, i + 1, min, min, max);}
  else {updateGameBoard(updateTable, board, newBoard, survivalRules, birthRules,
                        gameT, i, j + 1, min, max);}  
}

function handleSetEvent(i, j) {
  setCellState(i, j, true, gameBoard);
}

function handleUpdateEvent() {
  updateGameBoard(boardUpdateTable, gameBoard, newGameBoard,
                 [false, false, true, true, false, false, false, false, false],
                 [false, false, false, true, false, false, false, false, false], gameTime, -25, -25,
                 -25, 25);
  gameBoard = newGameBoard;
  newGameBoard = Array(26).fill(0).map(() => new Array(26).fill(0));
  createGameBoard(newGameBoard);
  gameTime++;
}

// export {createGameBoard, createUpdateTable, getCellState, setCellState, updateGameBoard,
//         testGameBoard};

export {gameBoard, handleUpdateEvent};
