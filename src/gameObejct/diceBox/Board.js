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
      const x = 30 + (i % 3) * 130; // Distribución en filas de 3
      const y = 30 + Math.floor(i / 3) * 130; // Distribución en columnas de 3

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
      this.add(newDice);

      //add event zone to columns and totals
      if (i < 3) {
        //=== columns
        this.columns[i] = this.scene.add
          .zone(x - 17, y - 17, 115, 380)
          .setOrigin(0, 0);

        this.add(this.columns[i]);
        //===== reference column area
        const zoneReferences = this.scene.add
          .graphics()
          .lineStyle(4, 0xffffff)
          .strokeRect(x - 17, y - 17, 115, 380);
        this.add(zoneReferences);
        //===== total
        this.totals[i] = this.scene.add.text(x, y - 60, 0, {
          fontSize: "32px",
          color: "#ffffff",
        });
        this.add(this.totals[i]);
      }
    }

    //
    // this.totals[1] = this.scene.add.text(625, 120, 0, {
    //   fontSize: "32px",
    //   color: "#ffffff",
    // });
    // this.totals[2] = this.scene.add.text(750, 120, 0, {
    //   fontSize: "32px",
    //   color: "#ffffff",
    // });

    // // Dibujar un rectángulo para visualizar la zona
    // this.scene.add
    //   .graphics()
    //   .lineStyle(4, 0xffffff)
    //   .strokeRect(450, 170, 100, 380);
    // const graphics = this.scene.add
    //   .graphics()
    //   .lineStyle(4, 0x00ff01)
    //   .strokeRect(590, 170, 100, 380); // Borde verde, grosor 2 // (x, y, width, height)

    // this.scene.add
    //   .graphics()
    //   .lineStyle(4, 0x00000)
    //   .strokeRect(725, 170, 100, 380);

    // const bounds = this.getBounds();
    // console.log(bounds);

    // const graph = this.scene.add.graphics();
    // graph.lineStyle(2, 0xff0000); // Color rojo y grosor 2px
    // graph.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
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
