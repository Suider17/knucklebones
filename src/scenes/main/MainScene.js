import Phaser from "phaser";
import Board from "../../gameObject/board/Board";
import Dice from "../../gameObject/dice/Dice";
import {
  loadDiceSprites,
  loadDiceModsSprites,
} from "../../gameObject/dice/dice.assets";
import { createDiceAnimation } from "../../gameObject/dice/dice.animator";
import { setPlayerDiceEvents } from "../../gameObject/dice/dice.events";
import { boardEvents } from "../../gameObject/board/board.events";
import player from "../../models/player";
import dice from "../../models/dice";
import { startPlayerTurn } from "../../gameObject/board/board.helper";
import { setRoundText, setUntilDuelText } from "./mainScene.helper";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });

    //Entidades complejas de la partida
    this.P1 = player();
    this.P2 = player("p2");

    this.props = {
      round: 1, //cada vez que los dos jugadores terminaron sus turnos se suma 1
      gameOver: false, //si la partida ya acabó
      isDuelPhase: false, //si es fase de duelos
      diceValue: 0,
      untilDuelCounter: 3, //cada cuantas rondas se va a generar un duelo
    };
    this.sprites = {};
    this.text = {
      roundCounter: null,
      untilDuelCounter: null,
      playerTurn: 1,
    };
  }
  preload() {
    this.load.image("diceBox", "/assets/backgroudns/DiceBox.png");

    //call dice sprite
    this.sprites.rollingDice = loadDiceSprites(this);
    //call dice mods sprite
    this.sprites.diceMods = loadDiceModsSprites(this);
  }
  create() {
    //======
    //ANimations
    createDiceAnimation(this);

    //==== Player 1 ====//
    //==================
    this.P1.turn = true;
    this.P1.dice = new Dice(this, 300, 600, "diceFaces", dice(3, 3));
    setPlayerDiceEvents(this.P1);
    this.P1.board = new Board(this, 200, 200, 1);
    this.P1.board.fillBoard();
    boardEvents(this, this.P1.board, this.P1);
    this.P1.board.setPosition(500, 520); //<================== update board1 position

    //====
    //Inicio de turno
    startPlayerTurn(this.P1);

    //==== Player 2 ====//
    //==================

    this.P2.dice = new Dice(this, 1000, 200, "diceFaces", dice(4, 4));
    setPlayerDiceEvents(this.P2);
    this.P2.board = new Board(this, 200, 200, 2);
    this.P2.board.fillBoard();
    boardEvents(this, this.P2.board, this.P2);
    this.P2.board.setPosition(900, 380); //<================== update board1 position
    this.P2.board.angle = 180;

    //textos de informacion en pantalla
    const infoContainer = this.add.container(30, 30);

    //=========
    //Ronda actual

    const rounCountTitle = this.add.text(0, 0, "Ronda actual", {
      fontSize: "24px",
      color: "#ffffff",
    });
    infoContainer.add(rounCountTitle);
    this.text.roundCounter = this.add.text(70, 30, this.props.round, {
      fontSize: "40px",
      fontFamily: "Roboto",
      color: "#ffffff",
      fontStyle: "bold",
    });
    infoContainer.add(this.text.roundCounter);
    //==========

    //======
    //rondas hasta duelo
    const untilDuelTitle = this.add.text(0, 100, "Rondas hasta duelo", {
      fontSize: "24px",
      color: "#ffffff",
    });
    infoContainer.add(untilDuelTitle);
    this.text.untilDuelCounter = this.add.text(
      100,
      130,
      this.props.untilDuelCounter,
      {
        fontSize: "40px",
        fontFamily: "Roboto",
        color: "#ffffff",
        fontStyle: "bold",
      }
    );
    infoContainer.add(this.text.untilDuelCounter);
    //==========

    this.message = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, "¡GO!", {
        fontSize: "80px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setAlpha(0); // Inicialmente oculto
  }

  update() {
    //turno del jugador 1
    if (this.P1.turn) {
      this.P2.board.setAlpha(0.5);
      this.P2.dice.setAlpha(0.5);

      this.P1.board.setAlpha(1);
      this.P1.dice.setAlpha(1);
      if (this.P1.isValueAssigned) {
      } else {
      }
    }
    //turno del jugador 2
    if (this.P2.turn) {
      this.P1.board.setAlpha(0.5);
      this.P1.dice.setAlpha(0.5);

      this.P2.board.setAlpha(1);
      this.P2.dice.setAlpha(1);
      if (this.P2.isValueAssigned) {
      } else {
      }
    }

    //actualizar titulos
    setRoundText(this);
    setUntilDuelText(this);

    if (this.props.untilDuelCounter == 0) {
      this.P1.board.setAlpha(1);
      this.P2.board.setAlpha(1);

      this.P1.dice.setAlpha(0);
      this.P2.dice.setAlpha(0);

      this.P1.board.disableBoardDiceEvent();
      this.P2.board.disableBoardDiceEvent();

      this.P1.dice.lockDice();
      this.P2.dice.lockDice();
    }
  }
}
