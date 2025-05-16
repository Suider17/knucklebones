import { DICE_BUCKET, EMPTY_DICE_BUCKET } from "../definitions/diceDefinitions";
import mod from "./mod";

export default function dice(
  x,
  y,
  board = 0,
  scale = 1,
  value = 0,
  last = false
) {
  return {
    value: value, //value attached to frame
    mods: [mod(), mod()],
    status: "",
    bucket: DICE_BUCKET(value), //bucket to sort columns
    position: [x, y], //board cartesian coordinates
    blocked: false,
    scale: scale,
    board: board,
    lastInserted: last,
  };
}
