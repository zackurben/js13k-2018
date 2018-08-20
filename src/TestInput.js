'use strict';

export default class TestInput {
  constructor() {
    this.direction = {
      up: 0,
      right: 0,
      down: 0,
      left: 0
    };

    window.onkeydown = event => {
      switch (event.key) {
        case 'w':
        case 'ArrowUp':
          this.direction.up = 1;
          break;
        case 'd':
        case 'ArrowRight':
          this.direction.right = 1;
          break;
        case 's':
        case 'ArrowDown':
          this.direction.down = 1;
          break;
        case 'a':
        case 'ArrowLeft':
          this.direction.left = 1;
          break;
      }
    };

    window.onkeyup = event => {
      switch (event.key) {
        case 'w':
        case 'ArrowUp':
          this.direction.up = 0;
          break;
        case 'd':
        case 'ArrowRight':
          this.direction.right = 0;
          break;
        case 's':
        case 'ArrowDown':
          this.direction.down = 0;
          break;
        case 'a':
        case 'ArrowLeft':
          this.direction.left = 0;
          break;
      }
    };
  }

  render({ canvas }) {}

  update(delta, ctx) {
    if (this.direction.up) {
      ctx.player.y -= parseInt(ctx.player.speed * delta);
    }
    if (this.direction.right) {
      ctx.player.x += parseInt(ctx.player.speed * delta);
    }
    if (this.direction.down) {
      ctx.player.y += parseInt(ctx.player.speed * delta);
    }
    if (this.direction.left) {
      ctx.player.x -= parseInt(ctx.player.speed * delta);
    }
  }
}
