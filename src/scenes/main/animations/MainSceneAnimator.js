export default class MainSceneAnimator {
  constructor(scene) {
    this.scene = scene;

    this.coin = this.createCoinSprite();
    this.overlay = this.createOverlay();
  }

  createTossCoinAnim() {
    if (!this.scene.anims.exists("tossCoin")) {
      this.scene.anims.create({
        key: "tossCoin",
        frames: this.scene.anims.generateFrameNumbers("tossCoin", {
          start: 0,
          end: 2,
        }),
        frameRate: 6,
        yoyo: true,
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
        "tossCoin"
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
        alpha: 0.5,
        duration: 100,
        ease: "Linear",
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  showCoin() {
    return new Promise((resolve) => {
      this.scene.tweens.chain({
        targets: this.coin,
        tweens: [
          {
            scale: 1.5,
            alpha: 1,
            duration: 400,
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

  async tossCoinForTurnAnim() {
    await this.showOverlay();
    await this.showCoin();

    // // Iniciar animación de giro y esperar a que termine
    // const result = await new Promise((resolve) => {
    //   // Reproducir animación de giro
    //   this.coin.play("tossCoin");

    //   // Configurar evento para cuando termine la animación
    //   this.coin.once("ANIMATION_COMPLETE", () => {
    //     const coinFace = Math.random() < 0.5 ? 0 : 1;
    //     this.coin.setFrame(coinFace);
    //     resolve(coinFace);
    //   });
    // });

    // Esperar a que termine la animación de asentamiento
    await new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.coin,
        scale: { from: 1.2, to: 1 },
        duration: 300,
        ease: "Bounce.easeOut",
        onComplete: () => resolve(),
      });
    });

    this.scene.turn = 1;
    //return result;
  }
}
