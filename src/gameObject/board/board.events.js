import {
  hasEmptyBoardSlot,
  sortByDiceBucket,
  putDiceValueInColumn,
} from "./board.helper";

export function boardEvents(scene, board, player) {
  board.columns.forEach((column, index) => {
    column.on("pointerover", () => {
      //si hay un espacio vacio ordenarlo para colocar el nuevo
      if (
        hasEmptyBoardSlot(
          board.dice.filter((dice) => dice.props.position[0] === index)
        )
      ) {
        sortByDiceBucket(
          board.dice.filter((dice) => dice.props.position[0] === index),
          player.dice
        );
      }
    });
  });
  board.columns.forEach((column, index) => {
    column.on("pointerout", () => {
      orderAvailableBoardSlot(
        board.dice.filter((dice) => dice.props.position[0] === index),
        player.dice
      );
      // availablePlace && availablePlace.hideBorder(player.dice.props.value);
    });
  });
  board.columns.forEach((column, index) => {
    column.on("pointerdown", () => {
      putDiceValueInColumn(scene, player, index);
    });
  });
}
