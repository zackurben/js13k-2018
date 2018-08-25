'use strict';

import Wall from './Wall';
import one from './levels/1';

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
  1: toWalls(one)
};

export default class Level {
  constructor() {
    this.level = 1;
    this.walls = [];
  }

  /**
   * The render function, called each frame.
   *
   * @param {Object} ctx
   *   The game context object
   */
  render({ canvas, Config }) {
    this.walls.forEach(wall => wall.render({ canvas, Config }));
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

  load(id) {
    this.level = id;
    this.walls = levels[this.level];
  }

  /**
   *
   */
  getWalls() {
    return this.walls;
  }
}
