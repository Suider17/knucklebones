import Phaser from "phaser";
import Board from "../../gameObject/board/Board";
import Dice from "../../gameObject/dice/Dice";
import {
  loadDiceSprites,
  loadDiceModsSprites,
} from "../../gameObject/dice/dice.assets";
import { setPlayerDiceEvents } from "../../gameObject/dice/dice.events";
import { boardEvents } from "../../gameObject/board/board.events";
import dice from "../../models/dice";
import {
  createInfoTextPanel,
  initDuel,
  setPlayersLifeText,
  setRoundText,
  setUntilDuelText,
  tossCoinForTurn,
} from "./mainScene.helper";
import DiceAnimator from "../../gameObject/dice/animations/DiceAnimator";
import Player from "../../gameObject/player/Player";
import MainSceneAnimator from "./animations/MainSceneAnimator";
import { loadTossCoinSprites } from "./main.assets";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });

    //====
    this.P1 = null;
    this.P2 = null;
    //===

    //Props
    this.round = 1; // Each time both players finish their turns, add 1
    this.turn = 0; //  Each time one player finish his turns, add 1
    this.gameOver = false; // Whether the game has ended
    this.isDuelPhase = false; // Whether it's duel phase
    this.untilDuelCounter = 2; // How many rounds until next duel
    //======

    //Assets
    this.sprites = { tossCoin: null, diceMods: null, diceFaces: null };
    this.text = {
      roundCounter: null,
      untilDuelCounter: null,
    };
    //=====

    //Inject
    this.animator = null;

    


  }
  preload() {
    this.load.image("diceBox", "/assets/backgroudns/DiceBox.png");

    //call dice sprite
    this.sprites.diceFaces = loadDiceSprites(this);
    //call dice mods sprite
    this.sprites.diceMods = loadDiceModsSprites(this);
    //call dice for initial toss coin
    loadTossCoinSprites(this);
  }
  create() {
    //======
    //Animations
    //Dice
    const diceAnimations = new DiceAnimator(this);
    diceAnimations.createDiceAnimation();

    //Inect MainAnimator
    this.animator = new MainSceneAnimator(this);
    this.animator.createTossCoinAnim();

    //==== Players ====//
    //==================

    this.P1 = new Player("p1");
    this.P2 = new Player("p2");
    this.players = [this.P1, this.P2];

    createInfoTextPanel(this);

    //==== Player 1 ====//
    //==================//
    this.P1.turn = true;
    this.P1.dice = new Dice(this, 300, 600, "diceFaces", dice(3, 3));
    setPlayerDiceEvents(this.P1);
    this.P1.board = new Board(this, 200, 200, 1);
    this.P1.board.init();
    boardEvents(this, this.P1.board, this.P1);
    this.P1.board.setPosition(500, 520); //<================== update board1 position

    this.P2.dice = new Dice(this, 1000, 200, "diceFaces", dice(4, 4));
    setPlayerDiceEvents(this.P2);
    this.P2.board = new Board(this, 200, 200, 2);
    this.P2.board.init();
    boardEvents(this, this.P2.board, this.P2);
    this.P2.board.setPosition(900, 400); //<================== update board1 position
    this.P2.board.angle = 180;

    //===============================

    this.message = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, "¡GO!", {
        fontSize: "80px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setAlpha(0); // Inicialmente oculto

    const restartButton = this.add
      .text(1000, 20, "🔄 Reiniciar", {
        fontSize: "24px",
        fill: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .setScrollFactor(0) // si estás usando cámara que se mueve
      .on("pointerdown", () => {
        window.location.reload();
      });
  }

  update() {
    if (this.turn === 0) {
      this.animator.tossCoinForTurnAnim();
    }

    //turno del jugador 1
    if (this.P1.turn && !this.isDuelPhase) {
      this.P2.board.setAlpha(0.5);
      this.P2.dice.setAlpha(0.5);

      this.P1.board.setAlpha(1);
      this.P1.dice.setAlpha(1);
      if (this.P1.isValueAssigned) {
      } else {
      }
    }
    //turno del jugador 2
    if (this.P2.turn && !this.isDuelPhase) {
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

    //actualiza vida de los jugadores
    setPlayersLifeText(this);

    if (this.untilDuelCounter === 0 && !this.isDuelPhase) {
      //=================
      initDuel(this);
      //=================

      // sortColumn(index + backwardCount);

      // Object.values(this.P1.board.columns).forEach(column, index=>{

      // })
      // this.P2.sortColumn(index);
    }
  }
}
