import stringPaths from "./stringPaths";

export default class DiceAssetsManager {
  static loadImages(scene) {
    Object.entries(stringPaths).forEach(([key, path]) => {
      scene.load.image(key, path);
    });
  }

  static addImages(scene) {
    Object.keys(stringPaths).forEach((key, index) => {
      console.log(key);
      scene.add.image(
        index + Math.random() * 500,
        index + Math.random() * 600,
        key
      );
    });
  }
}
