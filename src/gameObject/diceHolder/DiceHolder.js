export class DiceHolder extends Phaser.GameObjects.Container {
  constructor(scene, x, y, player) {
    super(scene, x, y);
    scene.add.existing(this).setScale(0.5);
    this.value = 0;
    this.locked = true;
    this.sprite = null;
    this.background = scene.add
      .sprite(x, y, "diceFaces")
      .setAlpha(0.6)
      .setScale(1.2);

    this.add(this.background);

    if (player.id == 2) {
      this.angle = 180;
    }
  }

  addDice() {}

  getDice() {}

  enable() {}

  disable() {}
}
