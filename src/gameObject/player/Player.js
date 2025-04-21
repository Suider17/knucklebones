export default class Player {
  constructor(scene, id) {
    this.scene = scene;
    this.id = id;
    this.life = 100;
    this.turn = false;
    this.isValueAssigned = true;

    //other classes references
    this.board = null;
    this.dice = null; //rolling dice <-- also class Dice
  }
}
