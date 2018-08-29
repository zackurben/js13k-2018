'use strict';

import Wall from './Wall';
import Physics from './Physics';
import Config from '../Config';
import Objective from './Objective';

export default class TestInput {
  constructor() {
    // Temporary mouse location
    this.mouse = { x: 0, y: 0 };

    // Whether or not we're in the editor mode.
    this.editor = false;

    // The list of temp map entities.
    this.entities = [];

    // The currently selected entity to place.
    this.entityIndex = 1;

    // The available entities to use
    this.builderEntities = [
      new Wall([undefined, undefined, 10, 100]),
      new Wall([undefined, undefined, 100, 10]),
      new Wall([undefined, undefined, 10, 40]),
      new Wall([undefined, undefined, 40, 10]),
      new Objective([undefined, undefined, 40, 40, undefined, 1, true, 2])
    ];

    // Currently selected color.
    this.colorIndex = 0;

    // The list of available entity colors.
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

    this.keys = [];

    // On keydown, process simple input events.
    window.onkeydown = event => this.keys.push(event.key);

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

    // Place entities in the scene when the editor is active.
    window.onclick = event => {
      let e = this.builderEntities[this.entityIndex];
      if (this.editor && e) {
        this.entities.push(
          e.copy(
            parseInt(this.mouse.x / Config.gutter) * Config.gutter,
            parseInt(this.mouse.y / Config.gutter) * Config.gutter,
            undefined,
            undefined,
            this.colors[this.colorIndex]
          )
        );
      }
    };

    // Remove default browser RMB menu
    window.oncontextmenu = event => event.preventDefault();

    // Check for the mouse down event to remove entities. This works better than
    // oncontextmenu because its the down event vs up.
    window.onmousedown = ({ button }) => {
      // RMB click
      if (this.editor && button === 2) {
        // Search the list of entities to check for intersections and remove any
        // entity under the mouse location.
        this.entities = this.entities
          .map((e, index) => {
            if (Physics.intersects(this.mouse, e)) {
              return undefined;
            }

            return e;
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
    this.entities.forEach(e => e.render({ canvas, ctx, Config }));

    if (this.editor) {
      let e = this.builderEntities[this.entityIndex];
      if (e) {
        // Update the temp entities properties.
        e.x = parseInt(this.mouse.x / Config.gutter) * Config.gutter;
        e.y = parseInt(this.mouse.y / Config.gutter) * Config.gutter;
        e.color = this.colors[this.colorIndex];

        // Render the temp entity.
        e.render({ canvas, ctx, Config });
      }
    }
  }

  printMap(level) {
    console.log(
      `Level: ${level}`,
      JSON.stringify({
        w: this.entities.filter(w => w instanceof Wall),
        o: this.entities.filter(o => o instanceof Objective)
      })
    );
  }

  /**
   * The update function, called each frame.
   *
   * @param {number} delta The time in ms since the last frame.
   * @param {Object} ctx The game context object.
   */
  update(delta, ctx) {
    // Process at-most 10 keys per frame.
    for (let i = 0; i < 10; i++) {
      let key = this.keys.shift();
      if (key === undefined) {
        break;
      }

      switch (key) {
        case 'Escape':
          this.editor = !this.editor;
          ctx.Config.debug = this.editor;

          // If we're syncing, copy the existing map into the editor. Clear the
          // map, so everything is editable.
          if (this.editor) {
            this.entities = ctx.level.getEntities();
            ctx.level.entities = [];
          } else {
            // If we're copying the map, re-set the walls in the level to add
            // physics.
            ctx.level.entities = this.entities;
          }
          break;
        case '`':
          if (!this.editor) return;

          this.printMap(ctx.level.level);
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
          if (!this.editor) return;

          // Always print the current map before switching levels.
          this.printMap(ctx.level.level);
          ctx.level.load(parseInt(key));
          break;
        case 'q':
        case 'w':
        case 'e':
        case 'r':
        case 't':
          let i = ['q', 'w', 'e', 'r', 't'].indexOf(key);
          if (i == -1) return;

          this.entityIndex = i;
          break;
      }
    }
  }
}
