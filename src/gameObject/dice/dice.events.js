export function setPlayerDiceEvents(player) {
  const dice = player.dice;
  dice.on("pointerover", () => {
    !dice.atributes.blocked && dice.diceSprite.play("diceFaces");
  });

  dice.on("pointerout", () => {
    if (!dice.atributes.blocked) {
      dice.diceSprite.stop("diceFaces");
      dice.diceSprite.setFrame(0);
    }
  });

  dice.on("pointerdown", () => {
    if (!dice.atributes.blocked) {
      dice.roll(player, !player.emptyModSlot ? "d_6" : "d_10");
      player.board.enableBoardColumnEvent();
    }
  });
}
