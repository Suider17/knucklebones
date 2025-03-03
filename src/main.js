import Phaser from "phaser";
import Board from "./gameObejct/diceBox/Board";
import Dice from "./gameObejct/dice/Dice";
import loadRollingDiceSprites from "./gameObejct/dice/dice.assets";
import createDiceAnimation from "./gameObejct/dice/dice.animator";
import { setPlayerDiceEvents } from "./gameObejct/dice/dice.events";
import { boardEvents } from "./gameObejct/diceBox/board.events";
import player from "./models/player";
import dice from "./models/dice";
class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });

    //Entidades complejas de la partida
    this.P1 = player();
    this.P2 = player();

    this.props = {
      round: 0, //numero de vueltas que se le ha dado a los turnos
      gameOver: false, //si la partida ya acabó
      isDuelPhase: false, //si es fase de duelos
      diceValue: 0,
    };
    this.sprites = {};
  }
  preload() {
    this.load.image("diceBox", "/assets/backgroudns/DiceBox.png");

    //call dice sprite
    this.sprites.rollingDice = loadRollingDiceSprites(this);
  }
  create() {
    //==== Player 1 ====//
    //==================
    this.P1.turn = true;
    this.P1.dice = new Dice(this, 300, 600, "diceFaces", dice(3, 3));
    this.P1.dice.setInteractive();
    createDiceAnimation(this);
    setPlayerDiceEvents(this.P1);
    this.P1.board = new Board(this, 200, 200, 1);
    this.P1.board.fillBoard();
    boardEvents(this, this.P1.board, this.P1);
    this.P1.board.enableBoardColumnEvent();
    this.P1.board.setPosition(500, 520); //<================== update board1 position

    //==== Player 2 ====//
    //==================

    this.P2.dice = new Dice(this, 1000, 200, "diceFaces", dice(4, 4));
    this.P2.board = new Board(this, 200, 200, 1);
    this.P2.board.fillBoard();
    this.P2.board.setPosition(900, 380); //<================== update board1 position
    this.P2.board.angle = 180;
  }

  update() {
    //turno del jugador 1
    if (this.P1.turn) {
      if (this.P1.isValueAssigned) {
        this.props.diceValue = this.P1.dice.getValue();
        //console.log(this.props);
        this.P1.board.enableBoardColumnEvent();
      }
    }
    //turno del jugador 2
    else if (this.P2.turn) {
      if (this.P1.isValueAssigned) {
        this.diceValue = this.entisties.dice_player2.getValue();
        this.entities.board_2.enableBoardColumnEvent();
      } else {
        //console.log("hoal");
      }
    }
    //enfrentamiento de
    else {
    }
  }
}
const config = {
  type: Phaser.CANVAS,
  width: 1400,
  height: 950,
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
