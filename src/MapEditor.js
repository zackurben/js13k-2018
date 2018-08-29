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
      undefined, // Dummy element to fix off by one index.
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

    // Whether or not to copy the map from the level to the editor.
    this.syncMap = false;

    // Whether or not to copy the map from the editor to the level.
    this.copyMap = false;

    // On keydown, process simple input events.
    window.onkeydown = event => {
      switch (event.key) {
        case 'Escape':
          this.editor = !this.editor;

          if (this.editor) {
            this.syncMap = true;
          } else {
            this.copyMap = true;
          }
          break;
        case '`':
          console.log(
            JSON.stringify({
              w: this.entities.filter(w => w instanceof Wall),
              o: this.entities.filter(o => o instanceof Objective)
            })
          );
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          this.entityIndex = parseInt(event.key);
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

  /**
   * The update function, called each frame.
   *
   * @param {number} delta The time in ms since the last frame.
   * @param {Object} ctx The game context object.
   */
  update(delta, ctx) {
    // If we're syncing, copy the existing map into the editor. Clear the map,
    // So everything is editable.
    if (this.syncMap) {
      this.entities = ctx.level.getEntities();
      ctx.level.walls = [];
      this.syncMap = false;
    }
    // If we're copying the map, re-set the walls in the level to add physics.
    else if (this.copyMap) {
      ctx.level.walls = this.entities;
      this.copyMap = false;
    }
  }
}
