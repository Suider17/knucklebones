import { putDiceValueInColumn } from "./board.helper";
import {
  DICE_BUCKET,
  DICE_EMPTY,
  MOD_DICE_BUCKET,
  NORMAL_BUCKET_ARRAY,
} from "../../definitions/diceDefinitions";

export function boardEvents(scene, board, player) {
  let isMod = false;
  let hasModSlot = false;
  let hasDiceSlot = false;

  board.columnsInteractiveZones.forEach((column, index) => {
    ///
    column.on("pointerover", () => {
      const diceInColumn = board.columns[index];

      isMod = DICE_BUCKET(player.dice.props.value) === MOD_DICE_BUCKET;
      hasModSlot = diceInColumn.some((_d) => _d.hasEmptyModSlot());
      hasDiceSlot = board.hasEmptyDiceSlot(index);

      if (!isMod && hasDiceSlot) {
        board.addNewDiceInColumn(index, player.dice.props.value);
      } else if (isMod && hasModSlot) {
        const diceWithModSlot = board.getDiceWithEmptyModSlot(index);
        if (diceWithModSlot) {
          diceWithModSlot.setNewMod(player.dice.props.value);
        }
      } else if (!hasModSlot && !hasDiceSlot) {
        console.log("AQUI NO HAY ESPACIO MU CHAVO");
      }

      board.sortColumn(index);
    });
  });

  ///
  board.columnsInteractiveZones.forEach((column, index) => {
    column.on("pointerout", () => {
      const lastInserted = board.getLastInsertedDice(); //el ultimo dado insertado
      const diceInColumn = board.columns[index];
      if (lastInserted.object && lastInserted.index !== -1) {
        if (!isMod) {
          //eliminamos el ultimo dado insertado de la columna
          {
            lastInserted.object.diceSprite.destroy();
            board.columns[index].splice(lastInserted.index, 1);
          }
        } else if (
          isMod &&
          diceInColumn.some((_d) =>
            NORMAL_BUCKET_ARRAY.includes(_d.props.value)
          )
        ) {
          const mod = lastInserted.object.props.mods.find(
            (mod) => mod.lastInserted
          );
          mod.value = DICE_EMPTY;
          mod.lastInserted = false;
          lastInserted.object.props.lastInserted = false;
          lastInserted.object.refreshMods();
        }
      }

      board.sortColumn(index);
    });
  });

  ///
  board.columnsInteractiveZones.forEach((column, index) => {
    column.on("pointerdown", () => {
      const lastInserted = board.getLastInsertedDice(); // El último dado insertado
      const hasModSlot = board.columns[index].some((_d) =>
        NORMAL_BUCKET_ARRAY.includes(_d.props.value)
      );

      if (!lastInserted.object || lastInserted.index === -1) {
        console.warn("No hay dado válido seleccionado para insertar");
      }

      lastInserted.object.props.lastInserted = false;

      if (!isMod) {
        // Insertar dado normal
        putDiceValueInColumn(scene, player, index);
      } else if (isMod && hasModSlot) {
        // Insertar dado como mod
        const mod = lastInserted.object.props.mods.find(
          (mod) => mod.lastInserted
        );

        if (mod) {
          mod.lastInserted = false;
          lastInserted.object.refreshMods();
          putDiceValueInColumn(scene, player, index);
        } else {
          console.warn("No se encontró un mod marcado como lastInserted");
        }
      } else {
        console.warn("No existe condición para poner este dado");
      }
    });
  });
}
