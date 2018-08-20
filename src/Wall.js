'use strict';

export default class Wall {
  constructor([x1, y1, x2, y2, width = 10, color = 'black']) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.width = width;
    this.color = color;
  }

  render({ canvas }) {
    canvas.strokeStyle = this.color;
    canvas.lineWidth = this.width;
    canvas.beginPath();
    canvas.moveTo(this.x1, this.y1);
    canvas.lineTo(this.x2, this.y2);
    canvas.stroke();
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
