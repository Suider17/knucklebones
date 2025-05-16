export default class DiceAnimator {
  //escena del dado y su respectivo sprite
  constructor(scene, sprite) {
    this.scene = scene;
    this.dice = sprite;
  }

  //TWEENS
  //===============
  shake({ onStart, onComplete, duration = 70 }) {
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

  destroy({ onStart, onComplete }) {
    return new Promise((resolve) => {
      console.log(this.dice.scale);
      this.scene.tweens.add({
        targets: this.dice,
        scale: { from: this.dice.scale, to: 0 },
        duration: 600,
        ease: "Back.easeIn",
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

  highlight({ onStart, onComplete, offset = 0.15 }) {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.dice,
        scale: { from: this.dice.scale, to: this.dice.scale + offset },
        duration: 900,
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

  unHighlight({ onStart, onComplete, offset = 0.15 }) {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.dice,
        scale: { from: this.dice.scale, to: this.dice.scale - offset },
        duration: 900,
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

  charge({ onStart, onComplete, onYoyo, offset = -100 } = {}) {
    return new Promise((resolve) => {
      console.log("ejecutando funcion de embestida");
      this.scene.tweens.add({
        targets: this.dice,
        y: this.dice.y + offset,
        ease: "Back.easeInOut",
        yoyo: true,
        duration: 300,
        delay: 200,

        onStart: () => {
          if (onStart) onStart();
        },

        onYoyo: () => {
          if (onYoyo) onYoyo();
        },
        onComplete: () => {
          if (onComplete) onComplete();
          resolve();
        },
      });
    });
  }
  //===============

  //ANIMS
  //===============
  createDiceAnimation() {
    if (!this.scene.anims.exists("diceFaces")) {
      this.scene.anims.create({
        key: "diceFaces",
        frames: this.scene.anims.generateFrameNumbers("diceFaces", {
          start: 0,
          end: 5,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!this.scene.anims.exists("diceMods")) {
      this.scene.anims.create({
        key: "diceMods",
        frames: this.scene.anims.generateFrameNumbers("diceMods", {
          start: 0,
          end: 1,
        }),
        frameRate: 2,
        repeat: 1,
      });
    }
  }
}
