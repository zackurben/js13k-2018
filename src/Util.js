'use strict';

import Config from '../Config';
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
 * Coerce the input into a float
 *
 * @param {String} input
 *   The string input
 *
 * @returns {Number|undefined}
 *   The coerced value
 */
const toFloat = input => {
  if (input === undefined) {
    return undefined;
  }

  return parseFloat(input);
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
    x = toFloat(x) * 10;
    y = toFloat(y) * 10;
    height = toInt(height) * 10;
    width = toInt(width) * 10;
    color = Config.color[toInt(color)];
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

export default {
  toInt,
  toFloat,
  toBool,
  parse,
  levels
};
