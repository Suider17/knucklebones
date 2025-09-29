import { DICE_ANIMATIONS, DICE_SWORD } from "../../dice/dice.definition";
import { TIMELINE_CONTROLTYPE, TIMELINE_NODETYPE } from "../duel.definition";

export function knightVsKnightHighlight(animP1, animP2, rollMod, delay = 0) {
  return [
    { at: delay, tween: animP1.highlightConfig() },
    { from: 0, tween: animP2.highlightConfig() },
    { from: 300, run: rollMod },
  ];
}

export function knightVsKnightFirstAtack(
  atacker,
  defender,
  rollMod,
  getResult,
  delay = 650
) {
  return [
    { at: delay, tween: atacker.animator.chargeInConfig({ delta: 120 }) },
    { from: 160, tween: defender.animator.pulseInConfig() },
    { from: 80, tween: defender.animator.pulseOutConfig() },
    {
      from: 50,
      run: rollMod,
    },
    {
      from: 100,
      run: getResult,
    },
    { from: 100, tween: atacker.animator.chargeOutConfig({ delta: 120 }) },
  ];
}

export function knightVsKnightFirstAtackss(atacker, defender) {
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
            fn: (ctx) => {},
          },
        ],
        onYoyo: [knightVsKnightFirstDefend(defender)],
      },
    ],
  };
}
// export function knightVsKnightFirstDefend(defender) {
//   return {
//     type: TIMELINE_NODETYPE.TWEEN,
//     label: "knight_kinight_first_defend",
//     actor: defender,
//     animation: DICE_ANIMATIONS.SHAKE,
//   };
// }
