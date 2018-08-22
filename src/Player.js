'use strict';

import Physics from './Physics';

export default class Player {
  constructor() {
    this.speed = 0.3;
    this.x = 10;
    this.y = 10;

    this.height = 10;
    this.width = 10;

    this.halfHeight = this.height / 2;
    this.halfWidth = this.width / 2;
  }

  render({ canvas, Config }) {
    canvas.fillStyle = 'rgba(0, 0, 0, 1)';
    canvas.fillRect(this.x, this.y, this.width, this.height);

    if (Config.debug) {
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

  update(delta, ctx) {}

  move(ctx, point) {
    // On each update, check the bounds for each wall.
    let canMove = true;
    ctx.walls.forEach(wall => {
      if (
        Physics.intersects(
          Object.assign({}, point, { height: this.height, width: this.width }),
          wall
        )
      ) {
        canMove = false;
      }
    });

    if (canMove) {
      this.x = point.x;
      this.y = point.y;
    }
  }
}
