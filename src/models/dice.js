export default function dice(row, column) {
  return {
    value: 0,
    mod: "",
    status: "",
    position: [row, column], //[row,column]
    blocked: false,
    scale: 1,
  };
}
