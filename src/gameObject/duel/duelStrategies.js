import { D6, DICE_ANIMATIONS } from "../dice/dice.definition";
import { TIMELINE_CONTROLTYPE, TIMELINE_STEPTYPE } from "./duel.definition";

export function duelSkullVsSkull(dice, diceP1, diceP2, columnIndex) {
  console.log("esto es skull_skull");
  const timeline = [];
  let winnerDice = null;
  let losserDice = null;

  dice.forEach((_d) => _d.roll(D6, false));
  timeline.push({
    type: TIMELINE_STEPTYPE.PARALLEL,
    label: "skull_skull_roll",
    steps: [
      {
        type: TIMELINE_STEPTYPE.TWEEN,
        actor: diceP1,
        animation: DICE_ANIMATIONS.SHAKE,
      },
      {
        type: TIMELINE_STEPTYPE.TWEEN,
        actor: diceP2,
        animation: DICE_ANIMATIONS.SHAKE,
      },
    ],
  });

  //TIE
  //if (diceP1.value === diceP2.value) {
  timeline.push({
    type: TIMELINE_STEPTYPE.PARALLEL,
    label: "skull_skull_tie_charge",
    steps: [
      {
        type: TIMELINE_STEPTYPE.TWEEN,
        actor: diceP1,
        animation: DICE_ANIMATIONS.CHARGE,
        params: { offset: -70 },
        onYoyo: [
          {
            type: TIMELINE_STEPTYPE.CONTROL,
            action: TIMELINE_CONTROLTYPE.PAUSE,
          },
          {
            type: TIMELINE_STEPTYPE.TWEEN,
            actor: diceP1,
            animation: DICE_ANIMATIONS.SHAKE,
            params: { duration: 15 },
          },
          {
            type: TIMELINE_STEPTYPE.CONTROL,
            action: TIMELINE_CONTROLTYPE.RESUME,
          },
        ],
      },
      {
        type: TIMELINE_STEPTYPE.TWEEN,
        actor: diceP2,
        animation: DICE_ANIMATIONS.CHARGE,
        params: { offset: -70 },
        onYoyo: [
          {
            type: TIMELINE_STEPTYPE.CONTROL,
            action: TIMELINE_CONTROLTYPE.PAUSE,
          },
          {
            type: TIMELINE_STEPTYPE.TWEEN,
            actor: diceP2,
            animation: DICE_ANIMATIONS.SHAKE,
            params: { duration: 15 },
          },
          {
            type: TIMELINE_STEPTYPE.CONTROL,
            action: TIMELINE_CONTROLTYPE.RESUME,
          },
        ],
      },
    ],
  });
  //}

  return timeline;

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
