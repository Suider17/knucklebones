import {
  ATACK_BUCKET_ARRAY,
  D11,
  DICE_ANIMATIONS,
  DICE_ARCHETYPE,
  DICE_BUCKET,
  DICE_EMPTY,
  DICE_MOD_SPRITE,
  DICE_SKULL,
  DICE_SWORD,
  EMPTY_DICE_BUCKET,
  GET_ARCHETYPE,
  MOD_BUCKET_ARRAY,
  NORMAL_BUCKET_ARRAY,
  NORMAL_DICE_BUCKET,
} from "./dice.definition";
import { DICE_MOD_RELATIVE_POSITION } from "../../definitions/positions";
import DiceMod from "../diceMod/DiceMod";
import DiceAnimator from "./animations/DiceAnimator";
import { DICE_NEW_ARCHETYPE, DICE_REMOVED } from "./dice.events";
import { customRandom } from "./dice.helper";

export default class Dice extends Phaser.GameObjects.Container {
  constructor(scene, x, y, texture, value, coordinates, board, lastInserted) {
    super(scene, x, y);

    this.value = value; //value attached to frame
    this.mods = [null, null];
    this.arquetype = DICE_ARCHETYPE.NONE;
    this.bucket = EMPTY_DICE_BUCKET;
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

    if (this.value === DICE_SKULL) {
      this.archetype = GET_ARCHETYPE([], this.value);
      this.bucket = DICE_BUCKET(this.archetype); //bucket to sort columns
    } else {
      this.bucket = DICE_BUCKET(this.value); //bucket to sort columns
    }

    this.scene.add.existing(this).setScale(this.scale);
    if (this.board.id == 2) {
      this.angle = 180;
    }

    // Esperar a que la textura esté lista antes de establecer el tamaño
    this.setSize(this.sprite.displayWidth, this.sprite.displayHeight);

    //==mods
    this.mods = this.mods.map((_, index) => {
      const position = DICE_MOD_RELATIVE_POSITION[index + 1];
      const yPosition = this.board.id === 2 ? -position.y : position.y;
      const mod = new DiceMod(
        this.scene,
        position.x,
        yPosition,
        DICE_MOD_SPRITE
      );
      mod.init();
      // if (this.board.id === 2) {
      //   mod.ang
      // }
      this.add(mod);

      return mod;
    });
  }

  setModEmitListener() {
    this.on;
  }

  roll(diceStyle = D11, updateFrame = true) {
    this.value = customRandom(diceStyle);
    this.bucket = DICE_BUCKET(this.value);
    this.archetype =
      this.value === DICE_SKULL
        ? GET_ARCHETYPE([], this.value)
        : DICE_ARCHETYPE.NONE;
    this.sprite.anims.isPlaying && this.sprite.anims.stop();

    if (updateFrame) {
      this.sprite.setFrame(this.value);
    }

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

  remove(column) {
    this.destroy(true);
    const columnIndex = this.board.id === 1 ? column : 2 - column * 2;
    const columnSelected = this.board.columns[columnIndex];
    const index = columnSelected.indexOf(this);

    if (index !== -1) {
      columnSelected.splice(index, 1);
    }
    this.emit(DICE_REMOVED, this);
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

      this.mods[emptySlotIndex].newValue(value);
      this.mods[emptySlotIndex].enable();

      this.lastInserted = true;
    } else {
      throw new Error("no hay espacios para mod");
    }

    const canGetArchetype =
      mods.findIndex((mod) => DICE_BUCKET(mod.value) === EMPTY_DICE_BUCKET) ===
      -1;
    if (canGetArchetype) {
      this.archetype = GET_ARCHETYPE(this.mods);
      this.bucket = DICE_BUCKET(this.archetype);
      //evento para cuando puede tener un nuevo arquetipo

      this.emit(DICE_NEW_ARCHETYPE, this);
    }
  }

  disposeMod(disposeLastInserted = true, modToDispose) {
    let mod;
    if (disposeLastInserted) {
      mod = this.mods.find((mod) => mod.lastInserted);
    } else {
      mod = this.mods.find((_m) => modToDispose === _m);
    }

    mod.reset();
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
    await this.animator.runTween(
      { onStart, onComplete, duration },
      DICE_ANIMATIONS.SHAKE
    );
  }

  async chargeFull({ onStart, onComplete, onYoyo, delta } = {}) {
    await this.animator.runTween(
      { onStart, onComplete, onYoyo, delta },
      DICE_ANIMATIONS.CHARGE_FULL
    );
  }

  async chargeIn({ onStart, onComplete, delta } = {}) {
    await this.animator.runTween(
      { onStart, onComplete, delta },
      DICE_ANIMATIONS.CHARGE_IN
    );
  }

  async chargeOut({ onStart, onComplete, onYoyo, delta } = {}) {
    await this.animator.runTween(
      { onStart, onComplete, onYoyo, delta },
      DICE_ANIMATIONS.CHARGE_OUT
    );
  }

  async dispose({ onStart, onComplete } = {}) {
    await this.animator.runTween(
      { onStart, onComplete },
      DICE_ANIMATIONS.DISPOSE
    );
  }

  async highlight({ onStart, onComplete } = {}) {
    await this.animator.runTween(
      { onStart, onComplete },
      DICE_ANIMATIONS.HIGHLIGHT
    );
  }
  async unhighlight({ onStart, onComplete } = {}) {
    await this.animator.runTween(
      { onStart, onComplete },
      DICE_ANIMATIONS.UNHIGHLIGHT
    );
  }
}
