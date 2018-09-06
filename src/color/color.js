export default class Color {
  constructor() {
    this.rootStyle = getComputedStyle(document.body);

    this.memoizedColors = {};
  }

  /**
   * Reads a color value from 'variables.css'.
   *
   * @param {string} key The key of the color to get.
   *                     Example: To get `--color-accent-primary`, use the key `accent-primary`.
   */
  getColor(key) {
    // Attempt to pull the color from a memoized list to avoid an expensive(ish) DOM operation.
    if (this.memoizedColors[key] != null) {
      return this.memoizedColors[key];
    }

    const color = this.rootStyle.getPropertyValue(`--color-${key}`);
    this.memoizedColors[key] = color;

    return color;
  }
}
