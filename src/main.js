import Phaser from "phaser";
import Board from "./gameObejct/diceBox/Board";
import Dice from "./gameObejct/dice/Dice";
import loadRollingDiceSprites from "./gameObejct/dice/dice.assets";
import createDiceAnimation from "./gameObejct/dice/dice.animator";
import { setRollingDiceEvents } from "./gameObejct/dice/dice.events";
import {
  setBoardMouseDownEvent,
  asignationDiceEvent,
} from "./gameObejct/diceBox/board.events";
class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });

    //objeto para guardar los dados
    this.entities = {
      rollingDice: null,
      board_1: null,
      board_2: null,
    };
    this.animations = {};
    this.diceValue = 0;
    this.sprites = {};
    this.validations = {
      waitAsignation_player1: false,
      waitAsignation_player2: false,
      turn_player1: true,
      turn_player2: false,
      crashBoards: false,
      endRun: true,
    };
    this.atributes = { round: 0, turn: 0 };

    this.RollingDiceAtributes = {
      value: 0,
      mod: "",
      status: "",
      position: [3, 3], //[row,column]
      blocked: false,
      scale: 1,
    };
  }
  preload() {
    this.load.image("diceBox", "/assets/backgroudns/DiceBox.png");

    //call dice sprite
    this.sprites.rollingDice = loadRollingDiceSprites(this);
  }
  create() {
    //rolling dice
    this.entities.rollingDice = new Dice(
      this,
      0,
      0,
      "diceFaces",
      this.RollingDiceAtributes
    );
    this.entities.rollingDice.setInteractive();
    createDiceAnimation(this);
    setRollingDiceEvents(this);

    const boardContainer = this.add.container(640, 360);
    const boardSprite = this.add.image(0, 0, "diceBox");
    boardContainer.add(boardSprite);

    this.entities.board_1 = new Board(this, 0, 0, 1);
    this.entities.board_1.fillBoard();
    asignationDiceEvent(this);

    boardContainer.add(this.entities.board_1);
  }

  update() {
    //turno del jugador 1
    if (this.validations.turn_player1 && !this.validations.turn_player2) {
      if (this.validations.waitAsignation_player1) {
        this.diceValue = this.entities.rollingDice.getValue();
        this.entities.board_1.enableBoardColumnEvent();
      }
    }
    //turno del jugador 2
    else if (!this.validations.turn_player1 && this.validations.turn_player2) {
      if (this.validations.waitAsignation_player2) {
        this.diceValue = this.entities.rollingDice.getValue();
        this.entities.board_1.enableBoardColumnEvent();
      }
    }
    //enfrentamiento de
    else if (this.validations.turn_player1 && this.validations.turn_player2) {
    }
  }
}
const config = {
  type: Phaser.CANVAS,
  width: 1400,
  height: 800,
  scene: MainScene,
  backgroundColor: "#262626",
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
