'use strict';

export default class Objective {
  constructor([
    x,
    y,
    height = 10,
    width = 10,
    color = 'black',
    score = 0,
    trigger = true,
    load = -1
  ]) {
    this.alive = true;
    this.x = x;
    this.y = y;

    this.height = height;
    this.width = width;

    this.halfHeight = this.height / 2;
    this.halfWidth = this.width / 2;

    this.color = color;
    this.score = score;
    this.trigger = !!trigger;
    this.load = load;
  }

  /**
   * The render function, called each frame.
   *
   * @param {Object} ctx
   *   The game context object
   */
  render({ canvas, Config }) {
    if (!this.alive) {
      return;
    }

    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);

    // If debug is enabled, render the center of the objective and its AABB.
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
   * The objective interaction.
   */
  interact(ctx) {
    if (this.trigger) {
      this.alive = false;
      ctx.level.addScore(this.score);
    }
    if (this.load > 0) {
      ctx.level.load(this.load);
    }
  }

  /**
   * Copy the current objective with the optional modifications.
   *
   * @param [Number] x
   *   The x location to use
   * @param [Number] y
   *   The y location to use
   * @param [Number] height
   *   The height to use
   * @param [Number] width
   *   The width to use
   * @param [Number] color
   *   The color to use
   * @param [Number] score
   *   The score that this objective is worth
   * @param [Boolean] trigger
   *   Wether or not this objective is a trigger
   * @param [Number] load
   *   The level to load on collision
   *
   * @returns {Objective}
   *   The new wall copy.
   */
  copy(x, y, height, width, color, score, trigger, load) {
    return new Objective([
      x || this.x,
      y || this.y,
      height || this.height,
      width || this.width,
      color || this.color,
      score || this.score,
      trigger || this.trigger,
      load || this.load
    ]);
  }
}
