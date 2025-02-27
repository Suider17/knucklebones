import Dice from "../dice/Dice";

export default class Board extends Phaser.GameObjects.Container {
  constructor(scene, x, y, id) {
    super(scene, x, y);

    this.dice = [];
    this.totals = [];
    this.columns = [];
    this.id = id;
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

    //add areas
    this.columns[0] = this.scene.add.zone(500, 360, 100, 380);
    this.columns[1] = this.scene.add.zone(640, 360, 100, 380);
    this.columns[2] = this.scene.add.zone(775, 360, 100, 380);

    // Dibujar un rectángulo para visualizar la zona
    this.scene.add
      .graphics()
      .lineStyle(4, 0xffffff)
      .strokeRect(450, 170, 100, 380);
    const graphics = this.scene.add
      .graphics()
      .lineStyle(4, 0x00ff01)
      .strokeRect(590, 170, 100, 380); // Borde verde, grosor 2 // (x, y, width, height)

    this.scene.add
      .graphics()
      .lineStyle(4, 0x00000)
      .strokeRect(725, 170, 100, 380);
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

  enableBoardColumnEvent() {
    this.columns.forEach((column) => {
      column.setInteractive();
    });
  }
  disableBoardDiceEvent() {
    this.columns.forEach((column) => {
      column.disableInteractive();
    });
  }
}
