import { D6, DICE_ARCHETYPE } from "../dice/dice.definition";

import { PLAYER_TURN_END, PLAYER_FIRST } from "../player/player.events";

import DuelResolverAnimator from "./animations/duelResolverAnimator";
import { runTimeline } from "./animations/timeLineRunner";
import { DUEL_STRATEGY } from "./duel.definition";

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

  playerEmitListener() {
    this.players.forEach((player) => {
      player.on(PLAYER_TURN_END, (_p) => {
        this.changeTurn(_p);
      });

      player.on(PLAYER_FIRST, (_p) => {
        this.startPlayerTurn(_p);
      });
    });
  }

  changeTurn(playerEndingTurn) {
    const startTurnPlayer = this.players.find(
      (_p) => playerEndingTurn.id !== _p.id
    );
    this.currentPlayerId = startTurnPlayer.id;

    if (!playerEndingTurn.isFirstPlayer) {
      this.prepareNewRound();
    }

    if (this.scene.untilDuelCounter === 0) {
      this.initDuel();
    } else {
      this.startPlayerTurn(startTurnPlayer);
    }
  }

  prepareNewRound() {
    this.scene.roundCounter += 1;
    this.scene.untilDuelCounter -= 1;
  }

  initDuel() {
    //========= Variables de control de fase de duelo ===============
    this.scene.untilDuelCounter = 3;
    this.scene.isDuelPhase = true;

    this.P1.disable();
    this.P2.disable();

    this.P1.board.setAlpha(1);
    this.P2.board.setAlpha(1);

    this.P1.dice.setAlpha(0);
    this.P2.dice.setAlpha(0);

    this.P1.dice.lock();
    this.P2.dice.lock();

    const existsAtackDice =
      this.P1.board.existsAtackDice() || this.P2.board.existsAtackDice();

    if (existsAtackDice) {
      this.duel();
    } else {
      console.log("No hay ataque");
      //funcion para iniciar el nuevo turno de la siguiente ronda
    }
  }

  getDuelConditions() {
    const scene = this.scene;
    for (let index = 0; index < 3; index++) {
      const columnP1 = scene.P1.board.columns[index];
      const backwardCount = 2 - index * 2;
      const columnP2 = scene.P2.board.columns[index + backwardCount];

      const frontDiceP1 =
        Array.isArray(columnP1) && columnP1.length > 0 ? columnP1[0] : null;
      const frontDiceP2 =
        Array.isArray(columnP2) && columnP2.length > 0 ? columnP2[0] : null;

      if (!frontDiceP1 && !frontDiceP2) continue;

      const p1CanAttack = frontDiceP1?.canAtack?.() ?? false;
      const p2CanAttack = frontDiceP2?.canAtack?.() ?? false;

      if (!p1CanAttack && !p2CanAttack) continue;

      let duelType = `${frontDiceP1?.archetype || DICE_ARCHETYPE.NONE}_${
        frontDiceP2?.archetype || DICE_ARCHETYPE.NONE
      }`;

      return {
        dice: [frontDiceP1, frontDiceP2],
        diceP1: frontDiceP1,
        diceP2: frontDiceP2,
        type: duelType,
        columnIndex: index,
      };
    }

    return null;
  }

  duel() {
    const duel = this.getDuelConditions();
    if (duel) {
      const duelStrategy = DUEL_STRATEGY[duel.type];
      duelStrategy(
        this.scene,
        duel.dice,
        duel.diceP1,
        duel.diceP2,
        duel.columnIndex
      );
      //console.log(animationTimeline.systems.tweens.tweens);
    }
  }
  // Dentro de la clase DuelResolver
  async twoKnightDuel(dice) {
    const scene = this.scene;
    const boards = { 1: this.P1.board, 2: this.P2.board };
    const [d1, d2] = dice;

    // Determinar atacante inicial por isFirstPlayer
    const attacker = d1.isFirstPlayer ? d1 : d2.isFirstPlayer ? d2 : d1;
    const defender = attacker === d1 ? d2 : d1;

    // -------- RONDA 1: atacante golpea, defensor defiende --------
    // Tiradas temporales (NO tocan .value del dado)
    const atk1 = Phaser.Math.Between(1, 6);
    const def1 = Phaser.Math.Between(1, 6);

    // Animación de intención de ataque/defensa (shake + charge)
    await attacker.shake({ duration: 120 });
    await defender.shake({ duration: 120 });

    if (atk1 > def1) {
      const dmg1 = atk1 - def1;
      defender.setValue(Math.max(0, defender.value - dmg1));
    }

    // -------- RONDA 2: contraataque del caballero defensor --------
    // El defensor ahora ataca; el primero (attacker) defiende
    const atk2 = Phaser.Math.Between(1, 6);
    const def2 = Phaser.Math.Between(1, 6);

    await defender.shake({ duration: 120 });
    await attacker.shake({ duration: 120 });

    if (atk2 > def2) {
      const dmg2 = atk2 - def2;
      attacker.setValue(Math.max(0, attacker.value - dmg2));
    }

    // -------- Resolución: destrucciones y daño a jugador --------
    const aDead = attacker.value <= 0;
    const dDead = defender.value <= 0;

    // Ambos mueren: se destruyen y no hay daño a jugador
    if (aDead && dDead) {
      await Promise.all([
        boards[attacker.board.id].destroyDice(attacker),
        boards[defender.board.id].destroyDice(defender),
      ]);
      return;
    }

    // Solo uno muere: el sobreviviente hace daño al jugador rival
    if (aDead || dDead) {
      const winner = aDead ? defender : attacker;
      const loser = aDead ? attacker : defender;

      // Destruir perdedor del tablero
      await boards[loser.board.id].destroyDice(loser);

      // Daño directo al jugador opuesto = vida restante del ganador
      const enemyPlayerKey = "P" + loser.board.id; // el perdedor indica el jugador que recibe daño
      scene[enemyPlayerKey].life -= winner.value;

      // Feedback visual: embestida del ganador + shake del tablero enemigo
      await winner.charge({
        onYoyo: async () => {
          await scene[enemyPlayerKey].board.shake?.();
        },
      });

      // Importante: el ganador **permanece en tablero** con su vida actual (no se destruye)
      return;
    }

    // Si ambos sobreviven: no hay daño a jugador, ambos quedan con su vida restante
    // (Opcional: algún pequeño efecto de “separación” o highlight)
    await Promise.all([attacker.unHighlight?.(), defender.unHighlight?.()]);
  }
}

