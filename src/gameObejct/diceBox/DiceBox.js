import Dice from "../dice/Dice.js";
import createRollingDiceAnimacion from "../rollingDice/rollingDice.animator.js";

export default class DiceBox extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    //scene.add.existing(this);

    // positions.forEach((position) => {
    //   let item = new Dice(scene, position[0], position[1]);
    //   this.add(item);
    //   this.item.push(item);
    // });

    this.dice = new Dice(scene, 0, 0);
  }

  load(scene) {
    scene.load.image("diceBox", "/assets/backgroudns/DiceBox.png");
    this.dice.load(scene);
  }
  create(scene) {
    const diceBoxContainer = scene.add.container(640, 360);
    const diceBox = scene.add.image(0, 0, "diceBox");
    diceBoxContainer.add(diceBox);
  }

  createAnimations(scene) {
    createRollingDiceAnimacion(scene);
  }
}
