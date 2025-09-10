import { DICE_ANIMATIONS, DICE_SWORD } from "../../dice/dice.definition";
import { TIMELINE_CONTROLTYPE, TIMELINE_NODETYPE } from "../duel.definition";

export function knightVsKnightHighlight(diceP1, diceP2) {
  return {
    type: TIMELINE_NODETYPE.PARALLEL,
    label: "knight_knight_highlight",
    steps: [
      {
        type: TIMELINE_NODETYPE.TWEEN,
        actor: diceP1,
        animation: DICE_ANIMATIONS.HIGHLIGHT,
      },
      {
        type: TIMELINE_NODETYPE.TWEEN,
        actor: diceP2,
        animation: DICE_ANIMATIONS.HIGHLIGHT,
      },
    ],
  };
}

export function knightVsKnightFirstAtack(atacker, defender) {
  return {
    type: TIMELINE_NODETYPE.SEQUENCE,
    label: "knight_kinight_first_atack",
    steps: [
      {
        type: TIMELINE_NODETYPE.TWEEN,
        actor: atacker,
        animation: DICE_ANIMATIONS.CHARGE,
        onStart: [
          {
            type: TIMELINE_NODETYPE.CONTROL,
            action: TIMELINE_CONTROLTYPE.PAUSE,
          },
          {
            type: TIMELINE_NODETYPE.CONTROL,
            action: TIMELINE_CONTROLTYPE.LOGIC,
            fn: (ctx) => {
              const mod = ctx.store.firstAtacker.mods.find((mod) => {
                return mod.value === DICE_SWORD;
              });
              mod.roll();
            },
          },
        ],
        onYoyo: [knightVsKnightFirstDefend(defender)],
      },
    ],
  };
}
export function knightVsKnightFirstDefend(defender) {
  return {
    type: TIMELINE_NODETYPE.TWEEN,
    label: "knight_kinight_first_defend",
    actor: defender,
    animation: DICE_ANIMATIONS.SHAKE,
  };
}
