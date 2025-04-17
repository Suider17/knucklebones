import {
  DICE_BUCKET,
  DICE_EMPTY,
  DICE_SWORD,
  MOD_BUCKET_ARRAY,
  NORMAL_BUCKET_ARRAY,
  NORMAL_DICE_BUCKET,
  SPECIAL_BUCKET_ARRAY,
  SPECIAL_DICE_BUCKET,
} from "../../definitions/diceDefinitions";
import dice from "../../models/dice";
import { customRandom } from "./dice.helper";

export default class Dice extends Phaser.GameObjects.Container {
  constructor(scene, x, y, texture, props, board) {
    super(scene, x, y);

    props ? (this.props = props) : (this.props = dice(0, 0, board));
    this.mod1Sprite = null;
    this.mod2Sprite = null;
    this.mod2_border = null;
    this.mod1_border = null;
    this.diceSprite = scene.add.sprite(0, 0, texture);
    this.diceSprite_border = null;

    this.diceSprite.setFrame(this.props.value);
    this.add(this.diceSprite);

    scene.add.existing(this).setScale(this.props.scale);
    if (this.props.board == 2) {
      this.angle = 180;
    }

    this.props.mods.forEach((mod) => {
      if (this.props.bucket === SPECIAL_DICE_BUCKET) mod.value = 99;
    });

    // Esperar a que la textura esté lista antes de establecer el tamaño
    this.setSize(this.diceSprite.displayWidth, this.diceSprite.displayHeight);

    //==mods
    this.mod1Sprite = scene.add
      .sprite(-50, 100, "diceMods")
      .setScale(0.3)
      .setAlpha(0);
    if (this.props.board == 2) {
      this.mod1Sprite.angle = 180;
      this.mod1Sprite.setPosition(-50, -100);
    }

    this.mod2Sprite = scene.add
      .sprite(60, 100, "diceMods")
      .setScale(0.3)
      .setAlpha(0);
    if (this.props.board == 2) {
      this.mod2Sprite.angle = 180;
      this.mod2Sprite.setPosition(60, -100);
    }
    this.add([this.mod1Sprite, this.mod2Sprite]);
    //=======
    //=======
    //BORDERS
    //=====   DICE
    this.diceSprite_border = this.scene.add.graphics();
    this.diceSprite_border.lineStyle(4, 0xff0000); // Grosor y color del borde (rojo)
    this.diceSprite_border
      .strokeRect(
        this.diceSprite.x - this.diceSprite.width / 2, // Ajuste para centrar
        this.diceSprite.y - this.diceSprite.height / 2,
        this.diceSprite.width,
        this.diceSprite.height
      )
      .setAlpha(0);

    this.mod1_border = this.scene.add.graphics();
    this.mod1_border.lineStyle(4, 0xff0000); // Grosor y color del borde (rojo)
    this.mod1_border
      .strokeRect(
        -230, // Ajuste para centrar
        270,
        this.mod1Sprite.width,
        this.mod1Sprite.height
      )
      .setAlpha(0)
      .setScale(0.3);

    //=====   MOD2

    this.mod2_border = this.scene.add.graphics();
    this.mod2_border.lineStyle(4, 0xff0000); // Grosor y color del borde (rojo)
    this.mod2_border
      .strokeRect(
        140, // Ajuste para centrar
        270,
        this.mod2Sprite.width,
        this.mod2Sprite.height
      )
      .setAlpha(0)
      .setScale(0.3);
    this.add([this.mod1_border, this.mod2_border]);
  }

  roll(player, diceStyle = "d_11") {
    this.props.value = customRandom(diceStyle);
    this.props.bucket = DICE_BUCKET(this.props.value);
    this.diceSprite.anims.isPlaying && this.diceSprite.anims.stop();
    this.diceSprite.setFrame(this.props.value);
    this.props.blocked = true;
    player.isValueAssigned = false;
  }

  resetValue() {
    this.props.value = !this.props.blocked && 0;
  }
  getValue() {
    return this.props.value;
  }
  setValue(value) {
    if (MOD_BUCKET_ARRAY.includes(value)) {
      this.setNewMod(value);
      return false;
    } else if (
      NORMAL_BUCKET_ARRAY.includes(value) ||
      SPECIAL_BUCKET_ARRAY.includes(value)
    ) {
      this.props.value = value;
      this.props.bucket = DICE_BUCKET(value);
      this.diceSprite.setFrame(this.props.value);

      return false;
    } else {
      return true;
    }
  }
  unlockDice() {
    this.props.blocked = false;
  }
  lockDice() {
    this.props.blocked = true;
  }

  updatePosition(x, y) {
    if (x !== undefined && y !== undefined) {
      this.props.position[0] = x;
      this.props.position[1] = y;
    }

    const positionX = 70 + this.props.position[0] * 130;
    const positionY = 70 + this.props.position[1] * 130;
    this.setPosition(positionX, positionY);
  }
  resetDice() {
    this.unlockDice();
    this.resetValue();
    this.diceSprite.setFrame(0);
    this.lockDice();
  }

  setNewMod(value) {
    let mods = this.props.mods;
    if (!value) {
      throw new ReferenceError("Valor de dado para el MOD no definido");
    }

    if (this.hasEmptyModSlot()) {
      const emptySlot = mods[mods.findIndex((mod) => mod.value === DICE_EMPTY)];
      emptySlot.value = value;
      emptySlot.lastInserted = true;
      this.props.lastInserted = true;
      this.showModSprite();
      this.setModSprite();
    } else {
      throw new Error("no hay espacios para mod");
    }
  }

  setModSprite() {
    this.mod1Sprite.setFrame(this.props.mods[0].value === DICE_SWORD ? 0 : 1);
    this.mod2Sprite.setFrame(this.props.mods[1].value === DICE_SWORD ? 0 : 1);
  }
  showModSprite() {
    this.props.mods[0].value !== DICE_EMPTY && this.mod1Sprite.setAlpha(1);
    this.props.mods[1].value !== DICE_EMPTY && this.mod2Sprite.setAlpha(1);
  }
  hideModSprite() {
    this.props.mods[0].value === DICE_EMPTY && this.mod1Sprite.setAlpha(0);
    this.props.mods[1].value === DICE_EMPTY && this.mod2Sprite.setAlpha(0);
  }

  refreshMods() {
    this.setModSprite();
    this.hideModSprite();
  }

  showBorder(playerDiceValue) {
    const slotSprite =
      this.props.mods.length === 0
        ? this.mod1_border
        : this.props.mods.length === 1
        ? this.mod2_border
        : null;
    if (playerDiceValue < 6 || [9, 10].includes(playerDiceValue)) {
      this.diceSprite_border.setAlpha(1);
    } else if ([7, 8].includes(playerDiceValue) && slotSprite) {
      slotSprite.setAlpha(1);
    }
  }
  hideBorder(playerDiceValue) {
    if (playerDiceValue < 6 || [9, 10].includes(playerDiceValue)) {
      this.diceSprite_border.setAlpha(0);
    } else if ([7, 8].includes(playerDiceValue)) {
      this.mod1_border.setAlpha(0);
      this.mod2_border.setAlpha(0);
    }
  }

  hasEmptyModSlot() {
    return (
      this.props.bucket === NORMAL_DICE_BUCKET &&
      this.props.mods.some((mod) => mod.value === DICE_EMPTY)
    );
  }
}
