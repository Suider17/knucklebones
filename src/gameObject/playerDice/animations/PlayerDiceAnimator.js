export class PlayerDiceAnimator {
  constructor(scene, sprite) {
    this.scene = scene;
    this.dice = sprite;
  }

  shake({ onStart, onComplete, duration = 50 }) {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.dice,
        x: this.dice.x + 15,
        y: this.dice.y - 15,
        yoyo: true,
        repeat: 2,
        duration: duration,
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

  highlight({ onStart, onComplete, offset = 0.1 }) {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.dice,
        scale: { from: this.dice.scale, to: this.dice.scale + offset },
        duration: 100,
        ease: "Back.easeOut",
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

  unHighlight({ onStart, onComplete, offset = 0.1 }) {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.dice,
        scale: { from: this.dice.scale, to: 1 },
        duration: 100,
        ease: "Back.easeOut",
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
