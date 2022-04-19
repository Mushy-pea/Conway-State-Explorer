import { boardCell, updateTableCell, resetBoardArray, getCellState, setCellState,
cellUpdaterFunctions1 } from './GameLogicTypes.js';
import { updateGameBoard } from './GameLogic.js';

test("Does getCellState correctly return true and false cellState values from quadrant 1 \
of a gameBoard?", () => {
  const gameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  resetBoardArray(gameBoard, boardCell, 4, null);
  gameBoard[2][2] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false};
  expect(getCellState(gameBoard, 2, 2).cellState).toBe(true);
  expect(getCellState(gameBoard, 1, 4).cellState).toBe(false);
});

test("Does getCellState correctly return true and false cellState values from quadrant 2 \
of a gameBoard?", () => {
  const gameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  resetBoardArray(gameBoard, boardCell, 4, null);
  gameBoard[1][3] = {quadrant1: false, quadrant2: true, quadrant3: false, quadrant4: false};
  expect(getCellState(gameBoard, -1, 3).cellState).toBe(true);
  expect(getCellState(gameBoard, -2, 4).cellState).toBe(false);
});

test("Does getCellState correctly return true and false cellState values from quadrant 3 \
of a gameBoard?", () => {
  const gameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  resetBoardArray(gameBoard, boardCell, 4, null);
  gameBoard[4][2] = {quadrant1: false, quadrant2: false, quadrant3: true, quadrant4: false};
  expect(getCellState(gameBoard, -4, -2).cellState).toBe(true);
  expect(getCellState(gameBoard, -1, -1).cellState).toBe(false);
});

test("Does getCellState correctly return true and false cellState values from quadrant 4 \
of a gameBoard?", () => {
  const gameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  resetBoardArray(gameBoard, boardCell, 4, null);
  gameBoard[0][4] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  expect(getCellState(gameBoard, 0, -4).cellState).toBe(true);
  expect(getCellState(gameBoard, 1, -4).cellState).toBe(false);
});

test("Does getCellState return cellState false when given an out of bounds index?", () => {
  const gameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  resetBoardArray(gameBoard, boardCell, 4, null);
  expect(getCellState(gameBoard, 2, 5).cellState).toBe(false);
});

test("Does setCellState correctly set an element in quadrant 1 of a gameBoard and return true?",
     () => {
  const gameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  resetBoardArray(gameBoard, boardCell, 4, null);
  expect(setCellState(gameBoard, true, 0, cellUpdaterFunctions1, 0, 0)).toBe(true);
  expect(gameBoard[0][0]).toStrictEqual({
    quadrant1: true,
    quadrant2: false,
    quadrant3: false,
    quadrant4: false,
    q1LastBornOn: 0,
    q2LastBornOn: 0,
    q3LastBornOn: 0,
    q4LastBornOn: 0
  });
});

test("Does setCellState correctly set an element in quadrant 2 of a gameBoard and return true?",
      () => {
  const gameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  resetBoardArray(gameBoard, boardCell, 4, null);
  expect(setCellState(gameBoard, true, 0, cellUpdaterFunctions1, -2, 4)).toBe(true);
  expect(gameBoard[2][4]).toStrictEqual({
    quadrant1: false,
    quadrant2: true,
    quadrant3: false,
    quadrant4: false,
    q1LastBornOn: 0,
    q2LastBornOn: 0,
    q3LastBornOn: 0,
    q4LastBornOn: 0
  });
});

test("Does setCellState correctly set an element in quadrant 3 of a gameBoard and return true?",
      () => {
  const gameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  resetBoardArray(gameBoard, boardCell, 4, null);
  expect(setCellState(gameBoard, true, 0, cellUpdaterFunctions1, -1, -1)).toBe(true);
  expect(gameBoard[1][1]).toStrictEqual({
    quadrant1: false,
    quadrant2: false,
    quadrant3: true,
    quadrant4: false,
    q1LastBornOn: 0,
    q2LastBornOn: 0,
    q3LastBornOn: 0,
    q4LastBornOn: 0
  });
});

