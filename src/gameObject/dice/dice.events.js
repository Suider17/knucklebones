import { DICE_EMPTY } from "../../definitions/diceDefinitions";
export function setPlayerDiceEvents(player) {
  const dice = player.dice;
  dice.on("pointerover", () => {
    !dice.props.blocked && dice.diceSprite.play("diceFaces");
  });

  dice.on("pointerout", () => {
    if (!dice.props.blocked) {
      dice.diceSprite.stop("diceFaces");
      dice.diceSprite.setFrame(DICE_EMPTY);
    }
  });

  dice.on("pointerdown", () => {
    if (!dice.props.blocked) {
      dice.roll(player, !player.emptyModSlot ? "d_6" : "d_11");
      player.board.enableBoardColumnEvent();
    }
  });
}
