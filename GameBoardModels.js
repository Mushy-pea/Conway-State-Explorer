// This module statically contains or dynamically generates the vertex data used within
// GameBoardRenderer to render models.

const cellModel = [0, 0, 0, 1,
                   1, 0, 0, 1,
                   1, 1, 0, 1,
                   0, 1, 0, 1];

// This function generates models for the game board grid lines based on the size
// of the gameBoard array.
function getLineModels(boardArraySize) {
  let max = boardArraySize;
  let min = -max + 1;
  return {
    verticalLineModel: [
      min, -0.1, 0, 1,
      max, -0.1, 0, 1,
      max, 0.1, 0, 1,
      min, 0.1, 0, 1
    ],
    horizontalLineModel: [
      -0.1, min, 0, 1,
      0.1, min, 0, 1,
      0.1, max, 0, 1,
      -0.1, max, 0, 1
    ]
  };
}

const modelElements = [0, 1, 2, 0, 2, 3];

export {cellModel, getLineModels, modelElements};
