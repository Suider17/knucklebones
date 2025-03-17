import { availableDiceOrSlot, putDiceValueInColumn } from "./board.helper";

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

  board.columns.forEach((column, index) => {
    column.on("pointerover", () => {
      const availablePlace = availableDiceOrSlot(
        board.dice.filter((dice) => dice.props.position[0] === index),
        player.dice
      );
      availablePlace && availablePlace.showBorder(player.dice.props.value);
    });
  });
  board.columns.forEach((column, index) => {
    column.on("pointerout", () => {
      const availablePlace = availableDiceOrSlot(
        board.dice.filter((dice) => dice.props.position[0] === index),
        player.dice
      );
      availablePlace && availablePlace.hideBorder(player.dice.props.value);
    });
  });
}
