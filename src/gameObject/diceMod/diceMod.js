import {
  DICE_MOD_SPRITE,
  DICE_SPRITE,
} from "../../definitions/diceDefinitions";

export default class DiceMod extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.scene.add.existing(this);
    this.value;
    this.lastInserted;
  }

  init() {
    this.setAlpha(0);
    this.setScale(0.3);
  }

  newValue(newValue) {
    this.value = newValue;
    this.sprite.setFrame(this.value);
  }

  reset() {
    this.value = 0;
    this.sprite.setFrame(this.value);
  }
}
