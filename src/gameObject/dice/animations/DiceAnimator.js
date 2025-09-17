export default class DiceAnimator {
  //escena del dado y su respectivo sprite
  constructor(scene, sprite) {
    this.scene = scene;
    this.dice = sprite;
  }

  //TWEENS CONFIGS
  //===============
  shakeConfig({
    duration = 70,
    x = this.dice.x + 15,
    y = this.dice.y - 15,
    repeat = 2,
    onStart,
    onYoyo,
    onComplete,
  } = {}) {
    return {
      targets: this.dice,
      x: this.dice.x + 15,
      y: this.dice.y - 15,
      yoyo: true,
      repeat,
      duration,
      onStart,
      onYoyo,
      onComplete,
    };
  }

  chargeConfig({
    duration = 300,
    delay = 200,
    offset = -100,
    onStart,
    onYoyo,
    onComplete,
  } = {}) {
    return {
      targets: this.dice,
      y: this.dice.y + offset,
      ease: "Back.easeInOut",
      yoyo: true,
      duration,
      offset,
      delay,
      duration,
      onStart,
      onYoyo,
      onComplete,
    };
  }

  disposeConfig({
    scale = { from: this.dice.scale, to: 0 },
    duration = 600,
    onStart,
    onComplete,
  } = {}) {
    return {
      targets: this.dice,
      scale,
      ease: "Back.easeIn",
      duration,
      onStart,
      onComplete,
    };
  }

  highlightConfig({ offset = 0.15, duration = 900, onStart, onComplete } = {}) {
    return {
      targets: this.dice,
      scale: { from: this.dice.scale, to: this.dice.scale + offset },
      ease: "Back.easeOut",
      duration,
      onStart,
      onComplete,
    };
  }

  unhighlightConfig({
    offset = 0.15,
    duration = 900,
    onStart,
    onComplete,
  } = {}) {
    return {
      targets: this.dice,
      scale: { from: this.dice.scale, to: this.dice.scale - offset },
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
