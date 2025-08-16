import { D6, DICE_ARCHETYPE, DICE_SKULL } from "../../definitions/dice.definit";
import {
  PLAYER_END_TURN,
  SET_AS_FIRTS_PLAYER,
} from "../../definitions/emitNames";
import { DICE_HOLDER_SELECTED } from "../diceHolder/diceHolder.events";
import DuelResolverAnimator from "./animations/duelResolverAnimator";
import { DUEL_TYPE } from "./duel.definition";
import { DuelSession } from "./DuelSession";

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

    if (!playerEndingTurn.isFirstPlayer) {
      console.log(playerEndingTurn);
      this.prepareNewRound();
    }

    if (this.scene.untilDuelCounter === 0) {
      //desactivar eventos de jugadores.
      this.P1.disable();
      this.P2.disable();
      //habilitar alpha de los tableros
      this.P1.board.setAlpha(1);
      this.P2.board.setAlpha(1);
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

  initDuel() {
    //========= Variables de control de fase de duelo ===============
    this.scene.untilDuelCounter = 3;
    this.scene.isDuelPhase = true;

    this.P1.board.setAlpha(1);
    this.P2.board.setAlpha(1);

    this.P1.dice.setAlpha(0);
    this.P2.dice.setAlpha(0);

    this.P1.dice.lock();
    this.P2.dice.lock();

    //=====
    //Calculo de dados de daño
    //=====
    const existsAtackDice =
      this.P1.board.existsAtackDice() || this.P2.board.existsAtackDice();

    if (existsAtackDice) {
      this.duel();
    } else {
      console.log("No hay ataque");
    }
  }

  getDuelDice() {
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

      let duelType = "";

      if (p1CanAttack && p2CanAttack) {
        duelType = DUEL_TYPE.BOTH_ATTACK;
      } else if (p1CanAttack && !frontDiceP2) {
        duelType = DUEL_TYPE.P1_ATTACK_ALONE;
      } else if (p2CanAttack && !frontDiceP1) {
        duelType = DUEL_TYPE.P2_ATTACK_ALONE;
      } else if (p1CanAttack) {
        duelType = DUEL_TYPE.P1_ATTACK_P2_DEFEND;
      } else if (p2CanAttack) {
        duelType = DUEL_TYPE.P2_ATTACK_P1_DEFEND;
      }

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

  async duel() {
    const scene = this.scene;
    const duel = this.getDuelDice();
    if (duel) {
      const diceToDuel = duel.dice.filter(Boolean);
      await Promise.all(diceToDuel.map((_d) => _d.highlight()));

      const duelSession = new DuelSession();

      switch (duel.type) {
        case DUEL_TYPE.BOTH_ATTACK:
          //DOS SKULL
          if (dice.every((_d) => _d.value === DICE_SKULL)) {
            await this.twoSkullsDuel(dice, scene);
          }
          //DOS KNIGHT
          else if (dice.every((_d) => _d.archetype === DICE_ARCHETYPE.KNIGHT)) {
            console.log("duelo entre dos knights");
            await this.twoKnightDuel(dice);
          }

          //DOS BERSERKER
          //DOS SWORD

          break;
        case DUEL_TYPE.P1_ATTACK_ALONE:
          // p1 ataca sin defensa
          //validar si es skull <--- desde aqui nueva logica
          ///ataca directamente al tablero del otro

          break;
        case "p2AttackAlone":
          // p2 ataca sin defensa -- aqui tamvien nueva logica
          //ataca directamente al tablero del otro

          break;
        case "p1Attack":
          // p1 ataca y p2 defiende
          //aqui iria solo la logica de atacar al dado enemigo, bajarle la vida conlo que quede de la diferencia o destrirlo si el skull es mayor
          break;
        case "p2Attack":
          // p2 ataca y p1 defiende
          //aqui iria solo la logica de atacar al dado enemigo, bajarle la vida o destrirlo si el skull es mayor
          break;
      }

      await Promise.all(dice.map((_d) => _d.unHighlight()));
    }
  }
  async twoSkullsDuel(dice, scene) {
    return new Promise(async (resolve) => {
      const boards = { 1: scene.P1.board, 2: scene.P2.board };
      const [dice1, dice2] = dice;

      let winnerDice = null;
      let losserDice = null;

      // Animación inicial de shake + roll
      await Promise.all(
        dice.map((_d) => _d.shake({ onComplete: () => _d.roll(D6) }))
      );

      const value1 = dice1.value;
      const value2 = dice2.value;

      // Caso: empate
      if (value1 === value2) {
        await Promise.all([
          dice1.charge({
            offset: -70,
            onYoyo: async () => {
              const tweens = scene.tweens.getTweensOf(dice1);
              if (tweens.length > 0) {
                const currentTween = tweens[0];
                currentTween.pause();
                await dice1.shake({ duration: 15 });
                currentTween.resume();
              }
            },
          }),
          dice2.charge({
            offset: -70,
            onYoyo: async () => {
              const tweens = scene.tweens.getTweensOf(dice2);
              if (tweens.length > 0) {
                const currentTween = tweens[0];
                currentTween.pause();
                await dice2.shake({ duration: 15 });
                currentTween.resume();
              }
            },
          }),
        ]);

        // Destruir ambos
        await Promise.all([
          boards[dice1.board].destroyDice(dice1),
          boards[dice2.board].destroyDice(dice2),
        ]);

        return resolve();
      }

      // Caso: hay ganador y perdedor
      const dice1Wins = value1 > value2;
      winnerDice = dice1Wins ? dice1 : dice2;
      losserDice = dice1Wins ? dice2 : dice1;

      const diferenceDamage = Phaser.Math.Difference(
        winnerDice.value,
        losserDice.value
      );

      // Ganador carga contra perdedor
      await winnerDice.charge({
        onYoyo: async () => {
          winnerDice.setValue(diferenceDamage);
          await losserDice.shake();
        },
      });

      // El perdedor se destruye
      await boards[losserDice.board.id].destroyDice(losserDice);

      // Ganador ataca tablero enemigo
      await winnerDice.charge({
        onYoyo: async () => {
          scene["P" + losserDice.board.id].life -= winnerDice.value;
          await scene["P" + losserDice.board.id].board.shake();
        },
      });

      // El ganador se destruye
      await boards[winnerDice.board.id].destroyDice(winnerDice);

      resolve();
    });
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
