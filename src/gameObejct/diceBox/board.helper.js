export function putDiceValueInColumn(scene, player, index) {
  const rollingDice = player.dice;
  const board = player.board;
  const diceOfRow = board.dice.filter(
    (dice) => dice.atributes.position[0] === index
  );

  const frontDice = diceOfRow.reduce((min, obj) => {
    // Verifica que el objeto tenga value en 0 antes de compararlo
    if (obj.atributes.value === 0) {
      return min === null ||
        obj.atributes.position[1] < min.atributes.position[1]
        ? obj
        : min;
    }
    return min; // Si no cumple la condición, mantiene el mínimo actual
  }, null);

  if (frontDice === null) {
    console.log("AQUI NO HAY ESPACIO MI CHAVO");
  } else {
    frontDice.unlockDice();
    frontDice.setValue(rollingDice.atributes.value);
    frontDice.lockDice();
    board.updateSingleTotal(
      frontDice.atributes.position[0],
      frontDice.atributes.value
    );
    board.disableBoardDiceEvent();
    player.isValueAssigned = true;
    rollingDice.unlockDice();
    rollingDice.resetValue();
    rollingDice.setFrame(0);
    rollingDice.lockDice();
    changeTurn(scene);
  }
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

  endPlayerTurn(endTurn_player);
  startPlayerTurn(startTurn_player);
}
