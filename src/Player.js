'use strict';

export default class Player {
  constructor() {
    this.speed = 1;
    this.x = 10;
    this.y = 10;
    this.height = 10;
    this.width = 10;
  }

  render({ canvas }) {
    canvas.fillStyle = 'rgba(0, 0, 0, 1)';
    canvas.fillRect(this.x, this.y, this.width, this.height);
  }

  update(delta) {
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = 0;
    }
  }
}
