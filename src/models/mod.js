import { DICE_EMPTY } from "../definitions/diceDefinitions";

export default function mod(value = DICE_EMPTY, lastInserted = false) {
  return {
    value: value,
    lastInserted: lastInserted,
  };
}
