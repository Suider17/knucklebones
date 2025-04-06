import dice from "../../models/dice";
import { customRandom } from "./dice.helper";

export default class Dice extends Phaser.GameObjects.Container {
  constructor(scene, x, y, texture, props, board) {
    super(scene, x, y);

    this.props = dice(0, 0, board);
    this.mod1 = null;
    this.mod1_border = null;
    this.mod2 = null;
    this.mod2_border = null;
    this.diceSprite = scene.add.sprite(0, 0, texture);
    this.diceSprite_border = null;
    this.props = props;

    this.diceSprite.setFrame(this.props.value);
    this.add(this.diceSprite);

    scene.add.existing(this).setScale(this.props.scale);
    if (this.props.board == 2) thisDice.angle = 180;

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
    this.add(this.diceSprite_border);
    //=====   MOD1

    this.mod1_border = this.scene.add.graphics();
    this.mod1_border.lineStyle(4, 0xff0000); // Grosor y color del borde (rojo)
    this.mod1_border
      .strokeRect(
        -230, // Ajuste para centrar
        270,
        this.mod1.width,
        this.mod1.height
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
        this.mod2.width,
        this.mod2.height
      )
      .setAlpha(0)
      .setScale(0.3);
    this.add([this.mod1_border, this.mod2_border]);
  }

  roll(player, diceStyle = "d_11") {
    this.props.value = customRandom(diceStyle);
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
    if (!this.props.blocked) {
      if ([7, 8].includes(value)) {
        this.setDiceMod(value);
        return false;
      } else if (value <= 6 || value == 9) {
        this.props.value = value;
        this.diceSprite.setFrame(this.props.value);
        return false;
      } else {
        return true;
      }
    }
  }
  unlockDice() {
    this.props.blocked = false;
  }

  reScaleDice(scale) {
    this.scale(scale);
  }
  lockDice() {
    this.props.blocked = true;
  }

  resetDice() {
    this.unlockDice();
    this.resetValue();
    this.diceSprite.setFrame(0);
    this.lockDice();
  }

  setDiceMod(value) {
    if (this.props.mods.length < 2) {
      this.props.mods.push(value);
      this.setModSprite();
      this.showModSprite();
    }
  }

  setModSprite() {
    this.mod1.setFrame(this.props.mods[0] == 8 ? 0 : 1);
    this.mod2.setFrame(this.props.mods[1] == 8 ? 0 : 1);
  }
  showModSprite() {
    this.props.mods[0] && this.mod1.setAlpha(1);
    this.props.mods[1] && this.mod2.setAlpha(1);
  }

  showBorder(playerDiceValue) {
    const sprite = this.diceSprite;
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
}
