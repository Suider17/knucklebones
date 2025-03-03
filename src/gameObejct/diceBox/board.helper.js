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
    frontDice.setValue(scene.props.diceValue);
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
    changeTurn(player, scene);
  }
}

export function startPlayerOneTurn(scene) {}
export function startPlayerTwoTurn(scene) {
  scene.P2.turn = true;
}

export function endPlayerOneTurn(scene) {
  scene.P1.turn = false;
}
export function endPlayerTwoTurn(scene) {}
export function changeTurn(player, scene) {
  if (player.id == "p1") {
    endPlayerOneTurn(scene);
    startPlayerTwoTurn(scene);
  }
}
