import { D6 } from "../dice/dice.definition";
import {
  skull_skull_dispose_both,
  skull_skull_highlight,
  skull_skull_roll,
  skull_skull_tie,
  skull_skull_unhighlight,
  skullVsSkullWinner,
} from "./duelScripts/skullVsSkull";

const TimelineCtx = {
  scene: null,
  store: {},
  bus: Phaser.Events.EventEmitter,
  currentTweenOwner: null,
  pauseToken: {},
};

export function duelSkullVsSkull(dice, diceP1, diceP2, columnIndex) {
  console.log("esto es skull_skull");
  const timeline = [];
  let winnerDice = null;
  let losserDice = null;

  timeline.push(skull_skull_highlight(diceP1, diceP2));

  dice.forEach((_d) => {
    _d.roll(D6, false);
  });

  TimelineCtx.store.dice = dice;

  timeline.push(skull_skull_roll(diceP1, diceP2));

  //TIE
  if (diceP1.value === diceP2.value) {
    timeline.push(skull_skull_tie(diceP1, diceP2));
    timeline.push(skull_skull_unhighlight(diceP1, diceP2));
    timeline.push(skull_skull_dispose_both(diceP1, diceP2));
  } else if (diceP1.value >= diceP2.value) {
    TimelineCtx.store.duelResultValue = diceP1.value - diceP2.value;

    timeline.push(skullVsSkullWinner(diceP1));
  } else if (diceP2.value >= diceP1.value) {
    timeline.push(skullVsSkullWinner(diceP1, diceP2));
  }

  return { timeline: timeline, ctx: TimelineCtx };

  return new Promise(async (resolve) => {
    const boards = { 1: scene.P1.board, 2: scene.P2.board };
    const [dice1, dice2] = dice;

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
export function duelKnightVsKnight(diceP1, diceP2, columnIndex) {
  console.log("esto es knight_knight");
}
export function berserker_berserker() {}
