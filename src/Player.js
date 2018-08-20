'use strict';

export default class Player {
  constructor() {
    this.speed = 0.1;
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

    // On each update, check the bounds for each wall.
    ctx.walls.forEach(wall => {
      let points = this.intersects(wall);
      let b = wall.bounds();

      points.forEach(pt => {});
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

  intersects(wall) {
    let self = this.bounds();
    let bounds = wall.bounds();

    let out = [];
    self.forEach(pt => {
      let y = pt.y > bounds.top && pt.y < bounds.bottom;
      let x = pt.x > bounds.left && pt.x < bounds.right;

      if (x && y) {
        out.push(pt);
      }
    });

    return out;
  }
}