// async function calculateDamages() {
//   //======= TIPOS DE ATAQUE ========
//   //==========AMBOS atacan=============
//   if (frontDiceP1?.canAtack() && frontDiceP2?.canAtack()) {
//     //=============
//     if (
//       frontDiceP1?.value === DICE_SKULL &&
//       frontDiceP2?.value === DICE_SKULL
//     ) {
//       await highlightBattleDice(frontDiceP1, frontDiceP2, scene);
//       const resultDice = await this.twoSkullsDuel(
//         frontDiceP1,
//         frontDiceP2,
//         scene
//       );

//       await clearBattleDiceHighlight(frontDiceP1, frontDiceP2, scene);

//       //realiza el daño el jugador correspondiente
//       if (resultDice) {
//         if (resultDice.board === 1) {
//           scene.P2.life -= resultDice.value;
//           scene.P1.board.columns[resultDice.position[0]].splice(
//             resultDice.position[1],
//             1
//           );
//         } else {
//           scene.P1.life -= resultDice.value;
//           scene.P2.board.columns[resultDice.position[0]].splice(
//             resultDice.position[1],
//             1
//           );
//         }
//         await destroyDiceAnimation(resultDice, scene);
//       }

//       board1.sortColumn(index);
//       board2.sortColumn(index + backwardCount);
//     }
//     //============
//     //el P1 es skull y el P2 no, pero ambos atacan
//     else if (
//       frontDiceP1?.value === DICE_SKULL &&
//       frontDiceP2?.value !== DICE_SKULL
//     ) {
//       await highlightBattleDice(frontDiceP1, frontDiceP2, scene);
//       console.log("el P1 es skull y el P2 no, pero ambos atacan");
//       await clearBattleDiceHighlight(frontDiceP1, frontDiceP2, scene);
//     }
//     //=============
//     //el P2 es skull y el P1 no, pero ambos atacan
//     else if (
//       frontDiceP1?.value !== DICE_SKULL &&
//       frontDiceP2?.value === DICE_SKULL
//     ) {
//       await highlightBattleDice(frontDiceP1, frontDiceP2, scene);
//       console.log("el P2 es skull y el P1 no, pero ambos atacan");
//       await clearBattleDiceHighlight(frontDiceP1, frontDiceP2, scene);
//     }
//     //=============
//     //Ninguno es skull, pero ambos atacan
//     else if (
//       frontDiceP1?.value !== DICE_SKULL &&
//       frontDiceP2?.value !== DICE_SKULL
//     ) {
//       await highlightBattleDice(frontDiceP1, frontDiceP2, scene);
//       console.log("Ninguno es skull, pero ambos atacan");
//       await clearBattleDiceHighlight(frontDiceP1, frontDiceP2, scene);
//     }
//   }

