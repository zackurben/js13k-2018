'use strict';

import Wall from './Wall';
import one from './levels/1';
import two from './levels/2';
import three from './levels/3';
import four from './levels/4';
import five from './levels/5';
import six from './levels/6';
import seven from './levels/7';

/**
 * Convert the input data into walls.
 *
 * @param {Array} input
 *   The input wall.
 *
 * @returns [Wall]
 *   The walls for the map.
 */
const toWalls = input => input.map(w => new Wall(w));

// The level map.
const levels = {
  1: toWalls(one),
  2: toWalls(two),
  3: toWalls(three),
  4: toWalls(four),
  5: toWalls(five),
  6: toWalls(six),
  7: toWalls(seven)
};

/**
 * A simple level manager.
 */
export default class Level {
  constructor() {
    this.level = 1;
    this.walls = [];
    this.score = 0;

    this.startTime = 0;
    this.time = 0;
  }

  /**
   * The render function, called each frame.
   *
   * @param {Object} ctx
   *   The game context object
   */
  render({ canvas, Config }) {
    this.walls.forEach(wall => wall.render({ canvas, Config }));

    // Draw the text for the level.
    canvas.font = `40px san-serif`;
    canvas.fillStyle = 'black';
    canvas.textAlign = 'center';
    canvas.textBaseline = 'top';
    canvas.fillText(`Level ${this.level}`, 250, 0, Config.width);

    // Draw the text for the score.
    canvas.font = `20px san-serif`;
    canvas.fillStyle = 'black';
    canvas.textAlign = 'left';
    canvas.textBaseline = 'top';
    canvas.fillText(`Score: ${this.score}`, 0, 0, Config.width);

    // Draw the text for the time.
    canvas.font = `20px san-serif`;
    canvas.fillStyle = 'black';
    canvas.textAlign = 'right';
    canvas.textBaseline = 'top';
    canvas.fillText(`Time: ${this.time}`, Config.width, 0, Config.width);
  }

  /**
   * The update function, called each frame.
   *
   * @param {Number} delta
   *   The time in ms since the last frame
   * @param {Number} ctx
   *   The game context object
   */
  update(delta, ctx) {
    let now = new Date().getTime() / 1000;
    this.time = parseInt(now - this.startTime);
  }

  load(id) {
    this.level = id;
    this.walls = levels[this.level];

    // Restart the level timer on each level load.
    this.startTime = parseInt(new Date().getTime() / 1000);
  }

  /**
   *
   */
  getWalls() {
    return this.walls;
  }
}
