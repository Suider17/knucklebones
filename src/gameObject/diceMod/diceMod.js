export default class DiceMod extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    this.valuel;
    this.lastInserted;
    this.setAlpha(1);
    this.setScale(1);
  }

  newValue() {}

  reset() {}
}
