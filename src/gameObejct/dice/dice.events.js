export function setRollingDiceEvents(scene) {
  const dice = scene.entities.rollingDice;
  dice.on("pointerover", () => {
    !dice.atributes.blocked && dice.play("diceFaces");
  });

  dice.on("pointerout", () => {
    if (!dice.atributes.blocked) {
      dice.stop("diceFaces");
      dice.setFrame(0);
    }
  });

  dice.on("pointerdown", () => {
    if (!dice.atributes.blocked) {
      dice.roll();
      scene.validations.waitAsignation_player1 = true;
    }
  });
}

export function setMouseDownEvent(callback, dice, scene) {
  dice.on("pointerdown", () => {
    callback(dice, scene);
  });
}
export function setMouseOverEvent(callback, dice) {
  dice.on("pointerover", () => {
    callback(dice);
  });
}
export function setMouseOutEvent(callback, dice) {
  dice.on("pointerout", () => {
    callback(dice);
  });
}
