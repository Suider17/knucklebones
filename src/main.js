import Phaser from "phaser";
import DiceBox from "./gameObejct/diceBox/diceBox";
class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
    //
  }
  preload() {
    //add gameObjets as properties of scene
    this.diceBox = new DiceBox(this, 0, 0);
    //call instaces of gameObjects
    this.load.image("background", "/assets/background.png");

    this.diceBox.load(this);

    //call dice sprite
    this.load.spritesheet("rollingDice", "assets/spriteSheets/RollDice.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
  }
  create() {
    this.add.image(0, 0, "background").setOrigin(0, 0);

    //create player1 board
    this.diceBox.create(this);
    this.diceBox.createAnimations(this);

    const dice = this.add.sprite(0, 0, "rollingDice");
    dice.setInteractive();
    dice.on("pointerover", () => {
      console.log("en el dado");
      dice.play("rollingDice");
    });

    //diceBoxContainer.add(dice);
    //diceBoxContainer.setSize(400, 400);
  }

  update() {}
}
const config = {
  type: Phaser.CANVAS,
  width: 1280,
  height: 720,
  scene: MainScene,
  render: {
    antialias: false, // Desactivar antialiasing si no es necesario
    pixelArt: true, // Hacer que el juego use píxeles y no suavizados
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
