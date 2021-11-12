// This module contains the vertex data used within GameBoardRenderer to render models.

const cellModel = [0, 0, 0, 1,
                   1, 0, 0, 1,
                   1, 1, 0, 1,
                   0, 1, 0, 1];

const verticalLineModel = [-128, -0.1, 0, 1,
                           128, -0.1, 0, 1,
                           128, 0.1, 0, 1,
                           -128, 0.1, 0, 1];

const horizontalLineModel = [-0.1, -128, 0, 1,
                             0.1, -128, 0, 1,
                             0.1, 128, 0, 1,
                             -0.1, 128, 0, 1];

const modelElements = [0, 1, 2, 2, 3, 0];

export {cellModel, verticalLineModel, horizontalLineModel, modelElements};
