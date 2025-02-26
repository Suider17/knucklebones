import Dice from "../dice/Dice";

export default class Board extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.dice = [];
    this.totals = [];
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

    this.totals[0] = this.scene.add.text(500, 120, 0, {
      fontSize: "32px",
      color: "#ffffff",
    });
    this.totals[1] = this.scene.add.text(625, 120, 0, {
      fontSize: "32px",
      color: "#ffffff",
    });
    this.totals[2] = this.scene.add.text(750, 120, 0, {
      fontSize: "32px",
      color: "#ffffff",
    });
  }

  enableBoardDiceEvent() {
    this.dice.forEach((dice) => {
      dice.setInteractive();
    });
  }
  disableBoardDiceEvent() {
    this.dice.forEach((dice) => {
      dice.disableInteractive();
    });
  }

  updateSingleTotal(column, value) {
    let total = parseInt(this.totals[column].text);
    this.totals[column].setText(parseInt((total += value)));
  }
}
