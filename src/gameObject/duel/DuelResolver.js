import { END_TURN, SET_AS_FIRTS_PLAYER } from "../../definitions/emitNames";
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
    player.turn = true;
    player.dice.enable();
  }
  endPlayerTurn(player) {
    console.log("Finaliza Turno: " + player.id);
    player.turn = false;
    player.dice.disable();
    player.diceHolder.disable();
  }

  playerEmitListener() {
    this.players.forEach((player) => {
      player.on(END_TURN, (_p) => {
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
    //debe terminar el turno antes de iniciar el duelo
    this.endPlayerTurn(playerEndingTurn);

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
  //   turno del jugador 1
  //   if (this.P1.turn && !this.isDuelPhase) {
  //     this.P1.dice.unlock();
  //     console.log("p1");
  //     this.P2.board.setAlpha(0.5);
  //     this.P2.dice.setAlpha(0.5);
  //     this.P1.board.setAlpha(1);
  //     this.P1.dice.setAlpha(1);
  //     if (this.P1.isValueAssigned) {
  //     } else {
  //     }
  //   }
  //   turno del jugador 2
  //   if (this.P2.turn && !this.isDuelPhase) {
  //     this.P2.dice.unlock();
  //     console.log("p2");
  //     this.P1.board.setAlpha(0.5);
  //     this.P1.dice.setAlpha(0.5);
  //     this.P2.board.setAlpha(1);
  //     this.P2.dice.setAlpha(1);
  //     if (this.P2.isValueAssigned) {
  //     } else {
  //     }
  //   }
}
