import { D6 } from "../dice/dice.definition";
import { boardDamageTaken, boardShake } from "./duelScripts/boardScripts";
import {
  knightVsKnightFirstAtack,
  knightVsKnightHighlight,
} from "./duelScripts/knightVsKnight";
import {
  skullVsSkullDisposeBoth,
  skullVsSkullDisposeOne,
  skullVsSkullHighlight,
  skullVsLSkullRoll,
  skullVsSkullUnhighlight,
  skullVsSkullChargeAgainstBoard,
  skullVsSkullChargeOnYoyo,
  skullVsSkullOnYoyoChargeWinner,
  skullVsSkullTieCharge,
} from "./duelScripts/skullVsSkullScript";

const TimelineCtx = {
  scene: null,
  store: {},
  bus: Phaser.Events.EventEmitter,
  currentTweenOwner: null,
  pauseToken: {},
};

export function duelSkullVsSkull(scene, dice, diceP1, diceP2, columnIndex) {
  console.log("esto es skull_skull");
  TimelineCtx.scene = scene;
  TimelineCtx.store.columnIndex = columnIndex;
  const timeline = [];

  timeline.push(skullVsSkullHighlight(diceP1, diceP2));

  dice.forEach((_d) => {
    _d.roll(D6, false);
  });
  TimelineCtx.store.dice = dice;

  timeline.push(skullVsLSkullRoll(diceP1, diceP2));

  //TIE
  if (diceP1.value === diceP2.value) {
    timeline.push(
      skullVsSkullTieCharge(
        diceP1,
        diceP2,
        skullVsSkullChargeOnYoyo(diceP1),
        skullVsSkullChargeOnYoyo(diceP2)
      )
    );
    timeline.push(skullVsSkullUnhighlight(diceP1, diceP2));
    timeline.push(skullVsSkullDisposeBoth(diceP1, diceP2));
  } else {
    // Caso: hay ganador y perdedor
    const dice1Wins = diceP1.value > diceP2.value;
    const winnerDice = dice1Wins ? diceP1 : diceP2;
    const losserDice = dice1Wins ? diceP2 : diceP1;

    TimelineCtx.store.duelResultValue = Phaser.Math.Difference(
      winnerDice.value,
      losserDice.value
    );

    timeline.push(
      skullVsSkullTieCharge(
        winnerDice,
        losserDice,
        skullVsSkullOnYoyoChargeWinner(winnerDice, losserDice)
      )
    );
    timeline.push(skullVsSkullDisposeOne(losserDice));

    timeline.push(
      skullVsSkullChargeAgainstBoard(
        winnerDice,
        boardShake(losserDice.board, boardDamageTaken(losserDice.board))
      )
    );

    timeline.push(skullVsSkullDisposeBoth(winnerDice, losserDice));
  }
  return { timeline: timeline, ctx: TimelineCtx };
}
export function duelKnightVsKnight(scene, dice, diceP1, diceP2, columnIndex) {
  console.log("esto es knight_knight");
  TimelineCtx.scene = scene;
  TimelineCtx.store.columnIndex = columnIndex;
  const timeline = [];

  timeline.push(knightVsKnightHighlight(diceP1, diceP2));

  const turn = Math.floor(Math.random() * 2);
  let atacker = dice[turn];
  let defender = Object.values(dice).find((item) => item !== atacker) || null;

  TimelineCtx.store.firstAtacker = atacker;
  TimelineCtx.store.firstDefender = defender;

  timeline.push(knightVsKnightFirstAtack(atacker, defender));

  return { timeline: timeline, ctx: TimelineCtx };
}
export function duelBerserkerVsBerserker() {}
