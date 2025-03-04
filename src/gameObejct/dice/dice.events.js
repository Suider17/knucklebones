export function setPlayerDiceEvents(player) {
  const dice = player.dice;
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
      dice.roll(player);
      player.isValueAssigned = false;
      player.board.enableBoardColumnEvent();
    }
  });
}
