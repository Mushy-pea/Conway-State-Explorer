// This module contains types and related state update functions used to implement the game logic.
// It is used as a library by the application front end (Conway-State-Explorer) and back end
// (Conway-State-Explorer-Server).

type BoardCell = {quadrant1 : boolean,
                  quadrant2 : boolean,
                  quadrant3 : boolean,
                  quadrant4 : boolean,
                  q1LastBornOn : number,
                  q2LastBornOn : number,
                  q3LastBornOn : number,
                  q4LastBornOn : number};

type UpdateTableCell = {quadrant1 : number,
                        quadrant2 : number,
                        quadrant3 : number,
                        quadrant4 : number};

function boardCell(q1 = 0, q2 = 0, q3 = 0, q4 = 0) : BoardCell {
  return {
    quadrant1: false,
    quadrant2: false,
    quadrant3: false,
    quadrant4: false,
    q1LastBornOn: q1,
    q2LastBornOn: q2,
    q3LastBornOn: q3,
    q4LastBornOn: q4
  };
}

function updateTableCell(q1 = 0, q2 = 0, q3 = 0, q4 = 0) : UpdateTableCell {
  return {
    quadrant1: q1,
    quadrant2: q2,
    quadrant3: q3,
    quadrant4: q4
  };
}

// The cell updater functions are passed to setCellState to specialise its functionality at
// call time.
function cellUpdaterQ1_1(table : BoardCell[] | UpdateTableCell[], state: boolean | number,
                         i : number, j : number) : void {
  table[i][j].quadrant1 = state;
}

function cellUpdaterQ2_1(table : BoardCell[] | UpdateTableCell[], state: boolean | number,
                         i : number, j : number) : void {
  table[i][j].quadrant2 = state;
}

function cellUpdaterQ3_1(table : BoardCell[] | UpdateTableCell[], state: boolean | number,
                         i : number, j : number) : void {
  table[i][j].quadrant3 = state;
}

function cellUpdaterQ4_1(table : BoardCell[] | UpdateTableCell[], state: boolean | number,
                         i : number, j : number) : void {
  table[i][j].quadrant4 = state;
}

function cellUpdaterQ1_2(table : BoardCell[], state : boolean, i : number, j : number,
                         gameTime : number) : void {
  table[i][j].quadrant1 = state;
  table[i][j].q1LastBornOn = gameTime;
}

function cellUpdaterQ2_2(table : BoardCell[], state : boolean, i : number, j : number,
                         gameTime : number) : void {
  table[i][j].quadrant2 = state;
  table[i][j].q2LastBornOn = gameTime;
}

function cellUpdaterQ3_2(table : BoardCell[], state : boolean , i : number, j : number,
                         gameTime : number) : void {
  table[i][j].quadrant3 = state;
  table[i][j].q3LastBornOn = gameTime;
}

function cellUpdaterQ4_2(table : BoardCell[], state : boolean, i : number, j : number,
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

// This is an accessor function (get) for arrays of type BoardCell and UpdateTableCell.
function getCellState(table : BoardCell[] | UpdateTableCell[], i : number, j : number)
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

// This is an accessor function (set) for arrays of type BoardCell and UpdateTableCell.
function setCellState(table : BoardCell[] | UpdateTableCell[],
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

// This function is used to reset arrays of type BoardCell and UpdateTableCell with
// default values.  It can also copy the q[n]LastBornOn properties between two arrays
// of type BoardCell.
function resetBoardArray(arr : BoardCell[] | UpdateTableCell[],
                         constructor : (q1 : number, q2 : number, q3 : number, q4 : number)
                         => BoardCell | UpdateTableCell,
                         max : number, newGameBoard : BoardCell[] | null) : void {
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
      arr[i][j] = constructor(q1LastBornOn, q2LastBornOn, q3LastBornOn, q4LastBornOn);
    }
  }
}

export {BoardCell, boardCell, UpdateTableCell, updateTableCell, cellUpdaterFunctions1,
        cellUpdaterFunctions2, getCellState, setCellState, resetBoardArray}
