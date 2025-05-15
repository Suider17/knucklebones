import PlayerDice from "../playerDice/PlayerDice";
import {
  BOARDS_POSITIONS,
  PLAYER_DICE_HOLDER_POSITION,
  PLAYER_DICE_POSITION,
} from "../../definitions/positions";
import Board from "../board/Board";
import {
  PLAYER_END_TURN,
  PLAYER_DICE_ASSIGNED,
  PLAYER_DICE_ROLLED,
  SET_AS_FIRTS_PLAYER,
} from "../../definitions/emitNames";
import { DiceHolder } from "../diceHolder/DiceHolder";
import {
  DICE_HOLDER_ADD_DICE,
  DICE_HOLDER_CLICKED,
} from "../diceHolder/diceHolder.events";

export default class Player extends Phaser.Events.EventEmitter {
  constructor(scene, id) {
    super();
    this.scene = scene;
    this.id = id;
    this.life = 100;
    this.turn = false;
    this.isValueAssigned = true;
    this.diceWasRolledThisTurn = false;

    //other classes references
    this.board = null;
    this.dice = null; //rolling dice
    this.diceHolder = null;
  }

  init() {
    //se define primero board que playerDice porque playerDice tiene utilliza baord en una funcion
    //===========================
    //BOARD
    //==========================
    this.board = new Board(
      this.scene,
      BOARDS_POSITIONS[this.id].x,
      BOARDS_POSITIONS[this.id].y,
      this.id,
      this
    );
    this.board.init();
    this.board.disableEvents();
    this.boardEmitListener();

    //===========================
    //DICE
    //==========================
    this.dice = new PlayerDice(
      this.scene,
      PLAYER_DICE_POSITION[this.id].x,
      PLAYER_DICE_POSITION[this.id].y,
      this,
      this.id
    );
    this.dice.init();
    this.diceEmitListener();

    //===========================
    //diceHolder
    //==========================
    this.diceHolder = new DiceHolder(
      this.scene,
      PLAYER_DICE_HOLDER_POSITION[this.id].x,
      PLAYER_DICE_HOLDER_POSITION[this.id].y,
      this,
      this.id
    );
    this.diceHolder.init();
    this.diceHolder.setPointerEvents();
    this.diceHolderEmitListener();
  }

  diceEmitListener() {
    this.dice.on(PLAYER_DICE_ROLLED, (value, diceStyle) => {
      console.log("dado tirado para jugador");
      this.diceWasRolledThisTurn = true;
      this.isValueAssigned = false;

      //enable board after roll
      this.board.enableEvents();

      this.diceHolder.value !== 0
        ? this.diceHolder.disable()
        : this.diceHolder.enable();
    });
  }

  boardEmitListener() {
    this.board.on(PLAYER_DICE_ASSIGNED, () => {
      this.endTurn();
    });
  }

  diceHolderEmitListener() {
    this.diceHolder.on(DICE_HOLDER_CLICKED, () => {
      if (!this.isValueAssigned && this.dice.value !== 0) {
        this.diceHolder.addDice(this.dice.value, false);
      }
    });
    this.diceHolder.on(DICE_HOLDER_ADD_DICE, () => {
      this.diceHolder.disable();
      this.endTurn();
    });
  }

  setAsFirstPlayer() {
    this.emit(SET_AS_FIRTS_PLAYER, this);
  }

  disable() {
    this.dice.disable();
    this.board.disableEvents();
    this.diceHolder.disable();
  }

  startTurn() {
    this.turn = true;
    this.diceWasRolledThisTurn = false;
    this.isValueAssigned = false;

    //dice actions
    this.dice.enable();

    //diceHolder actions
    if (this.diceHolder.value !== 0) {
      this.diceHolder.disable();
    } else {
      this.diceHolder.enable();
    }

    this.emit(PLAYER_START_TURN, this);
  }

  endTurn() {
    this.turn = false;
    this.diceWasRolledThisTurn = false;
    this.isValueAssigned = true;

    //dice actions
    this.dice.reset();
    this.dice.disable();

    //diceHolder
    this.diceHolder.disable();

    this.emit(PLAYER_END_TURN, this);
  }
}
