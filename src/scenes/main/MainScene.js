import Phaser from "phaser";
import {
  loadDiceSprites,
  loadDiceModsSprites,
} from "../../gameObject/dice/dice.assets";
import {
  createInfoTextPanel,
  initDuel,
  setPlayersLifeText,
  setRoundText,
  setUntilDuelText,
} from "./mainScene.helper";
import DiceAnimator from "../../gameObject/dice/animations/DiceAnimator";
import Player from "../../gameObject/player/Player";
import { loadTossCoinSprites } from "./main.assets";
import { DuelResolver } from "../../gameObject/duel/DuelResolver";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });

    //Entities
    //====
    this.P1 = null;
    this.P2 = null;
    this.players = null;
    //===
    this.duelResolver = null;

    //game state control
    this.roundCounter = 1; // Each time both players finish their turns, add 1
    this.turnCounter = 0; //  Each time one player finish his turns, add 1
    this.gameOver = false; // Whether the game has ended
    this.minigamesCounter = 0; // Whether minigame finish add 1
    this.duelCounter = 0; // Whether start finish add 1
    this.isDuelPhase = false; // Whether it's duel phase
    this.isMinigamePhase = false; // Whether it's minigame phase
    this.untilDuelCounter = 2; // How many rounds until next duel
    //======

    //Assets
    this.sprites = { tossCoin: null, diceMods: null, diceFaces: null };
    this.text = {
      roundCounter: null,
      untilDuelCounter: null,
      turnCounter: null,
    };
    //=====

    //animator
    this.animator = null;

    //======DEBUG PROPS========
    this.debug = {
      tossCoinAnim: false,
    };
  }
  preload() {
    this.load.image("diceBox", "/assets/backgroudns/DiceBox.png");

    //call dice sprite
    this.sprites.diceFaces = loadDiceSprites(this);
    //call dice mods sprite
    this.sprites.diceMods = loadDiceModsSprites(this);
    //call dice for initial toss coin
    this.sprites.coin = loadTossCoinSprites(this);
  }
  create() {
    //======
    //Animations
    //Dice
    const diceAnimations = new DiceAnimator(this);
    diceAnimations.createDiceAnimation();

    //=================

    //==== Players ====//
    //=================//
    this.P1 = new Player(this, 1);
    this.P2 = new Player(this, 2);
    this.players = [this.P1, this.P2];

    this.players.forEach((player) => player.init());
    //===========
    //inject duelResolver
    this.duelResolver = new DuelResolver(this, this.players);
    this.duelResolver.animator.createTossCoinAnim();

    this.message = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, "¡GO!", {
        fontSize: "80px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setAlpha(0); // Inicialmente oculto

    createInfoTextPanel(this);
  }

  update() {
    if (this.turnCounter === 0) {
      this.players.forEach((_p) => {
        _p.disable();
      });

      this.duelResolver.playerEmitListener();
    }
    if (!this.debug.tossCoinAnim && this.turnCounter === 0) {
      //setting game
      //logica debug para saltar animacion principal
      this.players[0].turn = true;
      this.players[0].dice.enable();
      //this.players[0].diceHolder.enable();

      //end this if
      this.turnCounter = 1;
    } else if (this.turnCounter === 0 && this.debug.tossCoinAnim) {
      //end this if
      this.turnCounter = 1;
      this.duelResolver.tossCoin();
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
