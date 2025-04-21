export default class BoardAnimator {
  //escena del dado y su respectivo sprite
  constructor(scene, sprite) {
    this.scene = scene;
    this.board = sprite;
  }

  //TWEENS
  shake({ onStart, onComplete }) {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.board,
        x: this.board.x + 15,
        y: this.board.y - 15,
        yoyo: true,
        repeat: 1,
        duration: 100,
        onStart: () => {
          if (onStart) onStart();
        },
        onComplete: () => {
          if (onComplete) onComplete();
          resolve();
        },
      });
    });
  }
}
