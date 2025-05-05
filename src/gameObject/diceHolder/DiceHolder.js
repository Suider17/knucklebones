export class DiceHolder extends Phaser.GameObjects.Container {
  constructor(scene, x, y, player) {
    super(scene, x, y);
    scene.add.existing(this).setScale(0.5);

    this.value = 0;
    this.locked = true;
    this.selected = false;
    this.hover = false;
    this.sprite = null;
    this.background = scene.add
      .sprite(0, 0, "diceFaces")
      .setAlpha(0.6)
      .setScale(1.2);

    this.border = scene.add.graphics().lineStyle(4, 0xffd700);
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

    if (player.id == 2) {
      this.angle = 180;
    }

    // Esperar a que la textura esté lista antes de establecer el tamaño
    this.setSize(this.background.displayWidth, this.background.displayHeight);
    this.setInteractive();
  }

  addDice() {}

  getDice() {}

  enable() {}

  disable() {}

  hoverIn() {
    this.border.setAlpha(1);
    this.hover = true;
  }

  hoverOut() {
    this.border.setAlpha(0);
    this.hover = false;
  }

  select() {
    this.border.setAlpha(1);
    this.selected = true;
    this.off("pointerout");
  }

  unselect() {
    this.border.setAlpha(0);
    this.selected = false;
    this.setPointerEvents();
  }

  //EVENTS
  setPointerEvents() {
    this.on("pointerover", () => {
      console.log("hola");
      this.hoverIn();
    });

    this.on("pointerout", () => {
      console.log("hola");
      this.hoverOut();
    });

    this.on("pointerdown", () => {
      if (this.hover && !this.selected) {
        this.select();
      } else if (this.hover && this.selected) {
        this.unselect();
      }
    });
  }
}
