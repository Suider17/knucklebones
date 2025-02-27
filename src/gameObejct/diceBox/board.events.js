import { putDiceValueInColumn } from "./board.helper";

export function setBoardMouseDownEvent(callback, column, scene) {
  column.on("pointerdown", () => {
    callback(scene);
  });
}

export function asignationDiceEvent(scene) {
  const board = scene.entities.board_1;
  board.columns.forEach((column, index) => {
    column.on("pointerdown", () => {
      putDiceValueInColumn(scene, board, index);
    });
  });
}
