import { DICE_NUMBER_TAG } from "./dice.definition";

export function loadDiceSprites(scene) {
  return scene.load.spritesheet(
    "diceFaces",
    "assets/spriteSheets/diceFaces.png",
    {
      frameWidth: 128,
      frameHeight: 128,
    }
  );
}
export function loadDiceModsSprites(scene) {
  return scene.load.spritesheet(
    "diceMods",
    "assets/spriteSheets/diceMods.png",
    {
      frameWidth: 128,
      frameHeight: 128,
    }
  );
}

export function loadNumberTags(scene) {
  return scene.load.spritesheet(
    DICE_NUMBER_TAG,
    "assets/spriteSheets/diceNumberTags.png",
    {
      frameWidth: 128,
      frameHeight: 128,
    }
  );
}
