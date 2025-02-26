import Phaser from "phaser";
import Board from "./gameObejct/diceBox/Board";
import Dice from "./gameObejct/dice/Dice";
import loadRollingDiceSprites from "./gameObejct/dice/dice.assets";
import createDiceAnimation from "./gameObejct/dice/dice.animator";
class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });

    //objeto para guardar los dados
    this.entities = {};
    this.animations = {};
    this.diceValue = 0;
    this.sprites = {};
  }

  preload() {
    this.load.image("background", "/assets/background.png");
    this.load.image("diceBox", "/assets/backgroudns/DiceBox.png");

    //call dice sprite
    this.sprites.rollingDice = loadRollingDiceSprites(this);
  }
  create() {
    this.add.image(0, 0, "background").setOrigin(0, 0);

    const atributes = {
      value: 0,
      mod: "",
      status: "",
      position: [3, 3], //[row,column]
      blocked: false,
      scale: 1,
    };

    this.entities.rollingDice = new Dice(this, 0, 0, "diceFaces", atributes);
    createDiceAnimation(this);

    const boardContainer = this.add.container(640, 360);
    const boardSprite = this.add.image(0, 0, "diceBox");
    boardContainer.add(boardSprite);

    this.entities.board = new Board(this, 0, 0);
    this.entities.board.fillBoard();
    boardContainer.add(this.entities.board);
  }

  update() {
    if (this.entities.rollingDice.value != 0) {
      this.diceValue = this.entities.rollingDice.getValue();
      this.entities.rollingDice.resetValue();
    }
  }
}
const config = {
  type: Phaser.CANVAS,
  width: 1280,
  height: 720,
  scene: MainScene,
  render: {
    antialias: false, // Desactivar antialiasing si no es necesario
    pixelArt: true, // Hacer que el juego use píxeles y no suavizados
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
