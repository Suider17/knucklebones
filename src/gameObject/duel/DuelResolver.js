import {
  PLAYER_END_TURN,
  SET_AS_FIRTS_PLAYER,
} from "../../definitions/emitNames";
import { DICE_HOLDER_SELECTED } from "../diceHolder/diceHolder.events";
import DuelResolverAnimator from "./animations/duelResolverAnimator";

export class DuelResolver extends Phaser.Events.EventEmitter {
  constructor(scene, players) {
    super();
    this.scene = scene;
    this.P1 = players[0];
    this.P2 = players[1];
    this.players = players;
    this.currentPlayerId = 0;

    //info variables
    this.duelCounter = 0; //each duel +1

    //animator
    this.animator = new DuelResolverAnimator(scene);
  }

  async tossCoin() {
    await this.animator.tossCoinAnim(() => {
      const turn = Math.floor(Math.random() * 2);
      this.animator.coin.setFrame(turn);
      this.currentPlayerId = this.players[turn].id;
      this.players[turn].setAsFirstPlayer();
    });
  }

  startPlayerTurn(player) {
    console.log("Inicia Turno: " + player.id);
    player.startTurn();
  }
  endPlayerTurn(player) {
    console.log("Finaliza Turno: " + player.id);
    player.endTurn();
  }

  playerEmitListener() {
    this.players.forEach((player) => {
      player.on(PLAYER_END_TURN, (_p) => {
        this.changeTurn(_p);
      });

      player.on(SET_AS_FIRTS_PLAYER, (_p) => {
        this.startPlayerTurn(_p);
      });
    });
  }


  changeTurn(playerEndingTurn) {
    const startTurnPlayer = this.players.find(
      (_p) => playerEndingTurn.id !== _p.id
    );
    this.currentPlayerId = startTurnPlayer.id;

    if (this.scene.turnCounter % 2 === 0) {
      this.prepareNewRound();
    }

    if (this.scene.untilDuelCounter === 0) {
      //desactivar eventos de jugadores.
      //habilitar alpha de los tableros
      //efectuar secuencia de ataques
      //realizar un duelResolverAnimator
      //ejecutar funcion de calculo de daños y nimaciones
    } else {
      //no debe iniciar el turno siguiente hasta que termine el duelo
      this.startPlayerTurn(startTurnPlayer);
    }
  }

  prepareNewRound() {
    this.scene.roundCounter += 1;
    this.scene.untilDuelCounter -= 1;
  }
}
