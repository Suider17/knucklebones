export function setRollingDiceEvents(dice) {
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
    !dice.atributes.blocked && dice.roll();
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
