import {
  DICE_HOLDER_ADD_DICE,
  DICE_HOLDER_ADD_TEMPORARY_DICE,
  DICE_HOLDER_CLICKED,
  DICE_HOLDER_DISABLED,
  DICE_HOLDER_ENABLED,
  DICE_HOLDER_HOVER_IN,
  DICE_HOLDER_HOVER_OUT,
  DICE_HOLDER_REMOVE_TEMPORARY_DICE,
  DICE_HOLDER_SELECTED,
  DICE_HOLDER_UNSELECTED,
} from "./diceHolder.events";

export class DiceHolder extends Phaser.GameObjects.Container {
  constructor(scene, x, y, player) {
    super(scene, x, y);
    scene.add.existing(this).setScale(0.5);
    this.player = player;
    this.value = 0;
    this.locked = true;
    this.selected = false;
    this.hover = false;
    this.sprite = null;
    this.background = null;
    this.border = null;
    this.isTemporaryValue = false; //when holder is hover with playerDice not assgined value
  }

  init() {
    if (this.player.id == 2) {
      this.angle = 180;
    }

    this.background = this.scene.add
      .sprite(0, 0, "diceFaces")
      .setAlpha(0.6)
      .setScale(1.2);

    //borde de efecto hover
    this.border = this.scene.add.graphics().lineStyle(4, 0xffd700);
    this.border.setAlpha(0);
    this.border.strokeRoundedRect(
      -this.background.displayWidth / 2,
      -this.background.displayHeight / 2,
      this.background.displayWidth,
      this.background.displayHeight,
      30
    );

    this.sprite = this.scene.add
      .sprite(0, 0, "diceFaces")
      .setAlpha(0)
      .setScale(0.8);

    this.add(this.background);
    this.add(this.border);
    this.add(this.sprite);

    // Esperar a que la textura esté lista antes de establecer el tamaño
    this.setSize(this.background.displayWidth, this.background.displayHeight);
  }

  addDice(newValue, isTemporary = true) {
    this.value = newValue;
    this.sprite.setFrame(this.value);
    this.sprite.setAlpha(1);
    this.isTemporaryValue = isTemporary;

    //para cuando el addDice viene de player
    if (this.isTemporaryValue) {
      this.emit(DICE_HOLDER_ADD_TEMPORARY_DICE, this);
      return;
    }

    this.emit(DICE_HOLDER_ADD_DICE, this);
  }

  removeDice() {
    if (this.isTemporaryValue) {
      this.emit(DICE_HOLDER_REMOVE_TEMPORARY_DICE, this);
    }
    const value = this.value;
    this.reset();

    return value;
  }

  reset() {
    this.sprite.setAlpha(0);
    this.value = 0;
    this.sprite.setFrame(this.value);
    this.locked = true;
    this.selected = false;
    this.hover = false;
    this.isTemporaryValue = false;
  }

  enable() {
    this.setAlpha(1);
    this.setInteractive();
    this.background.setAlpha(0.6);
    this.locked = false;
    console.log("Enabled");
    this.emit(DICE_HOLDER_ENABLED, this);
  }

  disable() {
    this.setAlpha(0.2);
    this.disableInteractive();
    this.selected = false;
    this.hover = false;
    this.locked = true;
    this.border.setAlpha(0);
    console.log("Disabled");
    this.emit(DICE_HOLDER_DISABLED, this);
  }

  hoverIn() {
    console.log("hoverIn");
    this.border?.setAlpha(1);
    this.hover = true;

    this.emit(DICE_HOLDER_HOVER_IN, this);

    if (this.value === 0) {
      this.addDice(this.player.dice.value, true);
    }
  }

  hoverOut() {
    console.log("hoverOut");
    this.border?.setAlpha(0);
    this.hover = false;

    this.emit(DICE_HOLDER_HOVER_OUT, this);

    if (this.isTemporaryValue) {
      this.removeDice();
    }
  }

  select() {
    this.off("pointerout");
    this.off("pointerover");
    if (this.isTemporaryValue) {
      console.log("no se selecciona pero asigna valor");
      return;
    }
    console.log("selected");
    this.border.setAlpha(1);
    this.selected = true;

    this.emit(DICE_HOLDER_SELECTED, this.value);
  }

  unselect() {
    console.log("UNselected");
    this.border?.setAlpha(0);
    this.selected = false;
    this.setPointerOutEvent();
    this.setPointerInEvent();
    this.emit(DICE_HOLDER_UNSELECTED, this.value);
  }

  setPointerOutEvent() {
    this.on("pointerout", () => {
      this.hoverOut();
    });
  }

  setPointerInEvent() {
    this.on("pointerover", () => {
      this.hoverIn();
    });
  }

  setClickEvent() {
    this.once(DICE_HOLDER_CLICKED, () => {
      if (this.isTemporaryValue) {
        return;
      }
      if (this.value === 0) {
        if (this.selected) {
          this.unselect();
        }
      } else {
        if (!this.selected) {
          this.select();
          return;
        }
      }
    });
  }

  setAddDiceEvent() {
    this.once(DICE_HOLDER_ADD_DICE, () => {
      this.disable();
    });
  }

  //EVENTS
  setPointerEvents() {
    //HOVER IN
    this.setPointerInEvent();

    //HOVER OUT
    this.setPointerOutEvent();

    //CLICKED
    this.once("pointerdown", () => {
      this.emit(DICE_HOLDER_CLICKED, this.value);
    });

    this.setClickEvent();
    this.setAddDiceEvent();
  }
}
