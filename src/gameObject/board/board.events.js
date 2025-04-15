import { putDiceValueInColumn } from "./board.helper";
import {
  DICE_BUCKET,
  DICE_EMPTY,
  MOD_DICE_BUCKET,
} from "../../definitions/diceDefinitions";

export function boardEvents(scene, board, player) {
  let diceBkArray = [];
  let isMod = false;
  let hasModSlot = false;
  let hasDiceSlot = false;

  board.columns.forEach((column, index) => {
    column.on("pointerover", () => {
      diceBkArray = [];
      isMod = DICE_BUCKET(player.dice.props.value) === MOD_DICE_BUCKET;
      hasModSlot = board.dice.some((_d) => _d.hasEmptyModSlot());
      hasDiceSlot = board.hasEmptyBoardSlot(index);

      let emptySlotIndex = 0;
      const diceOfColumn = board.getDiceInColumn(index);
      diceBkArray = JSON.parse(
        JSON.stringify(board.getDiceInColumn(index).map((d) => d.props))
      );

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
      board.refreshDiceSprites();
    });
  });
  board.columns.forEach((column, index) => {
    column.on("pointerout", () => {
      if (diceBkArray) {
        board.getDiceInColumn(index).forEach((_d, index) => {
          _d.props = diceBkArray[index];
          _d.refreshMods();
        });
        board.refreshDiceSprites();
      }
    });
  });
  board.columns.forEach((column, index) => {
    column.on("pointerdown", () => {
      putDiceValueInColumn(scene, player, index);
      diceBkArray = null;
    });
  });
}
