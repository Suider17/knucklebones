import dice from "../../models/dice";
import Dice from "../dice/Dice";

export default class Board extends Phaser.GameObjects.Container {
  constructor(scene, x, y, id) {
    super(scene, x, y);

    //agregar el contenedor a la escena
    scene.add.existing(this);

    this.dice = [];
    this.totals = [];
    this.columns = [];
    this.id = id;
  }

  fillBoard() {
    //creamos la imagen de contenedor
    this.add(this.scene.add.image(0, 0, "diceBox").setOrigin(0, 0));

    // Crear 9 instancias de Dice y añadirlas al array
    for (let i = 0; i < 9; i++) {
      const x = 70 + (i % 3) * 130; // Distribución en filas de 3
      const y = 70 + Math.floor(i / 3) * 130; // Distribución en columnas de 3

      const atributes = dice(i % 3, Math.floor(i / 3));
      atributes.scale = 0.6;
      atributes.blocked = true;

      // Crear una instancia de Dice
      const newDice = new Dice(
        this.scene,
        x,
        y,
        "diceFaces",
        atributes,
        this.id
      );
      // Añadir el dado al array
      this.dice.push(newDice);
      this.add(newDice);

      //add event zone to columns and totals
      if (i < 3) {
        //=== columns
        this.columns[i] = this.scene.add
          .zone(x - 55, y - 55, 115, 380)
          .setOrigin(0, 0);

        this.add(this.columns[i]);
        //===== reference column area
        const zoneReferences = this.scene.add
          .graphics()
          .lineStyle(4, 0xffffff)
          .strokeRect(x - 55, y - 55, 115, 380);
        this.add(zoneReferences);
        //===== total
        this.totals[i] = this.scene.add.text(x, y - 90, 0, {
          fontSize: "32px",
          color: "#ffffff",
        });

        if (this.id == 2) {
          this.totals[i].angle = 180;
        }

        this.add(this.totals[i]);
      }
    }
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
    if (value < 7) {
      let total = parseInt(this.totals[column].text);
      this.totals[column].setText(parseInt((total += value)));
    }
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

  setFrontLine(column, value) {
    if (
      this.dice.some((d, index) => {
        return d.atributes.position[(index, column)] && d.atributes.value == 7;
      })
    ) {
      console.log("sihay");
    }
  }
}
