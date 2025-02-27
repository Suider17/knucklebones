export function putDiceValueInColumn(scene, board, index) {
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
    frontDice.setValue(scene.diceValue);
    frontDice.lockDice();
    scene.entities.board_1.updateSingleTotal(
      frontDice.atributes.position[0],
      frontDice.atributes.value
    );
    board.disableBoardDiceEvent();
    scene.validations.waitAsignation = false;
    scene.entities.rollingDice.resetValue();
    scene.entities.rollingDice.setFrame(0);
    scene.entities.rollingDice.lockDice();
    scene.validations.waitAsignation_player1 = false;
    endPlayerOneTurn(scene);
  }
}

export function startPlayerOneTurn() {}
export function startPlayerTwoTurn() {}
export function endPlayerOneTurn(scene) {
  scene.validations.turn_player1 = false;
  scene.validations.turn_player2 = true;
}
export function endPlayerTwoTurn() {}
