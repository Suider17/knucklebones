import stringPaths from "./stringPaths";

export default class Dice extends Phaser.Physics.Arcade.Sprite {
  //atributos del dado

  constructor(scene, x, y) {
    super(scene, x, y, "dice");

    this.atributes = {
      value: 0,
      mod: null,
      status: null,
      position: [0, 0], //[row,column]
    };
  } 

  roll() {
    this.atributes = Phaser.Math.Between(1, 6);
  }
}
