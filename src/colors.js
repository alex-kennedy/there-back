const COLOUR_SCALES = [
  "#7AB8E7",
  "#7BA7E6",
  "#7C97E5",
  "#7E88E4",
  "#847FE2",
  "#9480E1",
  "#A381E0",
  "#B282DF",
  "#906FCA",
  "#6F5CB3",
  "#504B9B",
  "#3B4182",
  "#2C3A68",
];

class MainColorScale {
  constructor(low, high) {
    this.low = typeof low === "undefined" ? 0 : low;
    this.high = typeof high === "undefined" ? 1 : high;
    this.colours = COLOUR_SCALES;
  }

  get(value) {
    value = (value - this.low) / (this.high - this.low);

    // Ensures the bounds of the array aren't broken
    if (value >= 1) {
      value -= 1 - 1e-6;
    }
    const index = Math.floor(value * this.colours.length);
    return this.colours[index];
  }
}

export default MainColorScale;
