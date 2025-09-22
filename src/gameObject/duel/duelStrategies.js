import { D6 } from "../dice/dice.definition";
import { boardShake } from "./duelScripts/boardScripts";
import {
  knightVsKnightFirstAtack,
  knightVsKnightHighlight,
} from "./duelScripts/knightVsKnight";
import {
  skullVsSkullDisposeBoth,
  skullVsSkullDisposeOne,
  skullVsSkullHighlight,
  skullVsLSkullRoll,
  skullVsSkullDuelDispose,
  skullVsSkullChargeAgainstBoard,
  skullVsSkullTieCharge,
  skullVsLSkullChargeOut,
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

  // Si había un timeline anterior, límpialo
  if (scene.duelTimeline) {
    scene.duelTimeline.destroy();
    scene.duelTimeline = null;
  }

  // Helpers de lógica
  const roll = () => {
    dice.forEach((_d) => _d.roll(D6, false));
  };

  const updateSprites = () => {
    dice.forEach((_d) => _d.sprite.setFrame(_d.value));
  };

  const substract = () => Phaser.Math.Difference(diceP1.value, diceP2.value);

  const getResult = () => {
    const dice1Wins = diceP1.value > diceP2.value;
    const winnerDice = dice1Wins ? diceP1 : diceP2;
    const loserDice = dice1Wins ? diceP2 : diceP1;
    return { winner: winnerDice, loser: loserDice };
  };

  // ====== PHASE A
  function playPhaseA() {
    const nodesA = [];
    nodesA.push(...skullVsSkullHighlight(diceP1.animator, diceP2.animator));
    nodesA.push(
      ...skullVsLSkullRoll(
        diceP1.animator,
        diceP2.animator,
        500,
        roll,
        updateSprites
      )
    );
    nodesA.push(
      ...skullVsSkullTieCharge(
        diceP1.animator,
        diceP2.animator,
        substract,
        updateSprites,
        getResult,
        TimelineCtx
      )
    );

    const tl = scene.add.timeline(nodesA); // Time Timeline vacío
    //addNodesToTimeTimeline(tl, nodesA); // Le “inyectas” los eventos

    tl.once("complete", () => {
      // Al terminar A ⇒ comienza B
      //tl.destroy();
      playPhaseB();
    });

    scene.duelTimeline = tl; // Guarda ref por si necesitas abortar
    tl.play();
  }

  // ====== PHASE B
  function playPhaseB() {
    const nodesB = [];
    TimelineCtx.store.dice = dice;
    if (TimelineCtx.store.value1 === TimelineCtx.store.value2) {
      nodesB.push(
        ...skullVsSkullDisposeBoth(
          TimelineCtx.store.winner.animator,
          TimelineCtx.store.loser.animator,
          TimelineCtx
        )
      );
    } else {
      nodesB.push(
        ...skullVsSkullDisposeOne(TimelineCtx.store.loser, TimelineCtx)
      );
      nodesB.push(
        ...skullVsSkullChargeAgainstBoard(TimelineCtx.store.winner.animator)
      );
      nodesB.push(...boardShake(TimelineCtx.store.loser.board, TimelineCtx));
      nodesB.push(
        ...skullVsLSkullChargeOut(
          TimelineCtx.store.winner.animator,
          TimelineCtx
        )
      );
      nodesB.push(
        ...skullVsSkullDisposeOne(TimelineCtx.store.loser, TimelineCtx, true)
      );
    }

    const tl = scene.add.timeline(nodesB);

    console.log(nodesB);

    tl.once("complete", () => {
      //tl.destroy();
      //scene.duelTimeline = null;
    });
    scene.duelTimeline = tl;
    tl.play();
  }

  playPhaseA();
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
