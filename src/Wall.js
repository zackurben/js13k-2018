'use strict';

/**
 * A simple wall class that supports collisions.
 */
export default class Wall {
  /**
   * The wall constructor
   *
   * Note: This accepts an array of params for smaller map deserialization.
   *
   * @param {Array}
   *   The params to use for this wall
   */
  constructor([x, y, height = 10, width = 10, color = 'black']) {
    this.x = x;
    this.y = y;

    this.height = height;
    this.width = width;

    this.halfHeight = this.height / 2;
    this.halfWidth = this.width / 2;

    this.color = color;
  }

  /**
   * The render function, called each frame.
   *
   * @param {Object} ctx
   *   The game context object
   */
  render({ canvas, Config }) {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);

    if (Config.debug) {
      // Debug the center point
      canvas.beginPath();
      canvas.fillStyle = 'green';
      canvas.arc(
        this.x + this.halfWidth,
        this.y + this.halfHeight,
        4,
        0,
        Math.PI * 2
      );
      canvas.fill();
      canvas.closePath();

      // Debug the aabb collision box
      canvas.beginPath();
      canvas.strokeStyle = 'red';
      canvas.strokeRect(this.x, this.y, this.width, this.height);
      canvas.closePath();
    }
  }

  /**
   * The update function, called each frame.
   *
   * @param {Number} delta
   *   The time in ms since the last frame
   * @param {Number} ctx
   *   The game context object
   */
  update(delta, ctx) {}

  /**
   * Override the toJSON functionality to ensure the json stringify outputs
   * the brick data into the map format for easy storage.
   */
  toJSON() {
    return [this.x, this.y, this.height, this.width, this.color];
  }
}
