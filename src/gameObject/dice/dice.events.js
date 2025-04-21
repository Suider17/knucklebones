import {
  D11,
  D6,
  DICE_EMPTY,

  NORMAL_DICE_BUCKET,
} from "../../definitions/diceDefinitions";
export function setPlayerDiceEvents(player) {
  const dice = player.dice;
  dice.on("pointerover", () => {
    !dice.props.blocked && dice.sprite.play("diceFaces");
  });
  
  dice.on("pointerout", () => {
    if (!dice.props.blocked) {
      dice.sprite.stop("diceFaces");
      dice.sprite.setFrame(DICE_EMPTY);
    }
  });

  dice.on("pointerdown", async () => {
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
      await dice.shake({
        onComplete: () => {
          dice.roll(diceStyle);
        },
      });

      player.isValueAssigned = false;
      player.dice.props.blocked = true;
      player.board.enableBoardColumnEvent();
    }
  });
}