test("Does setCellState correctly set an element in quadrant 4 of a gameBoard and return true?",
      () => {
  const gameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  resetBoardArray(gameBoard, boardCell, 4, null);
  expect(setCellState(gameBoard, true, 0, cellUpdaterFunctions1, 4, -4)).toBe(true);
  expect(gameBoard[4][4]).toStrictEqual({
    quadrant1: false,
    quadrant2: false,
    quadrant3: false,
    quadrant4: true,
    q1LastBornOn: 0,
    q2LastBornOn: 0,
    q3LastBornOn: 0,
    q4LastBornOn: 0
  });
});

test("Does setCellState return false when given an out of bounds index?", () => {
  const gameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  resetBoardArray(gameBoard, boardCell, 4, null);
  expect(setCellState(gameBoard, false, 0, cellUpdaterFunctions1, 6, 3)).toBe(false);
});

const survivalRules = [false, false, true, true, false, false, false, false, false];
const birthRules = [false, false, false, true, false, false, false, false, false];

// In this test the gameBoard is initialised to the below state and is expected to change
// as indicated.
// Before:                               After:
// [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],      [ [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],        [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 1, 0, 0, 1, 0, 0, 0 ],        [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],        [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],        [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 1, 0, 0, 1, 0, 0, 0 ],        [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],        [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],        [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ]       [0, 0, 0, 0, 0, 0, 0, 0, 0] ]
test("Does updateGameBoard cause the expected change in a gameBoard when at least the following \
conditions are present: \
live cells with 0 live neighbours and dead cells with 0 or 1 live neighbours?", () => {
  const gameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  const nextGameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  const boardUpdateTable =
    Array(5).fill(updateTableCell).map(() => new Array(5).fill(updateTableCell));
  resetBoardArray(gameBoard, boardCell, 4, null);
  resetBoardArray(nextGameBoard, boardCell, 4, null);
  resetBoardArray(boardUpdateTable, updateTableCell, 4, null);
  gameBoard[2][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  gameBoard[2][1] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false};
  gameBoard[1][1] = {quadrant1: false, quadrant2: true, quadrant3: false, quadrant4: false};
  gameBoard[1][2] = {quadrant1: false, quadrant2: false, quadrant3: true, quadrant4: false};
  const totalPopulation = updateGameBoard(gameBoard, nextGameBoard, boardUpdateTable, survivalRules,
                                        birthRules, 0, -4, 4);
  expect(totalPopulation).toBe(0);

  const expectedGameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  resetBoardArray(expectedGameBoard, boardCell, 4, null);
  expect(nextGameBoard).toStrictEqual(expectedGameBoard);
});

