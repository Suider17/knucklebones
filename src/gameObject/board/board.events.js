import { putDiceValueInColumn } from "./board.helper";
import { DICE_EMPTY } from "../../definitions/diceDefinitions";

export function boardEvents(scene, board, player) {
  let noSortedColumn = [];

  board.columns.forEach((column, index) => {
    column.on("pointerover", () => {
      noSortedColumn = [];
      //guarda el array de los valores de la columna
      //para cuando el mouse se quite todo regrese a su posicion
      for (let i = 0; i < 3; i++) {
        //console.log(column);
        const array = board.dice.filter(
          (dice) => dice.props.position[0] === index
        );
        noSortedColumn.push(array[i].props.value);
      }
      //si hay un espacio vacio ordenarlo para colocar el nuevo
      if (board.hasEmptyBoardSlot(index)) {
        const diceOfColumn = board.dice.filter(
          (dice) => dice.props.position[0] === index
        );
        const emptySlotIndex = diceOfColumn.findIndex(
          (_d) => _d.props.value === DICE_EMPTY
        );
        emptySlotIndex !== -1 &&
          (diceOfColumn[emptySlotIndex].props.value = player.dice.props.value);

        board.sortColumnByDiceBucket(index, player.dice.props.value);
        //console.log(board.dice);
        board.updateDiceFrames();
      }
    });
  });
  board.columns.forEach((column, index) => {
    column.on("pointerout", () => {
      if (noSortedColumn) {
        board.dice
          .filter((dice) => dice.props.position[0] === index)
          .forEach((_d, index) => {
            _d.props.value = noSortedColumn[index];
          });
        board.updateDiceFrames();
      }
    });
  });
  board.columns.forEach((column, index) => {
    column.on("pointerdown", () => {
      putDiceValueInColumn(scene, player, index);
      noSortedColumn = null;
    });
  });
}
