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

    this.add(this.background);
    this.add(this.border);

    // Esperar a que la textura esté lista antes de establecer el tamaño
    this.setSize(this.background.displayWidth, this.background.displayHeight);
  }

  addDice() {}

  getDice() {}

  enable() {
    this.setAlpha(1);
    this.setInteractive();
    this.background.setAlpha(0.6);
  }

  disable() {
    this.setAlpha(0.2);
    this.disableInteractive();
  }

  hoverIn() {
    console.log("hoverIn");
    this.border.setAlpha(1);
    this.hover = true;
  }

  hoverOut() {
    console.log("hoverOut");
    this.border.setAlpha(0);
    this.hover = false;
  }

  select() {
    console.log("selected");
    this.border.setAlpha(1);
    this.selected = true;
    this.off("pointerout");
    this.off("pointerover");
  }

  unselect() {
    console.log("UNselected");
    this.border.setAlpha(0);
    this.selected = false;
    this.setPointerOutEvent();
    this.setPointerInEvent();
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
  //EVENTS
  setPointerEvents() {
    this.setPointerInEvent();

    this.setPointerOutEvent();

    this.on("pointerdown", () => {
      if (this.hover && !this.selected) {
        this.select();
      } else if (this.hover && this.selected) {
        this.unselect();
      }
    });
  }
}
