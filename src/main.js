import Phaser from "phaser";
import MainScene from "./scenes/main/MainScene";

const mainScene = new MainScene();

const config = {
  type: Phaser.CANVAS,
  width: 1400,
  height: 950,
  scene: mainScene,
  backgroundColor: "#262626",
  render: {
    antialias: false, // Desactivar antialiasing si no es necesario
    pixelArt: true, // Hacer que el juego use píxeles y no suavizados
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
