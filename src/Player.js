'use strict';

export default class Player {
  constructor() {
    this.speed = 0.5;
    this.x = 10;
    this.y = 10;
    this.height = 10;
    this.width = 10;
  }

  render({ canvas }) {
    canvas.fillStyle = 'rgba(0, 0, 0, 1)';
    canvas.fillRect(this.x, this.y, this.width, this.height);
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
  }

  bounds() {
    return {
      top: this.y,
      right: this.x + this.width,
      bottom: this.y + this.height,
      left: this.x
    };
  }

  intersects(wall) {
    let self = this.bounds();
    let bounds = wall.bounds();

    let intersections = Object.keys(self).map(corner => {
      let check = self[corner];
      let intersect = {
        top: check < bounds.top,
        right: check < bounds.right,
        bottom: check > bounds.bottom,
        left: check > bounds.left
      };

      if (
        intersect.top &&
        intersect.right &&
        intersect.bottom &&
        intersect.left
      ) {
        return true;
      }

      return false;
    });

    // return intersections.reduce((acc, cur) => acc || cur, false);
    return intersections;
  }
}
