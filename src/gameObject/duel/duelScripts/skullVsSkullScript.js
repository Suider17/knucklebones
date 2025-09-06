import { DICE_ANIMATIONS, DICE_EMPTY } from "../../dice/dice.definition";
import { TIMELINE_CONTROLTYPE, TIMELINE_NODETYPE } from "../duel.definition";

export function skullVsSkullHighlight(diceP1, diceP2) {
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

export function skullVsLSkullRoll(diceP1, diceP2) {
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

export function skullVsSkullUnhighlight(diceP1, diceP2) {
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

export function skullVsSkullDisposeBoth(diceP1, diceP2) {
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
        onComplete: [
          {
            type: TIMELINE_NODETYPE.CONTROL,
            action: TIMELINE_CONTROLTYPE.LOGIC,
            fn: (ctx) => {
              ctx.store.dice.forEach((_d) => {
                _d.remove(ctx.store.columnIndex);
              });
            },
          },
        ],
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

export function skullVsSkullDisposeOne(dice) {
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
