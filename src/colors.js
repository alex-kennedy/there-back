const COLOUR_SCALES = [
  "#A8A8A8",
  "#A6BD9D",
  "#C0D291",
  "#E8DA85",
  "#FFB177",
  "#FF8A87",
  "#FF98C2",
  "#FFABF3",
  "#F8BFFF",
  "#E7D4FF",
  "#EAEAFF",
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
