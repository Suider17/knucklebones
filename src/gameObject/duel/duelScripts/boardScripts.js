import { TIMELINE_CONTROLTYPE, TIMELINE_NODETYPE } from "../duel.definition";
import { DICE_ANIMATIONS } from "../../dice/dice.definition";

export function boardShake(board, ctx) {
  return [
    {
      from: 100,
      tween: board.animator.shakeConfig(),
    },
    {
      from: 0,
      run: () => {
        board.hited(ctx.store.duelResultValue);
      },
    },
  ];
}
