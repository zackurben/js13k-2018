'use strict';

import Wall from './Wall';
import Objective from './Objective';
import Util from './Util';
import Config from '../Config';
const { parse } = Util;

export default input => {
  let level = parse(input);
  let walls = [];
  let objectives = [];
  let map = {};

  let last,
    x = 0,
    y = 0;

  level.w.forEach(w => (map[`${w.x},${w.y}`] = w));

  // Optimize the walls (vertically).
  for (x = 0; x < Config.width; x += Config.wall) {
    for (y = 0; y < Config.height; y += Config.wall) {
      if (!map[`${x},${y}`]) continue;
      let section = map[`${x},${y}`];
      if (!last) {
        last = section;
        continue;
      }

      // Vertical neighbor
      if (
        section.y === last.y + last.height &&
        section.x === last.x &&
        section.width === last.width
      ) {
        last.height += section.height;
      }
      // Not a neighbor
      else {
        walls.push(last);
        last = section;
      }

      delete map[`${x},${y}`];
    }
  }
  walls.push(last);

  // Optimize the walls (Horizontally).
  // Update the map model
  map = {};
  walls.forEach(w => (map[`${w.x},${w.y}`] = w));

  // Clear the walls from the first pass.
  walls = [];

  // Reverse the direction for another pass.
  last = undefined;
  x = 0;
  y = 0;
  for (y = 0; y < Config.height; y += Config.wall) {
    for (x = 0; x < Config.width; x += Config.wall) {
      if (!map[`${x},${y}`]) continue;
      let section = map[`${x},${y}`];
      if (!last) {
        last = section;
        continue;
      }

      // Horizontal neighbor
      if (
        section.x === last.x + last.width &&
        section.y === last.y &&
        section.height === last.height
      ) {
        last.width += section.width;
      }
      // Not a neighbor
      else {
        walls.push(last);
        last = section;
      }

      delete map[`${x},${y}`];
    }
  }
  walls.push(last);

  return [].concat(walls, level.o);
};
