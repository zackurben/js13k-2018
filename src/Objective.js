'use strict';

import Config from '../Config';

export default class Objective {
  constructor(
    x,
    y,
    height = 10,
    width = 10,
    color = 'black',
    score = 0,
    trigger = true,
    load = -1,
    start = false
  ) {
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

    this.start = start;
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

    canvas.strokeStyle = this.color;
    canvas.strokeRect(
      this.x + Config.levelGutter,
      this.y + Config.levelGutter,
      this.width - Config.levelGutter * 2,
      this.height - Config.levelGutter * 2
    );
    canvas.fillStyle = this.color;
    canvas.fillRect(
      this.x + Config.levelGutter * 2,
      this.y + Config.levelGutter * 2,
      this.width - Config.levelGutter * 4,
      this.height - Config.levelGutter * 4
    );

    // If debug is enabled, render the center of the objective and its AABB.
    if (process.env.NODE_ENV === 'development' && Config.debug) {
      if (this.start !== true) {
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
      } else {
        // Debug the start objective with a purple x
        canvas.strokeStyle = 'purple';
        canvas.beginPath();
        canvas.moveTo(this.x, this.y);
        canvas.lineTo(this.x + this.width, this.y + this.height);
        canvas.stroke();
        canvas.moveTo(this.x + this.width, this.y);
        canvas.lineTo(this.x, this.y + this.height);
        canvas.stroke();
        canvas.closePath();

        // Debug the aabb collision box
        canvas.beginPath();
        canvas.strokeRect(this.x, this.y, this.width, this.height);
        canvas.closePath();
      }
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
      ctx.level.load(this.load, ctx);
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
   * @param [Boolean] start
   *   Wether or not this is the start tile.
   *
   * @returns {Objective}
   *   The new Objective copy.
   */
  copy(x, y, height, width, color, score, trigger, load, start) {
    return new Objective(
      x || this.x,
      y || this.y,
      height || this.height,
      width || this.width,
      color || this.color,
      score || this.score,
      trigger || this.trigger,
      load || this.load,
      start || this.start
    );
  }

  /**
   * Override the toJSON functionality to ensure the json stringify outputs
   * the objective data into the map format for easy storage.
   */
  toJSON() {
    return [
      1,
      this.x / 10,
      this.y / 10,
      this.height / 10,
      this.width / 10,
      Config.color.indexOf(this.color) !== -1
        ? Config.color.indexOf(this.color)
        : Config.color[0],
      this.score / 10,
      this.trigger === true ? 1 : 0,
      this.load,
      this.start === true ? 1 : 0
    ];
  }
}
