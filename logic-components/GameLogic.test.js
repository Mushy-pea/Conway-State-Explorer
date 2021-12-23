// This module contains unit tests for functions in the GameLogic module.

'use strict';

import {createGameBoard, createUpdateTable, getCellState, setCellState, updateGameBoard}
from "./GameLogic.js";

test("Does getCellState correctly return true and false from quadrant 1 of a gameBoard?", () => {
  let gameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(gameBoard);
  gameBoard[2][2] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false};
  expect(getCellState(2, 2, gameBoard) === {exists: true, cellState: true});
  expect(getCellState(1, 4, gameBoard) === {exists: true, cellState: false});
});

test("Does getCellState correctly return true and false from quadrant 2 of a gameBoard?", () => {
  let gameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(gameBoard);
  gameBoard[1][3] = {quadrant1: false, quadrant2: true, quadrant3: false, quadrant4: false};
  expect(getCellState(-1, 3, gameBoard) === {exists: true, cellState: true});
  expect(getCellState(-2, 4, gameBoard) === {exists: true, cellState: false});
});

test("Does getCellState correctly return true and false from quadrant 3 of a gameBoard?", () => {
  let gameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(gameBoard);
  gameBoard[4][2] = {quadrant1: false, quadrant2: false, quadrant3: true, quadrant4: false};
  expect(getCellState(-4, -2, gameBoard) === {exists: true, cellState: true});
  expect(getCellState(-1, -1, gameBoard) === {exists: true, cellState: false});
});

test("Does getCellState correctly return true and false from quadrant 4 of a gameBoard?", () => {
  let gameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(gameBoard);
  gameBoard[0][4] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  expect(getCellState(0, -4, gameBoard) === {exists: true, cellState: true});
  expect(getCellState(1, -4, gameBoard) === {exists: true, cellState: false});
});

test("Does getCellState report that a cell doesn't exist when given an invalid index?",
  () => {
    let gameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
    createGameBoard(gameBoard);
    expect(getCellState(2, 5, gameBoard) === {exists: false, cellState: false})
  });

test("Does setCellState correctly set an element in quadrant 1 of a gameBoard and return true?",
() => {
  let gameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(gameBoard);
  expect(setCellState(0, 0, true, gameBoard));
  expect(gameBoard[0][0] ===
    {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false});
});

test("Does setCellState correctly set an element in quadrant 2 of a gameBoard and return true?",
() => {
  let gameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(gameBoard);
  expect(setCellState(-2, 4, true, gameBoard));
  expect(gameBoard[2][4] ===
    {quadrant1: false, quadrant2: true, quadrant3: false, quadrant4: false});
});

test("Does setCellState correctly set an element in quadrant 3 of a gameBoard and return true?",
() => {
  let gameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(gameBoard);
  expect(setCellState(-1, -1, true, gameBoard));
  expect(gameBoard[1][1] ===
    {quadrant1: false, quadrant2: false, quadrant3: true, quadrant4: false});
});

test("Does setCellState correctly set an element in quadrant 4 of a gameBoard and return true?",
() => {
  let gameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(gameBoard);
  expect(setCellState(4, -4, true, gameBoard));
  expect(gameBoard[4][4] ===
    {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true});
});

test("Does setCellState return false when given an invalid index?", () => {
  let gameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(gameBoard);
  expect(setCellState(6, 3, false, gameBoard) === false);
});

// In this test the gameBoard is initialised to the below virtual state before the test is run
// and is expected to change as indicated.
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
test("Does updateGameBoard cause the expected change in a gameBoard when at least the following\
      conditions are present:\
      live cells with 0 live neighbours and dead cells with 0 or 1 live neighbours?", () => {
  let gameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  let newGameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(gameBoard);
  createGameBoard(newGameBoard);
  let boardUpdateTable = Array(5).fill(0).map(() => new Array(5).fill(0));
  createUpdateTable(boardUpdateTable);
  let gameTime = 0;
  gameBoard[2][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  gameBoard[2][1] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false};
  gameBoard[1][1] = {quadrant1: false, quadrant2: true, quadrant3: false, quadrant4: false};
  gameBoard[1][2] = {quadrant1: false, quadrant2: false, quadrant3: true, quadrant4: false};
  
  let success = updateGameBoard(boardUpdateTable, gameBoard, newGameBoard,
    [false, false, true, true, false, false, false, false, false],
    [false, false, false, true, false, false, false, false, false], gameTime, -4, -4,
    4, 4);
  expect(success);

  let expected = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(expected);
  expect(JSON.stringify(newGameBoard) === JSON.stringify(expected)).toBe(true);
});

