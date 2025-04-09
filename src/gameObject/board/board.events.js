import { putDiceValueInColumn } from "./board.helper";
import {
  DICE_BUCKET,
  DICE_EMPTY,
  MOD_DICE_BUCKET,
} from "../../definitions/diceDefinitions";

export function boardEvents(scene, board, player) {
  let noSortedColumn = [];
  let isMod = false;
  let hasModSlot = false;
  let hasDiceSlot = false;

  board.columns.forEach((column, index) => {
    column.on("pointerover", () => {
      noSortedColumn = [];

      isMod = DICE_BUCKET(player.dice.props.value) === MOD_DICE_BUCKET;
      hasModSlot = board.dice.some((_d) => _d.hasEmptyModSlot());
      hasDiceSlot = board.hasEmptyBoardSlot(index);

      let emptySlotIndex = 0;
      const diceOfColumn = board.getDiceInColumn(index);
      const diceBkArray = structuredClone(board.getDiceInColumn(index));

      //guarda el array de los valores de la columna
      //para cuando el mouse se quite todo regrese a su posicion
      diceBkArray.forEach((_d) => noSortedColumn.push(_d));
      //si es un mod y hay espacio donde ponerlo
      if (isMod && hasModSlot) {
        emptySlotIndex = diceOfColumn.findIndex((_d) => _d.hasEmptyModSlot());
        console.log(
          "Es el index de donde se puede poner mod: " + emptySlotIndex
        );
        if (
          emptySlotIndex !== -1 &&
          diceOfColumn[emptySlotIndex].props.value !== DICE_EMPTY
        ) {
          diceOfColumn[emptySlotIndex].setDiceMod(player.dice.props.value);
          console.log(diceOfColumn[emptySlotIndex].props.value);
        }

        //si hay un espacio vacio ordenarlo para colocar el nuevo
      } else if (!isMod && hasDiceSlot) {
        emptySlotIndex = diceOfColumn.findIndex(
          (_d) => _d.props.value === DICE_EMPTY
        );

        if (emptySlotIndex !== -1) {
          diceOfColumn[emptySlotIndex].props.value = player.dice.props.value;
          diceOfColumn[emptySlotIndex].props.bucket = DICE_BUCKET(
            player.dice.props.value
          );
        }
      } else if (!hasModSlot && !hasDiceSlot) {
        console.log("AQUI NO HAY ESPACIO MU CHAVO");
      }
      board.sortColumn(index, player.dice.props.value);
      board.updateDiceFrames();
    });
  });
  board.columns.forEach((column, index) => {
    column.on("pointerout", () => {
      console.log(noSortedColumn);
      console.log(board.getDiceInColumn(index));
      if (noSortedColumn) {
        board.getDiceInColumn(index).forEach((_d, index) => {
          _d = noSortedColumn[index];
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
