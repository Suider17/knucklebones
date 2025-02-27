export default class RollingDice extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, value) {
    super(scene, x, y, texture);

    this.atributes = {
      value: value,
      mod: "",
      status: "",
      position: [0, 0], //[row,column]
      blocked: false,
    };

    this.setFrame(this.atributes.value);
    this.setOrigin(0, 0);
    this.setInteractive();
    this.setMouseEvents();

    scene.add.existing(this);
  }

  roll() {
    this.atributes.value = Phaser.Math.Between(1, 10);
    this.anims.isPlaying && this.anims.stop();
    this.setFrame(this.atributes.value);
    this.atributes.blocked = true;
  }

  setMouseEvents() {
    this.on("pointerover", () => {
      !this.atributes.blocked && this.play("rollingDice");
    });

    this.on("pointerout", () => {
      if (!this.atributes.blocked) {
        this.stop("rollingDice");
        this.setFrame(0);
      }
    });

    this.on("pointerdown", () => {
      !this.atributes.blocked && this.roll();
    });
  }

  resetValue() {
    this.atributes.value = 0;
  }

  getValue() {
    return this.atributes.value;
  }

  unlockDice() {
    this.atributes.blocked = false;
  }
}
