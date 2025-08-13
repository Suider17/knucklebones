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
import { DICE_MOD_RELATIVE_POSITION } from "../../definitions/positions";
import DiceMod from "../diceMod/DiceMod";
import DiceAnimator from "./animations/DiceAnimator";
import { customRandom } from "./dice.helper";

export default class Dice extends Phaser.GameObjects.Container {
  constructor(scene, x, y, texture, value, coordinates, board, lastInserted) {
    super(scene, x, y);

    this.value = value; //value attached to frame
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
    this.sprite.setFrame(this.value);
    this.setScale(0.7);
    this.add(this.sprite);

    this.scene.add.existing(this).setScale(this.scale);
    if (this.board == 2) {
      this.angle = 180;
    }

    // Esperar a que la textura esté lista antes de establecer el tamaño
    this.setSize(this.sprite.displayWidth, this.sprite.displayHeight);

    //==mods
    this.mods = this.mods.map((_, index) => {
      const position = DICE_MOD_RELATIVE_POSITION[index + 1];
      const mod = new DiceMod(
        this.scene,
        position.x,
        position.y,
        DICE_MOD_SPRITE
      );
      mod.init();
      if (this.board == 2) mod.angle = 180;
      this.add(mod);
      return mod;
    });
  }

  roll(diceStyle = D11) {
    this.value = customRandom(diceStyle);
    this.bucket = DICE_BUCKET(this.value);
    this.sprite.anims.isPlaying && this.sprite.anims.stop();
    this.sprite.setFrame(this.value);
    //this.blocked = true;
  }

  resetValue() {
    this.value = !this.blocked && 0;
  }
  getValue() {
    return this.value;
  }
  setValue(value) {
    if (MOD_BUCKET_ARRAY.includes(value)) {
      this.insertMod(value);
      return false;
    } else if (
      NORMAL_BUCKET_ARRAY.includes(value) ||
      SPECIAL_BUCKET_ARRAY.includes(value)
    ) {
      this.value = value;
      this.bucket = DICE_BUCKET(value);
      this.sprite.setFrame(this.value);
      return false;
    } else {
      return true;
    }
  }
  unlockDice() {
    this.blocked = false;
  }
  lockDice() {
    this.blocked = true;
  }

  remove() {
    this.destroy(true);
    this.emit("diceRemoved", this);
  }

  updatePosition(x, y) {
    if (x !== undefined && y !== undefined) {
      this.position[0] = x;
      this.position[1] = y;
    }

    const positionX = 70 + this.position[0] * 130;
    const positionY = 70 + this.position[1] * 130;
    this.setPosition(positionX, positionY);
  }
  reset() {
    this.unlockDice();
    this.resetValue();
    this.sprite.setFrame(0);
    this.lockDice();
  }

  insertMod(value) {
    const mods = this.mods;
    if (!value) {
      throw new ReferenceError("Valor de dado para el MOD no definido");
    }

    if (this.hasEmptyModSlot()) {
      const emptySlotIndex = mods.findIndex(
        (mod) => DICE_BUCKET(mod.value) === EMPTY_DICE_BUCKET
      );
      console.log(mods);
      this.mods[emptySlotIndex].newValue(value);
      this.mods[emptySlotIndex].enable();

      this.lastInserted = true;
    } else {
      throw new Error("no hay espacios para mod");
    }
  }

  disposeMod() {
    const mod = this.mods.find((mod) => mod.lastInserted);
    mod.reset();
    mod.disable();
    mod.lastInserted = false;
  }

  hasEmptyModSlot() {
    return (
      this.bucket === NORMAL_DICE_BUCKET &&
      this.mods.some((mod) => mod.value === DICE_EMPTY)
    );
  }

  canAtack() {
    if (NORMAL_BUCKET_ARRAY.includes(this.value)) {
      return this.mods.some((mod) => ATACK_BUCKET_ARRAY.includes(mod.value));
    }
    return ATACK_BUCKET_ARRAY.includes(this.value);
  }

  //==========================
  //========ANIMATIONS========

  async shake({ onStart, onComplete, duration } = {}) {
    await this.animator.shake({ onStart, onComplete, duration });
  }

  async charge({ onStart, onComplete, onYoyo, offset } = {}) {
    await this.animator.charge({ onStart, onComplete, onYoyo, offset });
  }

  async dispose({ onStart, onComplete } = {}) {
    await this.animator.destroy({ onStart, onComplete });
  }

  async highlight({ onStart, onComplete } = {}) {
    await this.animator.highlight({ onStart, onComplete });
  }
  async unHighlight({ onStart, onComplete } = {}) {
    await this.animator.unHighlight({ onStart, onComplete });
  }
}
