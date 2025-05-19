import {
  BUCKET_HIERARCHY,
  DICE_BUCKET,
  DICE_EMPTY,
  DICE_SKULL,
} from "../../definitions/diceDefinitions";

export function setUntilDuelCounter(scene) {
  scene.untilDuelCounter -= 1;
}

export function hasAtackMod(player) {
  return player.board.dice.some((_d) => _d.mods?.some((mod) => mod === 8));
}

export function hasSkullDice(player) {
  return player.board.dice.some((_d) => _d.value === DICE_SKULL);
}
