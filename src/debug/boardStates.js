import {
  DICE_5,
  DICE_SHIELD,
  DICE_SKULL,
  DICE_SWORD,
} from "../gameObject/dice/dice.definition";

// === DEBUG STATE LOADERS ===
export function loadDebugState1(scene) {
  const board1 = scene.P1.board;
  const board2 = scene.P2.board;
  //TWO KNIGHTS
  board1.addNewDiceInColumn(0, DICE_5, false);

  board1.columns["0"][0].insertMod(DICE_SHIELD);
  board1.columns["0"][0].insertMod(DICE_SWORD);

  board2.addNewDiceInColumn(2, DICE_5, false);
  board2.columns["2"][0].insertMod(DICE_SHIELD);
  board2.columns["2"][0].insertMod(DICE_SWORD);

  scene.untilDuelCounter = 0;
  scene.roundCounter = 2;
  scene.turnCounter = 2;

  scene.duelResolver.initDuel();
  console.log("Load Debug State 1");
}
export function loadDebugState2(scene) {
  const board1 = scene.P1.board;
  const board2 = scene.P2.board;
  //TWO KNIGHTS
  board1.addNewDiceInColumn(0, DICE_SKULL, false);

  board2.addNewDiceInColumn(2, DICE_SKULL, false);

  scene.untilDuelCounter = 0;
  scene.roundCounter = 2;
  scene.turnCounter = 2;

  scene.duelResolver.initDuel();
  console.log("Load Debug State 2");
}
export function loadDebugState3(scene) {
  // TODO: Implement custom board/player state for debug 3
  console.log("Load Debug State 3");
}
export function loadDebugState4(scene) {
  // TODO: Implement custom board/player state for debug 4
  console.log("Load Debug State 4");
}
export function loadDebugState5(scene) {
  // TODO: Implement custom board/player state for debug 5
  console.log("Load Debug State 5");
}
export function loadDebugState6(scene) {
  // TODO: Implement custom board/player state for debug 6
  console.log("Load Debug State 6");
}
export function loadDebugState7(scene) {
  // TODO: Implement custom board/player state for debug 7
  console.log("Load Debug State 7");
}
export function loadDebugState8(scene) {
  // TODO: Implement custom board/player state for debug 8
  console.log("Load Debug State 8");
}
export function loadDebugState9(scene) {
  // TODO: Implement custom board/player state for debug 9
  console.log("Load Debug State 9");
}
export function loadDebugState10(scene) {
  // TODO: Implement custom board/player state for debug 10
  console.log("Load Debug State 10");
}

// Register all debug state loaders to a scene instance (adds methods to the scene)
export function registerDebugStateLoaders(scene) {
  scene.loadDebugState1 = () => loadDebugState1(scene);
  scene.loadDebugState2 = () => loadDebugState2(scene);
  scene.loadDebugState3 = () => loadDebugState3(scene);
  scene.loadDebugState4 = () => loadDebugState4(scene);
  scene.loadDebugState5 = () => loadDebugState5(scene);
  scene.loadDebugState6 = () => loadDebugState6(scene);
  scene.loadDebugState7 = () => loadDebugState7(scene);
  scene.loadDebugState8 = () => loadDebugState8(scene);
  scene.loadDebugState9 = () => loadDebugState9(scene);
  scene.loadDebugState10 = () => loadDebugState10(scene);
}
