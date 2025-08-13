import {
  DICE_MOD_SPRITE,
  DICE_SHIELD,
  DICE_SPRITE,
  DICE_SWORD,
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
    this.value = 0;
  }

  newValue(newValue) {
    if (newValue == null) console.log("no se mandó valor al insertar mod");
    const remap = { [DICE_SWORD]: 0, [DICE_SHIELD]: 1 };
    this.value = remap[newValue];
    this.setFrame(this.value);
  }

  enable() {
    this.setAlpha(1);
  }

  reset() {
    this.value = 0;
    this.sprite.setFrame(this.value);
  }
}