// In this test the gameBoard is initialised to the below virtual state before the test is run
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
test("Does updateGameBoard cause the expected change in a gameBoard when at least the following\
      conditions are present:\
      live cells with 1 live neighbour and dead cells with 0, 1 or 2 live neighbours?", () => {
  let gameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  let newGameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(gameBoard);
  createGameBoard(newGameBoard);
  let boardUpdateTable = Array(5).fill(0).map(() => new Array(5).fill(0));
  createUpdateTable(boardUpdateTable);
  let gameTime = 0;
  gameBoard[2][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  gameBoard[1][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  
  let success = updateGameBoard(boardUpdateTable, gameBoard, newGameBoard,
    [false, false, true, true, false, false, false, false, false],
    [false, false, false, true, false, false, false, false, false], gameTime, -4, -4,
    4, 4);
  expect(success);

  let expected = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(expected);
  expect(JSON.stringify(newGameBoard) === JSON.stringify(expected)).toBe(true);
});

// In this test the gameBoard is initialised to the below virtual state before the test is run
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
test("Does updateGameBoard cause the expected change in a gameBoard when at least the following\
      conditions are present:\
      live cells with 1 or 2 live neighbours and dead cells with 0, 1, 2 or 3 live neighbours?", () => {
  let gameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  let newGameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(gameBoard);
  createGameBoard(newGameBoard);
  let boardUpdateTable = Array(5).fill(0).map(() => new Array(5).fill(0));
  createUpdateTable(boardUpdateTable);
  let gameTime = 0;
  gameBoard[2][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  gameBoard[2][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  gameBoard[2][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false};
  
  let success = updateGameBoard(boardUpdateTable, gameBoard, newGameBoard,
    [false, false, true, true, false, false, false, false, false],
    [false, false, false, true, false, false, false, false, false], gameTime, -4, -4,
    4, 4);
  expect(success);

  let expected = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(expected);
  expected[2][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  expected[3][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  expected[1][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  expect(JSON.stringify(newGameBoard) === JSON.stringify(expected)).toBe(true);
});

// In this test the gameBoard is initialised to the below virtual state before the test is run
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
test("Does updateGameBoard cause the expected change in a gameBoard when at least the following\
      conditions are present:\
      live cells with 3 live neighbours and dead cells with 0, 1 or 2 live neighbours?", () => {
  let gameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  let newGameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(gameBoard);
  createGameBoard(newGameBoard);
  let boardUpdateTable = Array(5).fill(0).map(() => new Array(5).fill(0));
  createUpdateTable(boardUpdateTable);
  let gameTime = 0;
  gameBoard[2][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  gameBoard[2][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  gameBoard[1][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  gameBoard[1][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  
  let success = updateGameBoard(boardUpdateTable, gameBoard, newGameBoard,
    [false, false, true, true, false, false, false, false, false],
    [false, false, false, true, false, false, false, false, false], gameTime, -4, -4,
    4, 4);
  expect(success);

  let expected = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(expected);
  expected[2][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  expected[2][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  expected[1][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  expected[1][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  expect(JSON.stringify(newGameBoard) === JSON.stringify(expected)).toBe(true);
});

// In this test the gameBoard is initialised to the below virtual state before the test is run and
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
test("Does updateGameBoard cause the expected change in a gameBoard when at least the following\
      conditions are present:\
      live cells with 2, 3 or 4 live neighbours and dead cells with 0, 1, 2 or 3 live neighbours?", () => {
  let gameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  let newGameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(gameBoard);
  createGameBoard(newGameBoard);
  let boardUpdateTable = Array(5).fill(0).map(() => new Array(5).fill(0));
  createUpdateTable(boardUpdateTable);
  let gameTime = 0;
  gameBoard[2][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  gameBoard[2][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false};
  gameBoard[1][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  gameBoard[1][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  gameBoard[1][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false};
  
  let success = updateGameBoard(boardUpdateTable, gameBoard, newGameBoard,
    [false, false, true, true, false, false, false, false, false],
    [false, false, false, true, false, false, false, false, false], gameTime, -4, -4,
    4, 4);
  expect(success);

  let expected = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(expected);
  expected[2][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  expected[1][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  expected[0][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  expected[1][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false};
  expected[2][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false};
  expect(JSON.stringify(newGameBoard) === JSON.stringify(expected)).toBe(true);
});

// In this test the gameBoard is initialised to the below virtual state before the test is run and
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
test("Does updateGameBoard cause the expected change in a gameBoard when at least the following\
      conditions are present:\
      live cells with 2 or 4 live neighbours and dead cells with 0, 1, 2, 3 or 8 live neighbours?", () => {
  let gameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  let newGameBoard = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(gameBoard);
  createGameBoard(newGameBoard);
  let boardUpdateTable = Array(5).fill(0).map(() => new Array(5).fill(0));
  createUpdateTable(boardUpdateTable);
  let gameTime = 0;
  gameBoard[2][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  gameBoard[2][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  gameBoard[2][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false};
  gameBoard[1][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false};
  gameBoard[0][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false};
  gameBoard[0][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  gameBoard[0][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  gameBoard[1][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  
  let success = updateGameBoard(boardUpdateTable, gameBoard, newGameBoard,
    [false, false, true, true, false, false, false, false, false],
    [false, false, false, true, false, false, false, false, false], gameTime, -4, -4,
    4, 4);
  expect(success);

  let expected = Array(5).fill(0).map(() => new Array(5).fill(0));
  createGameBoard(expected);
  expected[2][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  expected[3][1] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  expected[2][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false};
  expected[1][1] = {quadrant1: true, quadrant2: false, quadrant3: true, quadrant4: false};
  expected[0][0] = {quadrant1: true, quadrant2: false, quadrant3: false, quadrant4: false};
  expected[0][2] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};
  expected[1][3] = {quadrant1: false, quadrant2: false, quadrant3: false, quadrant4: true};

  expect(JSON.stringify(newGameBoard) === JSON.stringify(expected)).toBe(true);
});
