import { DICE_ANIMATIONS, DICE_EMPTY } from "../../dice/dice.definition";
import { TIMELINE_CONTROLTYPE, TIMELINE_NODETYPE } from "../duel.definition";

export function skull_skull_highlight(diceP1, diceP2) {
  return {
    type: TIMELINE_NODETYPE.PARALLEL,
    label: "skull_skull_highlight",
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

export function skull_skull_roll(diceP1, diceP2) {
  return {
    type: TIMELINE_NODETYPE.PARALLEL,
    label: "skull_skull_roll",
    steps: [
      {
        type: TIMELINE_NODETYPE.TWEEN,
        actor: diceP1,
        animation: DICE_ANIMATIONS.SHAKE,
      },
      {
        type: TIMELINE_NODETYPE.TWEEN,
        actor: diceP2,
        animation: DICE_ANIMATIONS.SHAKE,
        onComplete: [
          {
            type: TIMELINE_NODETYPE.CONTROL,
            action: TIMELINE_CONTROLTYPE.LOGIC,
            fn: (ctx) => {
              ctx.store.dice.forEach((_d) => {
                _d.sprite.setFrame(_d.value);
              });
            },
          },
        ],
      },
    ],
  };
}

export function skullVsSkullTieCharge(
  diceP1,
  diceP2,
  onYoyoP1 = [],
  onYoyoP2 = []
) {
  return {
    type: TIMELINE_NODETYPE.PARALLEL,
    label: "skull_skull_tie_charge",
    steps: [
      {
        type: TIMELINE_NODETYPE.TWEEN,
        actor: diceP1,
        animation: DICE_ANIMATIONS.CHARGE,
        params: { offset: -70 },
        onYoyo: onYoyoP1,
      },
      {
        type: TIMELINE_NODETYPE.TWEEN,
        actor: diceP2,
        animation: DICE_ANIMATIONS.CHARGE,
        params: { offset: -70 },
        onYoyo: [
          {
            type: TIMELINE_NODETYPE.CONTROL,
            action: TIMELINE_CONTROLTYPE.PAUSE,
          },
          {
            type: TIMELINE_NODETYPE.TWEEN,
            actor: diceP2,
            animation: DICE_ANIMATIONS.SHAKE,
            params: { duration: 15 },
          },

          {
            type: TIMELINE_NODETYPE.CONTROL,
            action: TIMELINE_CONTROLTYPE.RESUME,
          },
        ],
      },
      {},
    ],
  };
}

export function skullVsSkullChargeOnYoyo(dice) {
  return [
    {
      type: TIMELINE_NODETYPE.CONTROL,
      action: TIMELINE_CONTROLTYPE.PAUSE,
    },
    {
      type: TIMELINE_NODETYPE.TWEEN,
      actor: dice,
      animation: DICE_ANIMATIONS.SHAKE,
      params: { duration: 15 },
    },
    {
      type: TIMELINE_NODETYPE.CONTROL,
      action: TIMELINE_CONTROLTYPE.RESUME,
    },
  ];
}

export function skull_skull_unhighlight(diceP1, diceP2) {
  return {
    type: TIMELINE_NODETYPE.PARALLEL,
    label: "skull_skull_tie_unhilight",
    steps: [
      {
        type: TIMELINE_NODETYPE.TWEEN,
        actor: diceP1,
        animation: DICE_ANIMATIONS.UNHIGHLIGHT,
      },
      {
        type: TIMELINE_NODETYPE.TWEEN,
        actor: diceP2,
        animation: DICE_ANIMATIONS.UNHIGHLIGHT,
      },
    ],
  };
}

export function skull_skull_dispose_both(diceP1, diceP2) {
  return {
    type: TIMELINE_NODETYPE.PARALLEL,
    label: "skull_skull_tie_dispose_both",
    steps: [
      {
        type: TIMELINE_NODETYPE.TWEEN,
        actor: diceP1,
        animation: DICE_ANIMATIONS.DISPOSE,
      },
      {
        type: TIMELINE_NODETYPE.TWEEN,
        actor: diceP2,
        animation: DICE_ANIMATIONS.DISPOSE,
      },
    ],
  };
}

export function skullVsSkullDuelResult(diceP1, diceP2) {
  return {
    type: TIMELINE_NODETYPE.PARALLEL,
    label: "skull_skull_tie_charge",
    steps: [
      {
        type: TIMELINE_NODETYPE.TWEEN,
        actor: diceP1,
        animation: DICE_ANIMATIONS.CHARGE,
        params: { offset: -70 },
        onYoyo: [
          {
            type: TIMELINE_NODETYPE.CONTROL,
            action: TIMELINE_CONTROLTYPE.PAUSE,
          },
          {
            type: TIMELINE_NODETYPE.TWEEN,
            actor: diceP1,
            animation: DICE_ANIMATIONS.SHAKE,
            params: { duration: 15 },
          },
          {
            type: TIMELINE_NODETYPE.CONTROL,
            action: TIMELINE_CONTROLTYPE.RESUME,
          },
        ],
      },
      {
        type: TIMELINE_NODETYPE.TWEEN,
        actor: diceP2,
        animation: DICE_ANIMATIONS.CHARGE,
        params: { offset: -70 },
        onYoyo: [
          {
            type: TIMELINE_NODETYPE.CONTROL,
            action: TIMELINE_CONTROLTYPE.PAUSE,
          },
          {
            type: TIMELINE_NODETYPE.TWEEN,
            actor: diceP2,
            animation: DICE_ANIMATIONS.SHAKE,
            params: { duration: 15 },
          },

          {
            type: TIMELINE_NODETYPE.CONTROL,
            action: TIMELINE_CONTROLTYPE.RESUME,
          },
        ],
      },
      {},
    ],
  };
}

export function skullVsSkullOnYoyoChargeWinner(winner, losser) {
  return [
    {
      type: TIMELINE_NODETYPE.CONTROL,
      action: TIMELINE_CONTROLTYPE.LOGIC,
      fn: (ctx) => {
        winner.value = ctx.store.duelResultValue;
        winner.sprite.setFrame(winner.value);

        losser.value = DICE_EMPTY;
        losser.sprite.setFrame(losser.value);
      },
    },
  ];
}

export function skull_skull_disposeOne(dice) {
  return {
    type: TIMELINE_NODETYPE.SEQUENCE,
    label: "skull_skull_tie_dispose_one",
    steps: [
      {
        type: TIMELINE_NODETYPE.TWEEN,
        actor: dice,
        animation: DICE_ANIMATIONS.DISPOSE,
      },
    ],
  };
}

export function skullVsSkullChargeAgainstBoard(dice, onYoyo = []) {
  return {
    type: TIMELINE_NODETYPE.PARALLEL,
    label: "skull_skull_charge",
    steps: [
      {
        type: TIMELINE_NODETYPE.TWEEN,
        actor: dice,
        animation: DICE_ANIMATIONS.CHARGE,
        params: { offset: -70 },
        onYoyo: onYoyo,
      },
    ],
  };
}
