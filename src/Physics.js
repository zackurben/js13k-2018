'use strict';

/**
 * A simple physics utility class.
 */
export default class Physics {
  /**
   * Check for intersections with simpleton AABB collisions.
   *
   * @param {Object} one
   *   The first object to use for calculations
   * @param {Object} two
   *   The second object to use for calculations
   *
   * @returns {Boolean}
   *   Whether or not the two AABBs intersect.
   */
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
