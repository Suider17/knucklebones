function loaDiceSprites(scene) {
  return scene.load.spritesheet(
    "diceFaces",
    "assets/spriteSheets/RollDice.png",
    {
      frameWidth: 128,
      frameHeight: 128,
    }
  );
}

export default loaDiceSprites;

// import stringPaths from "./stringPaths";

// export default class DiceAssetsManager {
//   static loadImages(scene) {
//     Object.entries(stringPaths).forEach(([key, path]) => {
//       scene.load.image(key, path);
//     });
//   }

//   static addImages(scene) {
//     Object.keys(stringPaths).forEach((key, index) => {
//       console.log(key);
//       scene.add.image(
//         index + Math.random() * 500,
//         index + Math.random() * 600,
//         key
//       );
//     });
//   }
// }

// const stringPaths = {
//   0: "assets/icons/dice_empty.png",
//   1: "assets/icons/dice_1.png",
//   2: "assets/icons/dice_2.png",
//   3: "assets/icons/dice_3.png",
//   4: "assets/icons/dice_4.png",
//   5: "assets/icons/dice_5.png",
//   6: "assets/icons/dice_6.png",
// };

// export default stringPaths;
