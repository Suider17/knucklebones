import { DICE_ANIMATIONS, DICE_EMPTY } from "../../dice/dice.definition";
import { TIMELINE_CONTROLTYPE, TIMELINE_NODETYPE } from "../duel.definition";

export function skullVsSkullHighlight(animP1, animP2, delay1 = 0, delay2 = 0) {
  return [
    { at: delay1, tween: animP1.highlightConfig() },
    { at: delay2, tween: animP2.highlightConfig() },
  ];
}

export function skullVsLSkullRoll(
  animP1,
  animP2,
  delay = 500,
  roll,
  updateSprites
) {
  return [
    {
      at: delay,
      tween: animP1.shakeConfig(),
    },
    {
      at: delay,
      tween: animP2.shakeConfig(),
    },
    {
      from: 0,
      run: roll,
    },
    {
      from: 450,
      run: updateSprites,
    },
  ];
}

export function skullVsSkullTieCharge(
  animP1,
  animP2,
  substract,
  updateSprites,
  getResult,
  ctx = {},
  delay = 1000
) {
  return [
    {
      at: delay,
      tween: animP1.chargeInConfig(),
    },
    {
      at: delay,
      tween: animP2.chargeInConfig(),
    },
    {
      from: 170,
      tween: animP1.shakeConfig({
        duration: 20,
        x: "+=5",
        y: "+=5",
      }),
    },
    {
      from: 0,
      tween: animP2.shakeConfig({
        duration: 20,
        x: "+=5",
        y: "+=5",
      }),
    },
    {
      from: 10,
      run: () => {
        const result = getResult();

        ctx.store.duelResultValue = substract();
        result.winner.value = substract();
        result.loser.value = 0;

        ctx.store.winner = result.winner;
        ctx.store.loser = result.loser;
        ctx.store.value1 = result.winner.value;
        ctx.store.value2 = result.loser.value;

        updateSprites();
        animP1 = undefined;
      },
    },
    {
      from: 100,
      tween: animP1.chargeOutConfig(),
    },
    {
      from: 0,
      tween: animP2.chargeOutConfig(),
    },
  ];
}
export function skullVsSkullDuelDispose(winner, loser, ctx = {}) {
  return [
    {
      at: 300,
      tween: winner.unhighlightConfig(),
    },
    {
      at: 850,
      tween: loser.disposeConfig(),
    },
  ];
}

export function skullVsSkullDisposeOne(dice, ctx = {}, disposeNow = false) {
  return [
    {
      at: 0,
      tween: dice.animator.disposeConfig(),
    },
    {
      from: 450,
      run: () => {
        if (disposeNow) {
          dice.remove(ctx.store.columnIndex);
        }
      },
    },
  ];
}

export function skullVsSkullDisposeBoth(diceP1, diceP2, ctx) {
  return [
    {
      at: 0,
      tween: diceP1.disposeConfig(),
    },
    {
      from: 0,
      tween: diceP2.disposeConfig(),
    },
    {
      from: 410,
      run: () => {
        ctx.store.dice.forEach((_d) => {
          _d.remove(ctx.store.columnIndex);
        });
      },
    },
  ];
}

export function skullVsSkullChargeAgainstBoard(dice) {
  return [
    {
      from: 400,
      tween: dice.chargeInConfig(),
    },
  ];
}
export function skullVsLSkullChargeOut(dice, ctx) {
  return [
    {
      from: 100,
      tween: dice.chargeOutConfig(),
    },
    {
      from: 500,
      run: () => {
        ctx.store.loser.remove(ctx.store.columnIndex);
      },
    },
  ];
}
