import dice from "../../models/dice";
import { customRandom } from "./dice.helper";

export default class Dice extends Phaser.GameObjects.Container {
  constructor(scene, x, y, texture, atributes, board) {
    super(scene, x, y);

    this.atributes = dice(0, 0, board);
    this.mod1 = null;
    this.mod2 = null;
    this.diceSprite = scene.add.sprite(0, 0, texture);
    this.atributes = atributes;

    this.diceSprite.setFrame(this.atributes.value);
    this.add(this.diceSprite);

    scene.add.existing(this).setScale(this.atributes.scale);
    if (this.atributes.board == 2) thisDice.angle = 180;

    // Esperar a que la textura esté lista antes de establecer el tamaño
    this.setSize(this.diceSprite.displayWidth, this.diceSprite.displayHeight);

    //==mods
    this.mod1 = scene.add
      .sprite(-50, 100, "diceMods")
      .setScale(0.3)
      .setAlpha(0);

    this.mod2 = scene.add.sprite(60, 100, "diceMods").setScale(0.3).setAlpha(0);
    this.add([this.mod1, this.mod2]);
    //=======
  }

  roll(player, diceStyle = "d_10") {
    this.atributes.value = customRandom(diceStyle);
    this.diceSprite.anims.isPlaying && this.diceSprite.anims.stop();
    this.diceSprite.setFrame(this.atributes.value);
    this.atributes.blocked = true;
    player.isValueAssigned = false;
  }

  resetValue() {
    this.atributes.value = !this.atributes.blocked && 0;
  }
  getValue() {
    return this.atributes.value;
  }
  setValue(value) {
    if (!this.atributes.blocked) {
      if ([8, 9].includes(value)) {
        this.setDiceMod(value);
        return false;
      } else if (value < 8) {
        this.atributes.value = value;
        this.diceSprite.setFrame(this.atributes.value);
        return false;
      } else {
        return true;
      }
    }
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

  resetDice() {
    this.unlockDice();
    this.resetValue();
    this.diceSprite.setFrame(0);
    this.lockDice();
  }

  setDiceMod(value) {
    if (this.atributes.mods.length < 2) {
      this.atributes.mods.push(value);
      this.setModSprite();
      this.showModSprite();
    }
  }

  setModSprite() {
    this.mod1.setFrame(this.atributes.mods[0] == 8 ? 0 : 1);
    this.mod2.setFrame(this.atributes.mods[1] == 8 ? 0 : 1);
  }
  showModSprite() {
    this.atributes.mods[0] && this.mod1.setAlpha(1);
    this.atributes.mods[1] && this.mod2.setAlpha(1);
  }
}
