import Dice from "../dice/Dice.js";

export default class DiceBox extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    scene.add.existing(this);

    let board = {
      columnL: {
        values: [0, 0, 0],
      },
      ColumnC: {
        values: [0, 0, 0],
      },
      ColumnR: {
        values: [0, 0, 0],
      },
    };

    positions.forEach((position) => {
      let item = new Dice(scene, position[0], position[1]);
      this.add(item);
      this.item.push(item);
    });
  }
}
