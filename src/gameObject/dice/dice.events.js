import {
  D11,
  D6,
  DICE_BUCKET,
  DICE_EMPTY,
  EMPTY_BUCKET_ARRAY,
  EMPTY_DICE_BUCKET,
  NORMAL_DICE_BUCKET,
} from "../../definitions/diceDefinitions";
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
    let diceStyle = D6;
    for (const column of Object.values(player.board.columns)) {
      if (!column) continue;

      const find = column.some(
        (_d) => _d.props.bucket === NORMAL_DICE_BUCKET && _d.hasEmptyModSlot()
      );
      if (find) {
        diceStyle = D11;
        break;
      }
    }

    if (!dice.props.blocked) {
      dice.roll(player, diceStyle);
      player.board.enableBoardColumnEvent();
    }
  });
}
