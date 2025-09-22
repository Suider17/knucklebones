export default class BoardAnimator {
  //escena del dado y su respectivo sprite
  constructor(scene, sprite) {
    this.scene = scene;
    this.board = sprite;
  }

  //TWEENS CONFIGS
  //===============
  shakeConfig({
    duration = 60,
    x = "+=10",
    y = "-=10",
    repeat = 2,
    onStart,
    onYoyo,
    onComplete,
  } = {}) {
    return {
      targets: this.board,
      x: x,
      y: y,
      yoyo: true,
      repeat,
      duration,
      onStart,
      onYoyo,
      onComplete,
    };
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
