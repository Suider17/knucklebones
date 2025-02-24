function createRollingDiceAnimacion(scene) {
  scene.anims.create({
    key: "rollingDice", // Nombre de la animación
    frames: scene.anims.generateFrameNumbers("rollingDice", {
      start: 0,
      end: 5,
    }),
    frameRate: 10,
    repeat: -1,
  });
}

export default createRollingDiceAnimacion;
