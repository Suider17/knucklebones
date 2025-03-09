export function customRandom(d_) {
  const probabilities = {
    d_10: {
      1: 1,
      2: 1,
      3: 1,
      4: 1,
      5: 1,
      6: 1,
      7: 4,
      8: 10,
      9: 10,
      9: 3,
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
