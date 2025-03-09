export default function dice(row, column, board = 0) {
  return {
    value: 0,
    mods: [],
    status: "",
    position: [row, column], //[row,column]
    blocked: false,
    scale: 1,
    board: board,
  };
}
