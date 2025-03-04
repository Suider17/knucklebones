import { putDiceValueInColumn } from "./board.helper";

export function setBoardMouseDownEvent(callback, column, scene) {
  column.on("pointerdown", () => {
    callback(scene);
  });
}

export function boardEvents(scene, board, player) {
  board.columns.forEach((column, index) => {
    column.on("pointerdown", () => {
      putDiceValueInColumn(scene, player, index);
    });
  });
}
