'use strict';

export default class Player {
  constructor() {
    this.speed = 0.1;
    this.x = 10;
    this.y = 10;

    this.height = 10;
    this.width = 10;

    this.halfHeight = this.height / 2;
    this.halfWidth = this.width / 2;
  }

  render({ canvas, Config }) {
    canvas.fillStyle = 'rgba(0, 0, 0, 1)';
    canvas.fillRect(
      this.x - this.halfWidth,
      this.y - this.halfHeight,
      this.width,
      this.height
    );

    // Debug the center point
    if (Config.debug) {
      canvas.beginPath();
      canvas.fillStyle = 'green';
      canvas.arc(this.x, this.y, 4, 0, Math.PI * 2);
      canvas.fill();
      canvas.closePath();
    }
  }

  update(delta, ctx) {
    // keep the player within the bounds of the map.
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.x + this.width > ctx.Config.width) {
      this.x = ctx.Config.width - this.width;
    }
    if (this.y + this.height > ctx.Config.height) {
      this.y = ctx.Config.height - this.height;
    }

    // On each update, check the bounds for each wall.
    ctx.walls.forEach(wall => {
      let points = this.intersects(wall);
      let b = wall.bounds();

      let x, y;
      points.forEach(([px, py]) => {
        if (x === undefined) {
          x = px;
        }
        if (y === undefined) {
          y = py;
        }

        x = Math.max(x, px);
        y = Math.max(y, py);
      });

      if (x !== undefined) {
        this.x += x;
      }
      if (y !== undefined) {
        this.y += y;
      }
    });
  }

  bounds() {
    return [
      // top left
      { x: this.x, y: this.y },

      // top right
      { x: this.x + this.width, y: this.y },

      // bottom left
      { x: this.x, y: this.y + this.height },

      // bottom right
      { x: this.x + this.width, y: this.y + this.height }
    ];
  }

  static intersect(point, bounds) {
    let y = point.y > bounds.top && point.y < bounds.bottom;
    let x = point.x > bounds.left && point.x < bounds.right;
    return x && y;
  }

  intersects(wall) {
    let self = this.bounds();
    let bounds = wall.bounds();

    return self
      .map((pt, index) => {
        if (Player.intersect(pt, bounds)) {
          // Check horizontal bounds.
          let a = bounds.left - pt.x;
          let b = bounds.right - pt.x;

          // Check vertical bounds.
          let c = bounds.top - pt.y;
          let d = bounds.bottom - pt.y;

          return [Math.min(a, b), Math.min(c, d)];
        }

        return [0, 0];
      })
      .filter(bound => bound[0] !== 0 && bound[1] !== 0);
  }
}
