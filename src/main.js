import Phaser from "phaser";

class MainScene extends Phaser.Scene {
  preload() {
    this.load.setBaseURL("https://cdn.phaserfiles.com/v385");
  }
  create() {}
}

const config = {
  type: Pasher.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: function () {
      this.preload.iiage("logo", "../public/vite.svg");
    },
    create: function () {
      this.add.image(400, 300, "logo");
    },
  },
};

const game = new Phaser.Game(config);
