import {
  BUCKET_HIERARCHY,
  DICE_BUCKET,
  DICE_EMPTY,
  DICE_SKULL,
} from "../../definitions/diceDefinitions";
export function putDiceValueInColumn(scene, player, index) {
  const rollingDice = player.dice; // Usamos el dado actual del jugador
  const board = player.board;

  // Calcula las combinaciones en la columna correspondiente
  board.calculateCombos(index);

  // Deshabilita el evento en la columna del tablero (esto dependerá de tu lógica de eventos)
  board.disableBoardColumnEvent();

  // Marca que se ha asignado un valor al dado
  player.isValueAssigned = true;

  // Reinicia el dado después de asignar su valor
  rollingDice.resetDice();

  // Cambia el turno al siguiente jugador
  changeTurn(scene);
}

export function startPlayerTurn(player) {
  console.log("Inicia Turno: " + player.id);
  player.turn = true;
  player.dice.setInteractive();
  player.dice.unlockDice();
}
export function endPlayerTurn(player) {
  console.log("Finaliza Turno: " + player.id);
  player.turn = false;
  player.dice.disableInteractive();
}
export function changeTurn(scene) {
  const endTurn_player = scene.P1.turn ? scene.P1 : scene.P2;
  const startTurn_player = scene.P1.turn ? scene.P2 : scene.P1;

  if (endTurn_player.id == "p2") {
    setNewRound(scene);
    setUntilDuelCounter(scene);
  }
  endPlayerTurn(endTurn_player);
  startPlayerTurn(startTurn_player);
}

export function setNewRound(scene) {
  scene.props.round += 1;
}
export function setUntilDuelCounter(scene) {
  scene.props.untilDuelCounter -= 1;
}

export function hasAtackMod(player) {
  return player.board.dice.some((_d) => _d.mods?.some((mod) => mod === 8));
}

export function hasSkullDice(player) {
  return player.board.dice.some((_d) => _d.props.value === DICE_SKULL);
}
