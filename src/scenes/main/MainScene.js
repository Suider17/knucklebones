import Phaser from "phaser";
import {
  loadDiceSprites,
  loadDiceModsSprites,
  loadNumberTags,
} from "../../gameObject/dice/dice.assets";
import {
  createInfoTextPanel,
  setPlayersLifeText,
  setRoundText,
  setTurnText,
  setUntilDuelText,
} from "./mainScene.helper";
import DiceAnimator from "../../gameObject/dice/animations/DiceAnimator";
import Player from "../../gameObject/player/Player";
import { loadTossCoinSprites } from "./main.assets";
import { DuelResolver } from "../../gameObject/duel/DuelResolver";
import DebugButtons from "../../debug/UI/debugButton";
import { registerDebugStateLoaders } from "../../debug/boardStates";

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
    this.turnCounter = 0; //  Each time one player finish his turns, add 1
    this.roundCounter = 1; // Each time both players finish their turns, add 1
    this.gameOver = false; // Whether the game has ended
    this.minigamesCounter = 0; // Whether minigame finish add 1
    this.duelCounter = 0; // Whether start finish add 1
    this.isDuelPhase = false; // Whether it's duel phase
    this.isMinigamePhase = false; // Whether it's minigame phase
    this.untilDuelCounter = 3; // How many rounds until next duel
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

    this.debugButtons = [];
  }
  preload() {
    this.load.image("diceBox", "/assets/backgroudns/DiceBox.png");

    //call dice sprite
    this.sprites.diceFaces = loadDiceSprites(this);
    //call dice mods sprite
    this.sprites.diceMods = loadDiceModsSprites(this);
    //call dice for initial toss coin
    this.sprites.coin = loadTossCoinSprites(this);
    //
    this.sprites.numberTags = loadNumberTags(this);
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
    //inject
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

    // Register debug state loader methods on this scene instance BEFORE creating debug buttons
    registerDebugStateLoaders(this);

    // === DEBUG BUTTONS ===
    this.createDebugButtons();
  }

  createDebugButtons() {
    const buttonSpacing = 36;
    const buttonWidth = 110;
    const margin = 20;
    const totalHeight = buttonSpacing * 10;
    const cam = this.cameras.main;

    // Calculate starting Y so buttons are stacked from the bottom up
    const buttonYStart = cam.height - margin - totalHeight;
    const buttonX = cam.width - margin - buttonWidth;

    // Use DebugButtons manager
    this.debugButtonManager = new DebugButtons(this);

    // Example descriptions for each debug button
    const descriptions = [
      "knights_knights",
      "skull_skull",
      "Load custom board/player state 3",
      "Load custom board/player state 4",
      "Load custom board/player state 5",
      "Load custom board/player state 6",
      "Load custom board/player state 7",
      "Load custom board/player state 8",
      "Load custom board/player state 9",
      "Load custom board/player state 10",
    ];

    for (let i = 0; i < 10; i++) {
      const btn = this.debugButtonManager.addButton(
        `State ${i + 1}`,
        buttonX,
        buttonYStart + i * buttonSpacing,
        () => {
          const fn = this[`loadDebugState${i + 1}`];
          if (typeof fn === "function") fn();
          else
            console.warn(
              `Debug state loader loadDebugState${i + 1} is not a function`
            );
        },
        descriptions[i]
      );
      btn.setDepth(1000);
      this.debugButtons.push(btn);
    }
  }

  update() {
    if (this.turnCounter === 0) {
      this.players.forEach((_p) => {
        _p.disable();
      });

      this.duelResolver.playerEmitListener();
      this.P1.setAsFirstPlayer();
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
    setTurnText(this);
    setRoundText(this);
    setUntilDuelText(this);
    //actualiza vida de los jugadores
    setPlayersLifeText(this);

    if (this.untilDuelCounter === 0 && !this.isDuelPhase) {
      //=================
      //=================
    }
  }
}
