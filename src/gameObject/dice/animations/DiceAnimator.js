export default class DiceAnimator {
  //escena del dado y su respectivo sprite
  constructor(scene, sprite) {
    this.scene = scene;
    this.dice = sprite;
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
      targets: this.dice,
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

  chargeInConfig({ duration = 150, delta = 70, onStart, onComplete } = {}) {
    return {
      targets: this.dice,
      y: `-=${delta}`,
      ease: "Back.easeInOut",

      duration,
      onStart,
      onComplete,
    };
  }

  chargeOutConfig({ duration = 150, delta = 70, onStart, onComplete } = {}) {
    return {
      targets: this.dice,
      y: `+=${delta}`,
      ease: "Back.easeInOut",

      duration,
      onStart,
      onComplete,
    };
  }

  chargeFullConfig({
    duration = 300,

    delta = -100,
    onStart,
    onYoyo,
    onComplete,
  } = {}) {
    return {
      targets: this.dice,
      y: this.dice.y + delta,
      ease: "Back.easeInOut",
      yoyo: true,

      duration,
      onStart,
      onYoyo,
      onComplete,
    };
  }

  disposeConfig({ duration = 400, onStart, onComplete } = {}) {
    return {
      targets: this.dice,
      scale: { from: this.dice.scale, to: 0 },
      ease: "Back.easeIn",
      duration,
      onStart,
      onComplete,
    };
  }

  pulseInConfig({ duration = 250, delta = 0.05, onStart, onComplete } = {}) {
    return {
      targets: this.dice,
      scale: { from: this.dice.scale, to: this.dice.scale + delta },
      ease: "Back.easeIn",
      duration,
      onStart,
      onComplete,
    };
  }

  highlightConfig({ delta = 0.15, duration = 500, onStart, onComplete } = {}) {
    return {
      targets: this.dice,
      scale: { from: this.dice.scale, to: this.dice.scale + delta },
      ease: "Back.easeOut",
      duration,
      onStart,
      onComplete,
    };
  }

  unhighlightConfig({
    delta = 0.15,
    duration = 500,
    onStart,
    onComplete,
  } = {}) {
    return {
      targets: this.dice,
      scale: { from: this.dice.scale, to: this.dice.scale - delta },
      ease: "Back.easeOut",
      duration,
      onStart,
      onComplete,
    };
  }
  //RUN TWEENS
  //===============

  runTween(opts = {}, tween = "tween") {
    return new Promise((resolve) => {
      const config = this[`${tween}Config`]({
        ...opts,
        onComplete: () => {
          opts.onComplete?.();
          resolve();
        },
      });
      this.scene.tweens.add(config);
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
