import { D6, DICE_SHIELD, DICE_SWORD } from "../dice/dice.definition";
import { boardShake } from "./duelScripts/boardScripts";
import {
  knightVsKnightDefenderSecondAtack,
  knightVsKnightDefenderAtacks,
  knightVsKnightDefenderCounter,
  knightVsKnightFirstAtack,
  knightVsKnightHighlight,
  knightVsKnightSecondAtack,
  knightVsKnightUnhighlight,
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
  skullVsSkullUnhighlight,
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
      nodesB.push(
        ...skullVsSkullUnhighlight(TimelineCtx.store.winner.animator)
      );
    }

    const tl = scene.add.timeline(nodesB);

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

  const store = TimelineCtx.store;
  store.columnIndex = columnIndex;

  let atacker = dice[Math.floor(Math.random() * 2)];
  let defender = Object.values(dice).find((item) => item !== atacker) || null;

  //SET CONTEXT
  //-------------------

  store.atacker = atacker;
  store.atackerSwordMod = atacker.mods.find((mod) => {
    return mod.value === DICE_SWORD;
  });
  store.atackerShieldMod = atacker.mods.find((mod) => {
    return mod.value === DICE_SHIELD;
  });

  //-------------------

  store.defender = defender;
  store.defenderSwordMod = defender.mods.find((mod) => {
    return mod.value === DICE_SWORD;
  });
  store.defenderShieldMod = defender.mods.find((mod) => {
    return mod.value === DICE_SHIELD;
  });

  //===================== FUNCITONS

  diceP1.mods.forEach((_m) => {
    _m.roll(false);
  });

  diceP2.mods.forEach((_m) => {
    _m.roll(false);
  });

  store.atackerSwordMod.value = 5;
  store.defenderShieldMod.value = 4;

  store.defenderSwordMod.value = 5;
  store.atackerShieldMod.value = 4;
  //------------------- set first winner
  store.atackerWins =
    store.atackerSwordMod.value > store.defenderShieldMod.value;
  store.defenderWins =
    store.defenderSwordMod.value > store.atackerShieldMod.value;
  //----------------
  const substract = (value1, value2) => Phaser.Math.Difference(value1, value2);
  //Toma los mods y dados en duelo y hace los calculos y actualizaciones de sprites antes de hacerle daño al dado
  const modDuel = (modAtk, modDef, atacker, defender, isWinner) => {
    const result = substract(modAtk.value, modDef.value);

    if (isWinner) {
      defender.disposeMod(false, modDef);
      modAtk.value = result;
      modAtk.setFrame(result);
    } else {
      defender.disposeMod(false, modDef);
      atacker.disposeMod(false, modAtk);
    }
  };

  //=====================
  // Si había un timeline anterior, límpialo
  if (scene.duelTimeline) {
    scene.duelTimeline.destroy();
    scene.duelTimeline = null;
  }
  let finalDelay = 4400;
  const playPhaseA = () => {
    const nodesA = [];

    nodesA.push(
      ...knightVsKnightHighlight(diceP1.animator, diceP2.animator, TimelineCtx)
    );
    nodesA.push(
      ...knightVsKnightFirstAtack(atacker, defender, modDuel, TimelineCtx)
    );

    if (store.atackerWins) {
      nodesA.push(
        ...knightVsKnightSecondAtack(atacker, defender, substract, TimelineCtx)
      );

      nodesA.push(
        ...knightVsKnightDefenderAtacks(atacker, defender, modDuel, TimelineCtx)
      );

      if (store.defenderWins) {
        nodesA.push(
          ...knightVsKnightDefenderSecondAtack(
            atacker,
            defender,
            substract,
            TimelineCtx
          )
        );
        finalDelay = 5400;
      }
    }
    //else {
    //   console.log("counter");
    //   nodesA.push(
    //     ...knightVsKnightDefenderCounter(
    //       store.firstAtacker,
    //       store.firstDefender,
    //       TimelineCtx,
    //       substract
    //     )
    //   );
    // }
    nodesA.push(
      ...knightVsKnightUnhighlight(
        diceP1.animator,
        diceP2.animator,
        TimelineCtx,
        finalDelay
      )
    );
    const tl = scene.add.timeline(nodesA); // Time Timeline vacío
    //addNodesToTimeTimeline(tl, nodesA); // Le “inyectas” los eventos

    tl.once("complete", () => {
      // Al terminar A ⇒ comienza B
      //tl.destroy();
      //playPhaseB();
    });

    scene.duelTimeline = tl; // Guarda ref por si necesitas abortar
    tl.play();
  };

  //timeline.push(knightVsKnightFirstAtack(atacker, defender));

  playPhaseA();
}
export function duelBerserkerVsBerserker() {}
