import {
  DICE_MOD_SPRITE,
  DICE_SHIELD,
  DICE_SPRITE,
  DICE_SWORD,
} from "../dice/dice.definition";

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
    this.lastInserted = false;
  }

  newValue(newValue) {
    if (newValue == null) {
      console.log("no se mandó valor al insertar mod");
      return;
    }
    const remap = { [DICE_SWORD]: 0, [DICE_SHIELD]: 1 };
    this.value = newValue;
    this.lastInserted = true;
    this.setFrame(remap[newValue]); //corregir numeracion para frames de spritesheet de mods porque no coinciden con los valores que le llegan del player dice
    //se podria hacer una nueva prop que sea el numero de frame y que eso esté separado de el value del

    //this.emit(MOD_ASSIGNED, this);
  }

  enable() {
    this.setAlpha(1);
  }
  disable() {
    this.setAlpha(0);
  }

  reset() {
    this.value = 0;
    this.setFrame(0);
  }
}
