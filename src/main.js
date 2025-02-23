import Phaser from "phaser";

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.load.image("background", "/assets/background.png");

    this.load.image("diceBox", "/assets/backgroudns/DiceBox.png");

    // Correct the path to the sprite sheet
    this.load.spritesheet("empty_Dice", "/assets/spriteSheets/RollDice.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

  create() {
    this.add.image(0, 0, "background").setOrigin(0, 0);

    // Ensure the animation is created in the preload method
    this.anims.create({
      key: "rollingDice",
      frames: this.anims.generateFrameNumbers("empty_Dice", {
        start: 0,
        end: 5,
      }),
      frameRate: 4,
      repeat: -1,
    });

    const diceBoxContainer = this.add.container(640, 480);
    const diceBox = this.add.image(0, 0, "diceBox");
    diceBoxContainer.add(diceBox);

    const dice = this.add.sprite(1100, 560, "empty_Dice").setOrigin(0, 0);
    dice.setInteractive();
    dice.on("pointerover", () => {
      console.log("en el dado");
      dice.play("rollingDice");
    });
    dice.on("pointerout", () => {
      dice.stop("rollingDice");
    });
  Ü  dice.on("pointerdown", () => {
      getDiceNumber();
    });

    let value = [0];
    const text1 = this.add.text(0, 0, `${value[0]}`, {
      font: "32px Arial",
      fill: "#ffffff",
    });
    diceBoxContainer.add(text1);

    diceBoxContainer.setSize(400, 400);
  }

  update() {}
}

const config = {
  type: Phaser.CANVAS,
  width: 1280,
  height: 720,
  scene: MainScene,
  render: {
    antialias: false,
    pixelArt: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);

const getDiceNumber = () => {
  return Math.floor(Math.random() * 6) + 1;
};
