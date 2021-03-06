'use strict';

import Physics from './Physics';
import Wall from './Wall';
import Objective from './Objective';

/**
 * A simple player class.
 */
export default class Player {
  /**
   * Generic player constructor
   *
   * @TODO: Add customizable x/y inputs for different map spawns.
   */
  constructor() {
    this.speed = 0.15;
    this.x = 100;
    this.y = 100;

    this.height = 10;
    this.width = 10;

    // Store the half dimensions for rendering debug content.
    this.halfHeight = this.height / 2;
    this.halfWidth = this.width / 2;
  }

  /**
   * The render function, called each frame.
   *
   * @param {Object} ctx
   *   The game context object
   */
  render({ canvas, color, Config }) {
    canvas.fillStyle = color.getColor('accent-secondary');
    canvas.fillRect(this.x, this.y, this.width, this.height);

    // If debug is enabled, render the center point of the player and its AABB.
    if (process.env.NODE_ENV === 'development' && Config.debug) {
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
   * The update function, called each frame.
   *
   * @param {Number} ctx
   *   The game context object
   * @param {Object} point
   *   The game point to move to
   */
  move(ctx, point) {
    // Assume the player can move anywhere.
    let moveX = true;
    let moveY = true;

    // Check each known wall in the game context and try to invalidate the move.
    ctx.level.getEntities().forEach(e => {
      // Check if this is a valid move in the x direction.
      if (
        e instanceof Wall &&
        Physics.intersects(
          // Shim the point to contain the player dimensions for correct AABB
          Object.assign(
            { x: point.x, y: this.y },
            { height: this.height, width: this.width }
          ),
          e
        )
      ) {
        // Any player intersections invalidate the move.
        moveX = false;
      }

      // Check if this is a valid move in the y direction.
      if (
        e instanceof Wall &&
        Physics.intersects(
          // Shim the point to contain the player dimensions for correct AABB
          Object.assign(
            { y: point.y, x: this.x },
            { height: this.height, width: this.width }
          ),
          e
        )
      ) {
        // Any player intersections invalidate the move.
        moveY = false;
      }
    });

    // Only change the player location if the move in each direction passed all
    // wall checks.
    if (moveX) {
      this.x = point.x;
    }
    if (moveY) {
      this.y = point.y;
    }

    // Check for collisions at the new player location.
    ctx.level.getEntities().forEach(e => {
      if (
        e instanceof Objective &&
        e.alive &&
        Physics.intersects(
          // Shim the point to contain the player dimensions for correct AABB
          Object.assign(
            { x: this.x, y: this.y },
            { height: this.height, width: this.width }
          ),
          e
        )
      ) {
        e.interact(ctx);
      }
    });
  }
}
