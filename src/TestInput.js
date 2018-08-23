'use strict';

import Wall from './Wall';
import Physics from './Physics';
import Config from '../Config';

export default class TestInput {
  constructor() {
    // The current player input direction, used to sync event movement with the
    // game loop.
    this.direction = {
      up: 0,
      right: 0,
      down: 0,
      left: 0
    };

    // Temporary mouse location
    this.mouse = { x: 0, y: 0 };

    // Whether or not we're in the editor mode.
    this.editor = false;

    // The list of temp map bricks.
    this.bricks = [];

    // The currently selected brick to place.
    this.brickIndex = 1;

    // The available bricks to use
    this.builderBricks = [
      undefined, // Dummy element to fix off by one index.
      { width: 100, height: 10 },
      { width: 10, height: 100 },
      { width: 40, height: 10 },
      { width: 10, height: 40 }
    ];

    // Currently selected color.
    this.colorIndex = 0;

    // The list of available brick colors.
    this.colors = [
      'black',
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'indigo',
      'violet'
    ];

    // On keydown, process simple input events.
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
        case 'Escape':
          this.editor = !this.editor;
          break;
        case '`':
          console.log(JSON.stringify(this.bricks));
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          this.brickIndex = parseInt(event.key);
          break;
      }
    };

    // Force movement to hold keys down.
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

    // Update the mouse location on each move, for use in the editor.
    window.onmousemove = ({ clientX, clientY }) => {
      this.mouse.x = clientX;
      this.mouse.y = clientY;
    };

    // Change the selected color index for the editor on scroll wheel.
    window.onmousewheel = ({ deltaY }) => {
      let delta = deltaY > 0 ? 1 : -1;
      if (this.colorIndex + delta >= this.colors.length) {
        this.colorIndex = this.colors.length;
      } else if (this.colorIndex + delta < 0) {
        this.colorIndex = 0;
      } else {
        this.colorIndex += delta;
      }
    };

    // Place bricks in the scene when the editor is active.
    window.onclick = event => {
      let brick = this.builderBricks[this.brickIndex];
      if (this.editor && brick) {
        this.bricks.push(
          new Wall([
            parseInt(this.mouse.x / Config.gutter) * Config.gutter,
            parseInt(this.mouse.y / Config.gutter) * Config.gutter,
            brick.height,
            brick.width,
            this.colors[this.colorIndex]
          ])
        );
      }
    };

    // Remove default browser RMB menu
    window.oncontextmenu = event => event.preventDefault();

    // Check for the mouse down event to remove bricks. This works better than
    // oncontextmenu because its the down event vs up.
    window.onmousedown = ({ button }) => {
      // RMB click
      if (this.editor && button === 2) {
        // Search the list of bricks to check for intersections and remove any
        // bricks under the mouse location.
        this.bricks = this.bricks
          .map((brick, index) => {
            if (Physics.intersects(this.mouse, brick)) {
              return undefined;
            }

            return brick;
          })
          .filter(item => item !== undefined);
      }
    };
  }

  /**
   * The render function, called each frame.
   *
   * @param {Object} ctx
   *   The game context object
   */
  render({ canvas, ctx, Config }) {
    this.bricks.forEach(brick => brick.render({ canvas, ctx, Config }));

    if (this.editor) {
      let brick = this.builderBricks[this.brickIndex];
      if (brick) {
        canvas.fillStyle = this.colors[this.colorIndex];
        canvas.fillRect(
          parseInt(this.mouse.x / Config.gutter) * Config.gutter,
          parseInt(this.mouse.y / Config.gutter) * Config.gutter,
          brick.width,
          brick.height
        );
      }
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
  update(delta, ctx) {
    let temp = { x: ctx.player.x, y: ctx.player.y };
    if (this.direction.up) {
      temp.y -= parseInt(ctx.player.speed * delta);
    }
    if (this.direction.right) {
      temp.x += parseInt(ctx.player.speed * delta);
    }
    if (this.direction.down) {
      temp.y += parseInt(ctx.player.speed * delta);
    }
    if (this.direction.left) {
      temp.x -= parseInt(ctx.player.speed * delta);
    }

    ctx.player.move(ctx, temp);
  }
}