// In this test the gameBoard is initialised to the below state before the test is run
// and is expected to change as indicated.
// Before:                               After:
// [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],      [[0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],       [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 1, 0, 0, 0, 0, 0, 0 ],       [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 1, 0, 0, 0, 0, 0, 0 ],       [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],       [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],       [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],       [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],       [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ]      [0, 0, 0, 0, 0, 0, 0, 0, 0] ]
test("Does updateGameBoard cause the expected change in a gameBoard when at least the following \
conditions are present: \
live cells with 1 live neighbour and dead cells with 0, 1 or 2 live neighbours?", () => {
  const gameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  const nextGameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  const boardUpdateTable =
    Array(5).fill(updateTableCell).map(() => new Array(5).fill(updateTableCell));
  resetBoardArray(gameBoard, boardCell, 4, null);
  resetBoardArray(nextGameBoard, boardCell, 4, null);
  resetBoardArray(boardUpdateTable, updateTableCell, 4, null);
  gameBoard[2][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  gameBoard[1][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  const totalPopulation = updateGameBoard(gameBoard, nextGameBoard, boardUpdateTable, survivalRules,
                                        birthRules, 0, -4, 4);
  expect(totalPopulation).toBe(0);

  const expectedGameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  resetBoardArray(expectedGameBoard, boardCell, 4, null);
  expect(nextGameBoard).toStrictEqual(expectedGameBoard);
});

// In this test the gameBoard is initialised to the below state before the test is run
// and is expected to change as indicated.
// Before:                               After:
// [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],      [[0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],       [0, 0, 0, 1, 0, 0, 0, 0, 0],
//   [ 0, 0, 1, 1, 1, 0, 0, 0, 0 ],       [0, 0, 0, 1, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],       [0, 0, 0, 1, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],       [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],       [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],       [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],       [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ]      [0, 0, 0, 0, 0, 0, 0, 0, 0] ]
test("Does updateGameBoard cause the expected change in a gameBoard when at least the following \
conditions are present: live cells with 1 or 2 live neighbours and dead cells with \
0, 1, 2 or 3 live neighbours?", () => {
  const gameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  const nextGameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  const boardUpdateTable =
    Array(5).fill(updateTableCell).map(() => new Array(5).fill(updateTableCell));
  resetBoardArray(gameBoard, boardCell, 4, null);
  resetBoardArray(nextGameBoard, boardCell, 4, null);
  resetBoardArray(boardUpdateTable, updateTableCell, 4, null);
  gameBoard[2][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  gameBoard[2][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  gameBoard[2][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  const totalPopulation = updateGameBoard(gameBoard, nextGameBoard, boardUpdateTable, survivalRules,
                                        birthRules, 0, -4, 4);
  expect(totalPopulation).toBe(3);

  const expectedGameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  resetBoardArray(expectedGameBoard, boardCell, 4, null);
  expectedGameBoard[2][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                             q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  expectedGameBoard[3][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                             q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  expectedGameBoard[1][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                             q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  expect(nextGameBoard).toStrictEqual(expectedGameBoard);
});

// In this test the gameBoard is initialised to the below state before the test is run
// and is expected to change as indicated.
// Before:                               After:
// [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],      [ [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],        [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 1, 1, 0, 0, 0, 0, 0 ],        [0, 0, 1, 1, 0, 0, 0, 0, 0],
//   [ 0, 0, 1, 1, 0, 0, 0, 0, 0 ],        [0, 0, 1, 1, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],        [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],        [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],        [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],        [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ]       [0, 0, 0, 0, 0, 0, 0, 0, 0] ]
test("Does updateGameBoard cause the expected change in a gameBoard when at least the following \
conditions are present: \
live cells with 3 live neighbours and dead cells with 0, 1 or 2 live neighbours?", () => {
  const gameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  const nextGameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  const boardUpdateTable =
    Array(5).fill(updateTableCell).map(() => new Array(5).fill(updateTableCell));
  resetBoardArray(gameBoard, boardCell, 4, null);
  resetBoardArray(nextGameBoard, boardCell, 4, null);
  resetBoardArray(boardUpdateTable, updateTableCell, 4, null);
  gameBoard[2][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  gameBoard[2][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  gameBoard[1][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  gameBoard[1][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  const totalPopulation = updateGameBoard(gameBoard, nextGameBoard, boardUpdateTable, survivalRules,
                                        birthRules, 0, -4, 4);
  expect(totalPopulation).toBe(4);

  const expectedGameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  resetBoardArray(expectedGameBoard, boardCell, 4, null);
  expectedGameBoard[2][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                             q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  expectedGameBoard[2][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                             q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  expectedGameBoard[1][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                             q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  expectedGameBoard[1][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                             q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  expect(nextGameBoard).toStrictEqual(expectedGameBoard);
});

// In this test the gameBoard is initialised to the below state before the test is run and
// is expected to change as indicated.
//   Before:                             After:
// [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],      [ [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],        [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 1, 1, 0, 0, 0, 0 ],        [0, 0, 1, 0, 1, 0, 0, 0, 0],
//   [ 0, 0, 1, 1, 1, 0, 0, 0, 0 ],        [0, 0, 1, 0, 1, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],        [0, 0, 0, 1, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],        [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],        [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],        [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ]       [0, 0, 0, 0, 0, 0, 0, 0, 0] ]
test("Does updateGameBoard cause the expected change in a gameBoard when at least the following \
conditions are present: live cells with 2, 3 or 4 live neighbours and dead cells with \
0, 1, 2 or 3 live neighbours?", () => {
  const gameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  const nextGameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  const boardUpdateTable =
    Array(5).fill(updateTableCell).map(() => new Array(5).fill(updateTableCell));
  resetBoardArray(gameBoard, boardCell, 4, null);
  resetBoardArray(nextGameBoard, boardCell, 4, null);
  resetBoardArray(boardUpdateTable, updateTableCell, 4, null);
  gameBoard[2][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  gameBoard[2][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  gameBoard[1][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  gameBoard[1][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  gameBoard[1][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  const totalPopulation = updateGameBoard(gameBoard, nextGameBoard, boardUpdateTable, survivalRules,
                                        birthRules, 0, -4, 4);
  expect(totalPopulation).toBe(5);

  const expectedGameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  resetBoardArray(expectedGameBoard, boardCell, 4, null);
  expectedGameBoard[2][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                             q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  expectedGameBoard[1][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                             q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  expectedGameBoard[0][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                             q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  expectedGameBoard[1][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false,
                             q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  expectedGameBoard[2][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false,
                             q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  expect(nextGameBoard).toStrictEqual(expectedGameBoard);
});

// In this test the gameBoard is initialised to the below state before the test is run and
// is expected to change as indicated.
//   Before:                             After:
// [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],      [ [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],        [0, 0, 0, 1, 0, 0, 0, 0, 0],
//   [ 0, 0, 1, 1, 1, 0, 0, 0, 0 ],        [0, 0, 1, 0, 1, 0, 0, 0, 0],
//   [ 0, 0, 1, 0, 1, 0, 0, 0, 0 ],        [0, 1, 0, 0, 0, 1, 0, 0, 0],
//   [ 0, 0, 1, 1, 1, 0, 0, 0, 0 ],        [0, 0, 1, 0, 1, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],        [0, 0, 0, 1, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],        [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],        [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ]       [0, 0, 0, 0, 0, 0, 0, 0, 0] ]
test("Does updateGameBoard cause the expected change in a gameBoard when at least the following \
conditions are present: live cells with 2 or 4 live neighbours and dead cells with \
0, 1, 2, 3 or 8 live neighbours?", () => {
  const gameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  const nextGameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  const boardUpdateTable =
    Array(5).fill(updateTableCell).map(() => new Array(5).fill(updateTableCell));
  resetBoardArray(gameBoard, boardCell, 4, null);
  resetBoardArray(nextGameBoard, boardCell, 4, null);
  resetBoardArray(boardUpdateTable, updateTableCell, 4, null);
  gameBoard[2][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  gameBoard[2][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  gameBoard[2][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  gameBoard[1][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  gameBoard[0][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  gameBoard[0][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  gameBoard[0][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  gameBoard[1][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                     q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  const totalPopulation = updateGameBoard(gameBoard, nextGameBoard, boardUpdateTable, survivalRules,
                                        birthRules, 0, -4, 4);
  expect(totalPopulation).toBe(8);

  const expectedGameBoard = Array(5).fill(boardCell).map(() => new Array(5).fill(boardCell));
  resetBoardArray(expectedGameBoard, boardCell, 4, null);
  expectedGameBoard[2][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                             q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  expectedGameBoard[3][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                             q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  expectedGameBoard[2][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false,
                             q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  expectedGameBoard[1][1] = {quadrant1: true, quadrant2: false, quadrant3: true, quadrant4: false,
                            q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  expectedGameBoard[0][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false,
                             q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  expectedGameBoard[0][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                             q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  expectedGameBoard[1][3] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true,
                             q1LastBornOn: 0, q2LastBornOn: 0, q3LastBornOn: 0, q4LastBornOn: 0};
  expect(nextGameBoard).toStrictEqual(expectedGameBoard);
});

