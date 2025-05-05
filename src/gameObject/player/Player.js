import PlayerDice from "../playerDice/PlayerDice";
import {
  BOARDS_POSITIONS,
  PLAYER_DICE_HOLDER_POSITION,
  PLAYER_DICE_POSITION,
} from "../../definitions/positions";
import Board from "../board/Board";
import {
  END_TURN,
  PLAYER_DICE_ASSIGNED,
  PLAYER_DICE_ROLLED,
  SET_AS_FIRTS_PLAYER,
} from "../../definitions/emitNames";
import { DiceHolder } from "../diceHolder/DiceHolder";

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

    this.diceHolder.setPointerEvents();
    
  }

  diceEmitListener() {
    this.dice.on(PLAYER_DICE_ROLLED, (value, diceStyle) => {
      console.log("dado tirado para jugador");
      this.diceWasRolledThisTurn = true;
      this.isValueAssigned = false;

      //enable board after roll
      this.board.enableEvents();
    });
  }

  boardEmitListener() {
    this.board.on(PLAYER_DICE_ASSIGNED, () => {
      this.diceWasRolledThisTurn = false;
      this.isValueAssigned = true;
      this.turn = false;

      //dice actions
      this.dice.reset();
      this.dice.disable();

      this.emit(END_TURN, this);
    });
  }

  setAsFirstPlayer() {
    this.emit(SET_AS_FIRTS_PLAYER, this);
  }

  disable() {
    this.dice.disable();
    this.board.disableEvents();
  }
}
