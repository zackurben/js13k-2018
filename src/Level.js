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
import Config from '../Config';

// The reverse color map for mapping ints to colors.
const COLORS = Object.keys(Config.c);

/**
 * Coerce the input into a number
 *
 * @param {String} input
 *   The string input
 *
 * @returns {Number|undefined}
 *   The coerced value
 */
const toInt = input => {
  if (input === undefined) {
    return undefined;
  }

  return parseInt(input);
};

/**
 * Coerce the input into a boolean
 *
 * @param {String} input
 *   The string input
 *
 * @returns {Bool|undefined}
 *   The coerced value
 */
const toBool = input => {
  if (input === undefined) {
    return undefined;
  }

  return toInt(input) === 1 ? true : false;
};

/**
 * Convert the string map into its proper entities.
 *
 * @param {String} i
 *   The string map to convert
 *
 * @returns {Object}
 *   The expanded map entities.
 */
const parse = i => {
  let w = [];
  let o = [];

  // Split on the entity delimiter.
  i.split(',-1,').forEach(e => {
    let [
      type,
      x,
      y,
      height,
      width,
      color,
      score,
      trigger,
      load,
      start
    ] = e.split(',');
    type = toInt(type);
    x = toInt(x) * 10;
    y = toInt(y) * 10;
    height = toInt(height) * 10;
    width = toInt(width) * 10;
    color = COLORS[toInt(color)];
    score = toInt(score) * 10;
    trigger = toBool(trigger);
    load = toInt(load);
    start = toBool(start);

    // This is a wall.
    if (type === 0) {
      w.push(new Wall(x, y, height, width, color));
    } else if (type === 1) {
      o.push(
        new Objective(x, y, height, width, color, score, trigger, load, start)
      );
    }
  });

  return {
    w,
    o
  };
};

// The level map.
const levels = {
  1: parse(one),
  2: parse(two),
  3: parse(three),
  4: parse(four),
  5: parse(five),
  6: parse(six),
  7: parse(seven)
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
  render(ctx) {
    this.entities.forEach(e =>
      e.render({ canvas: ctx.canvas, Config: ctx.Config })
    );

    ctx.dataDisplay.updateDisplayNode('level', this.level);
    ctx.dataDisplay.updateDisplayNode('score', this.score);
    ctx.dataDisplay.updateDisplayNode('time', this.time);
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
      // Spawn the player in the center of the tile.
      let origin = {
        x: start.x + parseInt((start.width - ctx.player.width) / 2),
        y: start.y + parseInt((start.height - ctx.player.height) / 2)
      };

      ctx.player.move(ctx, origin);
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
