export default function player() {
  return {
    id: "p1",
    dice: null,
    board: null,
    turn: false,
    isValueAssigned: true,
    isFirstMove: true,
    emptyModSlot: false,
    checkEmptyModSlot: (player) => {
      player.emptyModSlot = player.board.dice.some((d) => {
        return d.atributes.value !== 0 && d.atributes.mods.length < 2;
      });
    },
  };
}
