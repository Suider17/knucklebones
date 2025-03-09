export function putDiceValueInColumn(scene, player, index) {
  const rollingDice = player.dice;
  const board = player.board;
  const diceOfRow = board.dice.filter(
    (dice) => dice.atributes.position[0] === index
  );
  let frontDice = null;

  frontDice = diceOfRow.reduce((min, obj) => {
    // Verifica que el objeto tenga value en 0 antes de compararlo
    if (
      obj.atributes.value === 0 &&
      [1, 2, 3, 4, 5, 6, 7, 9].includes(rollingDice.atributes.value)
    ) {
      return min === null ||
        obj.atributes.position[1] < min.atributes.position[1]
        ? obj
        : min;
    } else if (
      obj.atributes.mods.length < 2 &&
      [8, 9].includes(rollingDice.atributes.value)
    ) {
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
    if (frontDice.setValue(rollingDice.atributes.value)) {
      frontDice.roll(player, "d_6");
      frontDice.setValue(frontDice.atributes.value);
    }
    player.checkEmptyModSlot(player);
    frontDice.lockDice();

    board.setFrontLine(
      frontDice.atributes.position[0],
      frontDice.atributes.value
    );

    board.updateSingleTotal(
      frontDice.atributes.position[0],
      frontDice.atributes.value
    );
    board.disableBoardDiceEvent();
    player.isValueAssigned = true;
    rollingDice.resetDice();

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

  if (scene.props.untilDuelCounter == 0) {
    // Muestra el texto con animación
    scene.message.setAlpha(1).setScale(0); // Lo hacemos visible y tamaño inicial 0
    scene.tweens.add({
      targets: scene.message,
      scale: { from: 0, to: 2 },
      alpha: { from: 1, to: 0 },
      ease: "Sine.easeInOut",
      duration: 1200,
      onComplete: () => {
        scene.message.setAlpha(0).setScale(1); // Lo oculta y restablece su tamaño
      },
    });

    scene.P1.board.setAlpha(1);
    scene.P2.board.setAlpha(1);

    scene.P1.dice.setAlpha(0);
    scene.P2.dice.setAlpha(0);

    scene.P1.board.disableBoardDiceEvent();
    scene.P2.board.disableBoardDiceEvent();

    scene.P1.dice.lockDice();
    scene.P2.dice.lockDice();
  }
}
