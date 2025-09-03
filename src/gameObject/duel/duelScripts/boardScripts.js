import { TIMELINE_CONTROLTYPE, TIMELINE_NODETYPE } from "../duel.definition";
import { DICE_ANIMATIONS } from "../../dice/dice.definition";

export function boardShake(board, onYoyo = []) {
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
          onYoyo: onYoyo,
        },
      ],
    },
  ];
}