//   //si P1 ataca a P2
//   if (frontDiceP1?.canAtack() && (!frontDiceP2?.canAtack() || !frontDiceP2)) {
//     //===============
//     //el dado que ataca es skull
//     if (frontDiceP1?.value === DICE_SKULL) {
//       await highlightBattleDice(frontDiceP1, frontDiceP2, scene);

//       let resultDice = null;
//       if (!frontDiceP2) {
//         resultDice = await oneSkullAtackNoDefense(frontDiceP1, scene);
//       } else {
//         //si P1 ataca tiene que ser skull, por lo que el otro tiene que ser normal o con defensa
//         resultDice = await oneSkullAtackAndDefense(
//           frontDiceP1,
//           frontDiceP2,
//           scene
//         );
//       }

//       if (resultDice) {
//         scene.P2.life -= resultDice.value;
//         scene.P1.board.columns[resultDice.position[0]].splice(
//           resultDice.position[1],
//           1
//         );
//       }

//       await clearBattleDiceHighlight(frontDiceP1, frontDiceP2, scene);
//     }
//     //============
//     //el dado que ataca no es skull
//     else if (frontDiceP1?.value !== DICE_SKULL) {
//       await highlightBattleDice(frontDiceP1, frontDiceP2, scene);
//       console.log("el dado que ataca no es skull");
//       await clearBattleDiceHighlight(frontDiceP1, frontDiceP2, scene);
//     }
//   } //si P2 ataca a P1
//   if ((!frontDiceP1?.canAtack() || !frontDiceP1) && frontDiceP2?.canAtack()) {
//     //===============
//     //el dado que ataca es skull
//     if (frontDiceP2?.value === DICE_SKULL) {
//       await highlightBattleDice(frontDiceP1, frontDiceP2, scene);
//       console.log("el dado que ataca es skull 2 ");
//       await clearBattleDiceHighlight(frontDiceP1, frontDiceP2, scene);
//     }
//     //============
//     //el dado que ataca no es skull
//     else if (frontDiceP2?.value !== DICE_SKULL) {
//       await highlightBattleDice(frontDiceP1, frontDiceP2, scene);
//       console.log("el dado que ataca no es skull 2");
//       await clearBattleDiceHighlight(frontDiceP1, frontDiceP2, scene);
//     }
//   }

//   //solo uno es skull
//   frontDiceP1 = null;
//   frontDiceP2 = null;
// }
