export default class DuelResolverAnimator {
  constructor(scene) {
    this.scene = scene;

    this.coin = this.createCoinSprite();
    this.overlay = this.createOverlay();
  }

  createTossCoinAnim() {
    if (!this.scene.anims.exists("tossCoin")) {
      this.scene.anims.create({
        key: "tossCoin",
        frames: this.scene.anims.generateFrameNumbers("coin", {
          start: 0,
          end: 1,
        }),
        frameRate: 12,
        repeat: 4,
        ease: "Cubic.easeInOut",
      });
    }
  }

  createCoinSprite() {
    return this.scene.add
      .sprite(
        this.scene.cameras.main.centerX,
        this.scene.cameras.main.centerY - 100, // Ligeramente arriba del centro
        "coin"
      )
      .setDepth(10)
      .setOrigin(0.5)
      .setScale(0); // Inicia pequeña
  }

  createOverlay() {
    return this.scene.add
      .rectangle(
        this.scene.cameras.main.centerX,
        this.scene.cameras.main.centerY,
        this.scene.cameras.main.width * 1.5, // Cubre incluso si se gira
        this.scene.cameras.main.height * 1.5,
        0x000000
      )
      .setDepth(9)
      .setAlpha(0) // Inicia transparente
      .setInteractive();
  }

  showOverlay() {
    // Animación de fade-in del overlay
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.overlay,
        alpha: 1,
        duration: 100,
        ease: "Linear",
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  hideOverlay() {
    // Animación de fade-in del overlay
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.overlay,
        alpha: 0,
        duration: 200,
        ease: "Linear",
        onComplete: () => {
          resolve();
        },
      });
    });
  }
  hideCoin() {
    return new Promise((resolve) => {
      this.scene.tweens.chain({
        targets: this.coin,
        tweens: [
          {
            y: this.scene.cameras.main.centerY - 150, // Movimiento final al centro exacto
            delay: 400,
            duration: 500,
            ease: "Back.easeIn",
            onComplete: () => {
              resolve();
            },
          },
          {
            delay: 100,
            scale: 0,
            alpha: 0,
            duration: 600,
            ease: "Back.easeOut",
          },
        ],
      });
    });
  }
  showCoin() {
    return new Promise((resolve) => {
      this.scene.tweens.chain({
        targets: this.coin,
        tweens: [
          {
            scale: 1,
            alpha: 1,
            duration: 600,
            ease: "Back.easeOut",
          },
          {
            y: this.scene.cameras.main.centerY, // Movimiento final al centro exacto
            duration: 200,
            ease: "Sine.easeOut",
            onComplete: () => {
              resolve();
            },
          },
        ],
      });
    });
  }

  async tossCoinAnim(onComplete) {
    return new Promise(async (res) => {
      await this.showOverlay();
      await this.showCoin();

      await new Promise((resolve) => {
        this.coin.play("tossCoin", true);
        this.coin.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          resolve();
        });
      });

      // Esperar a que termine la animación de asentamiento
      await new Promise((resolve) => {
        this.scene.tweens.add({
          targets: this.coin,
          scale: { from: 1.1, to: 1 },
          duration: 200,
          ease: "Bounce.easeOut",
          onComplete: () => {
            onComplete();
            resolve();
          },
        });
      });

      await this.hideCoin();
      await this.hideOverlay();
      res();
    });
  }
}
