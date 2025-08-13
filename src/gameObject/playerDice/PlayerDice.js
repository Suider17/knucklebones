import {
  ATACK_BUCKET_ARRAY,
  D11,
  D6,
  DICE_BUCKET,
  DICE_EMPTY,
  DICE_SPRITE,
  DICE_SWORD,
  MOD_BUCKET_ARRAY,
  NORMAL_BUCKET_ARRAY,
  NORMAL_DICE_BUCKET,
  SPECIAL_BUCKET_ARRAY,
  SPECIAL_DICE_BUCKET,
} from "../../definitions/diceDefinitions";
import { PLAYER_DICE_ROLLED } from "../../definitions/emitNames";
import { customRandom } from "../dice/dice.helper";
import { PlayerDiceAnimator } from "./animations/PlayerDiceAnimator";
import {
  PDICE_ANIM_ROLL_FINISH,
  PDICE_ANIM_ROLL_START,
  PDICE_ANIM_ROLLING,
  PDICE_ANIM_SHAKE,
  PDICE_ANIM_UNHIGHLIGHT,
  PDICE_DISABLED,
  PDICE_ENABLED,
  PDICE_LOCKED,
  PDICE_RESET,
  PDICE_ROLL_FINISH,
  PDICE_ROLL_START,
  PDICE_ROLLING,
} from "./playerDice.events";

export default class PlayerDice extends Phaser.GameObjects.Container {
  constructor(scene, x, y, player, id) {
    super(scene, x, y);

    //Props
    this.id = id;
    this.value = 0;
    this.blocked = false;

    this.scale = 1;
    this.sprite = scene.add.sprite(0, 0, DICE_SPRITE);

    //animator
    this.animator = new PlayerDiceAnimator(this.scene, this.sprite);

    //other classes references
    this.player = player;
  }

  init() {
    this.sprite.setFrame(this.value);
    this.add(this.sprite);

    this.scene.add.existing(this).setScale(this.scale);
    if (this.player.id === 2) {
      this.angle = 180;
    }

    this.setSize(this.sprite.displayWidth, this.sprite.displayHeight);

    this.setPointerEvents();
  }

  //=======EVENTS=============

  setPointerEvents() {
    this.on("pointerover", () => this.handlePointerOver());
    this.on("pointerout", () => this.handlePointerOut());
    this.on("pointerdown", () => this.handlePointerDown());
  }

  async handlePointerOver() {
    if (this.blocked) return;

    await this.highlight();
    this.emit(PDICE_ANIM_ROLL_START, this);
    this.sprite.play(DICE_SPRITE);
    this.emit(PDICE_ANIM_ROLLING, this);
  }

  async handlePointerOut() {
    if (this.blocked) return;

    await this.unHighlight();
    this.sprite.stop(DICE_SPRITE);
    this.sprite.setFrame(DICE_EMPTY);
    this.emit(PDICE_ANIM_ROLL_FINISH, this);
  }

  async handlePointerDown() {
    if (this.blocked) return;

    this.emit(PDICE_ROLL_START, this);
    //se desactivan las interacciones para que ningun otro evento interrumpa este
    this.disableInteractive();

    const player = this.player;
    let diceStyle = D6;
    diceStyle = player.board.getDiceWithEmptyModSlot() ? D11 : D6;

    await this.shake({
      onStart: () => {
        this.emit(PDICE_ANIM_SHAKE, this);
        this.emit(PDICE_ROLLING, this);
      },
      onComplete: () => {
        this.roll(diceStyle);
        this.emit(PDICE_ANIM_ROLL_FINISH, this);
      },
    });

    await new Promise((resolve) => {
      setTimeout(async () => {
        await this.unHighlight({
          onStart: () => {
            this.emit(PDICE_ANIM_UNHIGHLIGHT, this);
          },
        });

        resolve();
      }, 400);
    });
    await new Promise((resolve) => {
      setTimeout(async () => {
        this.lock();
        resolve();
      }, 200);
    });

    this.emit(PDICE_ROLL_FINISH, {
      value: this.value,
      style: diceStyle,
    });
  }

  //============================

  lock() {
    this.blocked = true;
    this.disableInteractive();
    this.emit(PDICE_LOCKED, this);
  }
  unlock() {
    this.blocked = false;
    this.setInteractive();
    this.emit(PDICE_UNLOCKED, this);
  }

  disable() {
    this.blocked = true;
    this.disableInteractive();
    this.setAlpha(0.3);
    this.emit(PDICE_DISABLED, this);
  }

  enable() {
    this.blocked = false;
    this.setInteractive();
    this.setAlpha(1);
    this.emit(PDICE_ENABLED, this);
  }
  reset() {
    this.value = 0;
    this.sprite.setFrame(0);
    this.emit(PDICE_RESET, this);
  }

  roll(diceStyle = D11, autoLock = false) {
    if (this.blocked) return;

    this.value = customRandom(diceStyle);
    this.sprite.anims.isPlaying && this.sprite.anims.stop();
    this.sprite.setFrame(this.value);

    if (autoLock) this.lock();
  }

  //=========ANIMS=======
  //========================
  async shake({ onStart, onComplete, duration } = {}) {
    await this.animator.shake({ onStart, onComplete, duration });
  }

  async highlight({ onStart, onComplete } = {}) {
    await this.animator.highlight({ onStart, onComplete });
  }
  async unHighlight({ onStart, onComplete } = {}) {
    await this.animator.unHighlight({ onStart, onComplete });
  }
}
