function createDiceAnimation(scene) {
  scene.anims.create({
    key: "diceFaces", // Nombre de la animación
    frames: scene.anims.generateFrameNumbers("diceFaces", {
      start: 0,
      end: 5,
    }),
    frameRate: 10,
    repeat: -1,
  });
}

export default createDiceAnimation;
