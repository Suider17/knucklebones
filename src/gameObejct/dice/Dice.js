export default class Dice extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, atributes) {
    super(scene, x, y, texture);

    this.atributes = {
      value: 0,
      mod: "",
      status: "",
      position: [0, 0], //[row,column]
      blocked: false,
      scale: 1,
    };

    this.atributes = atributes;

    this.setFrame(this.atributes.value);
    this.setOrigin(0, 0);

    scene.add.existing(this).setScale(this.atributes.scale);
  }

  roll() {
    this.atributes.value = Phaser.Math.Between(1, 10);
    this.anims.isPlaying && this.anims.stop();
    this.setFrame(this.atributes.value);
    this.atributes.blocked = true;
    this.scene.validations.waitAsignation = true;
  }

  resetValue() {
    this.atributes.value = 0;
  }
  getValue() {
    return this.atributes.value;
  }
  setValue(value) {
    !this.atributes.blocked && (this.atributes.value = value);
    this.setFrame(this.atributes.value);
  }
  unlockDice() {
    this.atributes.blocked = false;
  }

  reScaleDice(scale) {
    this.scale(scale);
  }
  lockDice() {
    this.atributes.blocked = true;
  }
}
