'use strict';

import Wall from './Wall';
import Objective from './Objective';
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
 *   A wall for the map.
 */
const toWalls = input => input.map(w => new Wall(w));

/**
 * Convert the input data into objectives.
 *
 * @param {Array} input
 *   The input objective.
 *
 * @returns [Objective]
 *   An objective for the map.
 */
const toObjective = input => input.map(o => new Objective(o));

// The level map.
const levels = {
  1: {
    w: toWalls(one.w),
    o: toObjective(one.o)
  },
  2: {
    w: toWalls(two.w),
    o: toObjective(two.o)
  },
  3: {
    w: toWalls(three.w),
    o: toObjective(three.o)
  },
  4: {
    w: toWalls(four.w),
    o: toObjective(four.o)
  },
  5: {
    w: toWalls(five.w),
    o: toObjective(five.o)
  },
  6: {
    w: toWalls(six.w),
    o: toObjective(six.o)
  },
  7: {
    w: toWalls(seven.w),
    o: toObjective(seven.o)
  }
};

/**
 * A simple level manager.
 */
export default class Level {
  constructor() {
    this.level = 1;
    this.entities = [];
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
    this.entities.forEach(e => e.render({ canvas, Config }));

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

  load(id, ctx) {
    this.level = id;
    this.entities = [].concat(levels[this.level].w, levels[this.level].o);

    let start = this.entities
      .filter(e => e.hasOwnProperty('start') && e.start)
      .shift();
    if (start) {
      ctx.player.move(ctx, start);
    }

    // Restart the level timer on each level load.
    this.startTime = parseInt(new Date().getTime() / 1000);
  }

  /**
   *
   */
  getEntities() {
    return this.entities;
  }

  addScore(score) {
    this.score += score;
  }
}
