// The gameBoard and newGameBoard arrays hold the state of the game board itself.
// The boardUpdateTable array holds meta data that allows an optimisation to be applied, such that
// certain dead cells that have no chance of becoming live at the next game time tick don't
// have the game logic applied to them.
var gameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
var newGameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
createGameBoard(gameBoard);
createGameBoard(newGameBoard);
var boardUpdateTable = Array(5).fill(0).map(() => new Array(5).fill(0));
createUpdateTable(boardUpdateTable);
var gameTime = 0;

// This function is used to initialise the gameBoard and newGameBoard arrays.
function createGameBoard(board) {
  for (let i = 0; i <= 4; i++) {
    for (let j = 0; j <= 4; j++) {
      board[i][j] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: false};
    }
  }
}

// This function is used to initialise the boardUpdateTable array.
function createUpdateTable(table) {
  for (let i = 0; i <= 4; i++) {
    for (let j = 0; j <= 4; j++) {
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
                         gameT, i, j, maxI, maxJ) {
  if (i > maxI) {return true;}

  if (getCellState(i, j, updateTable).cellState >= gameT) {
    let localSurvey = [], boundaryTest;
    localSurvey.push(getCellState(i + 1, j, board), getCellState(i - 1, j, board),
                     getCellState(i, j + 1, board), getCellState(i, j - 1, board),
                     getCellState(i + 1, j + 1, board), getCellState(i - 1, j + 1, board),
                     getCellState(i - 1, j - 1, board), getCellState(i + 1, j - 1, board));
    boundaryTest = localSurvey.find(obj => obj.exists === false);
    if (boundaryTest === {exists: false, cellState: false}) {return false;}
  
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

  if (j === maxJ) {updateGameBoard(updateTable, board, newBoard, survivalRules, birthRules,
                                   gameT, i + 1, -4, maxI, maxJ);}
  else {updateGameBoard(updateTable, board, newBoard, survivalRules, birthRules,
                        gameT, i, j + 1, maxI, maxJ);}  
}  

function handleSetEvent(i, j) {
  setCellState(i, j, true, gameBoard);
}

function handleShowEvent() {
  showGameBoard(gameBoard);
}

function handleUpdateEvent() {
  updateGameBoard(boardUpdateTable, gameBoard, newGameBoard,
                 [false, false, true, true, false, false, false, false, false],
                 [false, false, false, true, false, false, false, false, false], gameTime, -4, -4,
                 3, 3);
  gameBoard = newGameBoard;
  newGameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(newGameBoard);
  showGameBoard(gameBoard);
  gameTime++;
}

function showGameBoard(board) {
  let output = "";
  for (let i = 4; i >= -4; i--) {
    for (let j = -4; j <= 4; j++) {
      if (getCellState(i, j, board).cellState === true) {output += "1 ";}
      else {output += "0 ";}

      if (j === 4) {output += "\n";}
    }
  }

  console.log(output);
}

const testGameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
createGameBoard(testGameBoard);
testGameBoard[2][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
testGameBoard[3][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
testGameBoard[2][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false};
testGameBoard[1][1] = {quadrant1: true, quadrant2: false, quadrant3: true, quadrant4: false};
testGameBoard[0][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false};
testGameBoard[0][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
testGameBoard[1][3] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};

export {createGameBoard, createUpdateTable, getCellState, setCellState, updateGameBoard,
        testGameBoard};
