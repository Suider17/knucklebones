import {
  ATACK_BUCKET_ARRAY,
  D11,
  DICE_BUCKET,
  DICE_EMPTY,
  DICE_MOD_SPRITE,
  DICE_SWORD,
  EMPTY_DICE_BUCKET,
  MOD_BUCKET_ARRAY,
  NORMAL_BUCKET_ARRAY,
  NORMAL_DICE_BUCKET,
  SPECIAL_BUCKET_ARRAY,
  SPECIAL_DICE_BUCKET,
} from "../../definitions/diceDefinitions";
import { DICE_MOD_RELATIVE_POSITION } from "../../definitions/Positions";
import DiceMod from "../diceMod/diceMod";
import DiceAnimator from "./animations/DiceAnimator";
import { customRandom } from "./dice.helper";

export default class Dice extends Phaser.GameObjects.Container {
  constructor(scene, x, y, texture, coordinates, board, lastInserted) {
    super(scene, x, y);

    this.value = 0; //value attached to frame
    this.mods = [null, null];
    this.status = "";
    this.bucket = DICE_BUCKET(this.value); //bucket to sort columns
    this.position = coordinates; //board cartesian coordinates
    this.blocked = false;
    this.lastInserted = lastInserted;
    this.sprite = scene.add.sprite(0, 0, texture);
    this.animator = new DiceAnimator(scene, this);

    this.board = board;
    Object.defineProperty(this, "player", {
      get() {
        return this.board?.player || null;
      },
    });
    //
  }

  init() {
    this.sprite.setFrame(this.props.value);
    this.add(this.sprite);

    this.scene.add.existing(this).setScale(this.props.scale);
    if (this.props.board == 2) {
      this.angle = 180;
    }

    // Esperar a que la textura esté lista antes de establecer el tamaño
    this.setSize(this.sprite.displayWidth, this.sprite.displayHeight);

    //==mods

    this.props.mods.forEach((mod) => {
      position = DICE_MOD_RELATIVE_POSITION[this.props.board];
      mod = new DiceMod(this.scene, position.x, position.y, DICE_MOD_SPRITE);
      mod.init();
      if (this.props.board == 2) {
        mod.angle = 180;
      }
    });

    this.add(mods);
  }

  roll(diceStyle = D11) {
    this.props.value = customRandom(diceStyle);
    this.props.bucket = DICE_BUCKET(this.props.value);
    this.sprite.anims.isPlaying && this.sprite.anims.stop();
    this.sprite.setFrame(this.props.value);
    //this.props.blocked = true;
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
      this.sprite.setFrame(this.props.value);
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
  reset() {
    this.unlockDice();
    this.resetValue();
    this.sprite.setFrame(0);
    this.lockDice();
  }

  setNewMod(value) {
    const mods = this.props.mods;
    if (!value) {
      throw new ReferenceError("Valor de dado para el MOD no definido");
    }

    if (this.hasEmptyModSlot()) {
      const emptySlotIndex = mods.findIndex(
        (mod) => DICE_BUCKET(mod.value) === EMPTY_DICE_BUCKET
      );

      this.props.lastInserted = true;
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

  hasEmptyModSlot() {
    return (
      this.props.bucket === NORMAL_DICE_BUCKET &&
      this.props.mods.some((mod) => mod.value === DICE_EMPTY)
    );
  }

  canAtack() {
    if (NORMAL_BUCKET_ARRAY.includes(this.props.value)) {
      return this.props.mods.some((mod) =>
        ATACK_BUCKET_ARRAY.includes(mod.value)
      );
    }
    return ATACK_BUCKET_ARRAY.includes(this.props.value);
  }

  //==========================
  //========ANIMATIONS========

  async shake({ onStart, onComplete, duration } = {}) {
    await this.animator.shake({ onStart, onComplete, duration });
  }

  async charge({ onStart, onComplete, onYoyo, offset } = {}) {
    await this.animator.charge({ onStart, onComplete, onYoyo, offset });
  }

  async destroy({ onStart, onComplete } = {}) {
    await this.animator.destroy({ onStart, onComplete });
  }

  async highlight({ onStart, onComplete } = {}) {
    await this.animator.highlight({ onStart, onComplete });
  }
  async unHighlight({ onStart, onComplete } = {}) {
    await this.animator.unHighlight({ onStart, onComplete });
  }
}
