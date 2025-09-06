import { TIMELINE_CONTROLTYPE, TIMELINE_NODETYPE } from "../duel.definition";
import { DICE_ANIMATIONS } from "../../dice/dice.definition";

export function boardShake(board, onStart = []) {
  return [
    {
      type: TIMELINE_NODETYPE.PARALLEL,
      label: "board_shake",
      steps: [
        {
          type: TIMELINE_NODETYPE.TWEEN,
          actor: board,
          animation: DICE_ANIMATIONS.SHAKE,
          params: { offset: -70 },
          onStart: onStart,
        },
      ],
    },
  ];
}

export function boardDamageTaken(board) {
  return [
    {
      type: TIMELINE_NODETYPE.CONTROL,
      action: TIMELINE_CONTROLTYPE.LOGIC,
      fn: (ctx) => {
        board.hited(ctx.store.duelResultValue);
      },
    },
  ];
}
