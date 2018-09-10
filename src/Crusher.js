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

  // Optimize the walls.
  let last;
  level.w.forEach(section => {
    if (!last) {
      //  || (last.x !== section.x && last.y !== section.y)
      last = section;
    }

    // Horizontal neighbor
    if (
      section.x === last.x + last.width &&
      section.y === last.y + last.height - Config.wall
    ) {
      last.width += section.width;
    }
    // Vertical neighbor
    else if (
      section.y === last.y + last.height &&
      section.x === last.x + last.width - Config.wall
    ) {
      last.height += section.height;
    }
    // Not a neighbor
    else {
      walls.push(last);
      last = section;
    }
  });
  walls.push(last);

  return [].concat(walls, level.o);
};
