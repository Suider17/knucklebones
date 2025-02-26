import Dice from "../dice/Dice";

export default class Board extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.dice = [];
  }

  fillBoard() {
    // Crear 9 instancias de Dice y añadirlas al array
    for (let i = 0; i < 9; i++) {
      const x = 460 + (i % 3) * 140; // Distribución en filas de 3
      const y = 190 + Math.floor(i / 3) * 130; // Distribución en columnas de 3

      const atributes = {
        value: 0,
        mod: "",
        status: "",
        position: [i % 3, Math.floor(i / 3)], //[row,column]
        blocked: true,
        scale: 0.6,
      };

      // Crear una instancia de Dice
      const newDice = new Dice(this.scene, x, y, "diceFaces", atributes);
      // Añadir el dado al array
      this.dice.push(newDice);
    }
  }
}
