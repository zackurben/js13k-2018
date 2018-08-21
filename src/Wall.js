'use strict';

export default class Wall {
  constructor([x, y, height = 10, width = 10, color = 'black']) {
    this.x = x;
    this.y = y;

    this.height = height;
    this.width = width;

    this.halfHeight = this.height / 2;
    this.halfWidth = this.width / 2;

    this.color = color;
  }

  render({ canvas, Config }) {
    canvas.fillStyle = this.color;
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

  update(delta) {}

  bounds() {
    // horizontal wall
    let horizontal = this.x1 !== this.x2;

    if (horizontal) {
      return {
        top: this.y1 - this.width / 2,
        right: this.x2,
        bottom: this.y2 + this.width / 2,
        left: this.x1
      };
    }

    return {
      top: this.y1,
      right: this.x2 + this.width / 2,
      bottom: this.y2,
      left: this.x1 - this.width / 2
    };
  }
}
