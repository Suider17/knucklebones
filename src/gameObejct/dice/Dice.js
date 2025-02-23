export class Dice extends Phaser.Physics.Arcade.Sprite {
  atributes = {
    value: 0,
  };

  constructor(scene, x, y) {
    super(scene, x, y, "dice");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setInteractive();
  }
}
