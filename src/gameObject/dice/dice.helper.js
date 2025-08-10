import {
  DICE_1,
  DICE_2,
  DICE_3,
  DICE_4,
  DICE_5,
  DICE_6,
  DICE_REROLL,
  DICE_SHIELD,
  DICE_SKULL,
  DICE_SWORD,
} from "../../definitions/diceDefinitions";

export function customRandom(d_) {
  const probabilities = {
    d_11: {
      [DICE_1]: 1,
      [DICE_2]: 1,
      [DICE_3]: 1,
      [DICE_4]: 0,
      [DICE_5]: 0,
      [DICE_6]: 0,
      [DICE_SHIELD]: 10,
      [DICE_SWORD]: 10,
      [DICE_SKULL]: 1,
      //[DICE_REROLL]: 0,
      //11: 1,
    },
    d_6: {
      1: 10,
      2: 10,
      3: 10,
      4: 10,
      5: 10,
      6: 10,
    },
  };
  // Crear un array de valores ponderados
  let weightedArray = [];
  let selectedArray = probabilities[d_];
  for (let value in selectedArray) {
    // Repetir cada valor en el array según su probabilidad
    for (let i = 0; i < selectedArray[value]; i++) {
      weightedArray.push(Number(value));
    }
  }

  // Seleccionar un valor aleatorio basado en la ponderación
  const randomIndex = Phaser.Math.Between(0, weightedArray.length - 1);
  return weightedArray[randomIndex];
}
