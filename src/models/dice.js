import { EMPTY_DICE_BUCKET } from "../definitions/diceDefinitions";

export default function dice(row, column, board = 0) {
  return {
    value: 0,
    mods: [0, 0],
    status: "",
    bucket: EMPTY_DICE_BUCKET,
    position: [row, column], //[row,column]
    blocked: false,
    scale: 1,
    board: board,
  };
}