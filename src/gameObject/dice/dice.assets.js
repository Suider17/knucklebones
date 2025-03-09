export function loaDiceSprites(scene) {
  return scene.load.spritesheet(
    "diceFaces",
    "assets/spriteSheets/RollDice.png",
    {
      frameWidth: 128,
      frameHeight: 128,
    }
  );
}
export function loaDiceModsSprites(scene) {
  return scene.load.spritesheet(
    "diceMods",
    "assets/spriteSheets/diceMods.png",
    {
      frameWidth: 128,
      frameHeight: 128,
    }
  );
}
