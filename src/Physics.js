'use strict';

export default class Physics {
  static intersects(one, two) {
    if (
      one.x < two.x + (two.width || 0) &&
      one.x + (one.width || 0) > two.x &&
      one.y < two.y + (two.height || 0) &&
      one.y + (one.height || 0) > two.y
    ) {
      return true;
    }

    return false;
  }
}
