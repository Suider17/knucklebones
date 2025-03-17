export default function player(id = "p1") {
  return {
    id: id,
    dice: null,
    board: null,
    turn: false,
    isValueAssigned: true,
    isFirstMove: true,
    emptyModSlot: false,
    checkEmptyModSlot: (player) => {
      player.emptyModSlot = player.board.dice.some((d) => {
        return d.props.value !== 0 && d.props.mods.length < 2;
      });
    },
  };
}
