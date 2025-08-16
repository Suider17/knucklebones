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
} from "../../definitions/dice.definit";

export function customRandom(d_) {
  const probabilities = {
    d_11: {
      [DICE_1]: 10,
      [DICE_2]: 10,
      [DICE_3]: 10,
      [DICE_4]: 10,
      [DICE_5]: 10,
      [DICE_6]: 10,
      [DICE_SHIELD]: 2,
      [DICE_SWORD]: 20,
      [DICE_SKULL]: 0,
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
