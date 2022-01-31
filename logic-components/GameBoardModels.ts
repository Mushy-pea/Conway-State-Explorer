// This module statically contains or dynamically generates the vertex data used within
// GameBoardRenderer to render models.

const cellModel : number[] = [0, 0, 0, 1,
                              1, 0, 0, 1,
                              1, 1, 0, 1,
                              0, 1, 0, 1];

// This is a constructor to build models for the game board grid lines based on the size
// of the gameBoard array.
function LineModels(boardArraySize : number) : void {
  const max = boardArraySize;
  const min = -max + 1;
  this.verticalLineModel = [
    min, -0.1, 0, 1,
    max, -0.1, 0, 1,
    max, 0.1, 0, 1,
    min, 0.1, 0, 1
    ];
    this.horizontalLineModel = [
      -0.1, min, 0, 1,
      0.1, min, 0, 1,
      0.1, max, 0, 1,
      -0.1, max, 0, 1
  ];
}

const modelElements = [0, 1, 2, 0, 2, 3];

export {cellModel, LineModels, modelElements};
