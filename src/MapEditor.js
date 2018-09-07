'use strict';

import Wall from './Wall';
import Physics from './Physics';
import Config from '../Config';
import Objective from './Objective';

export default class MapEditor {
  constructor() {
    // Temporary mouse location
    this.mouse = { x: 0, y: 0 };

    // Whether or not we're in the editor mode.
    this.editor = false;

    // The list of temp map entities.
    this.entities = [];

    // The currently selected entity to place.
    this.entityIndex = 0;

    // The currently selected level
    this.levelId = 1;

    // The available entities to use
    this.builderEntities = [
      [new Wall(undefined, undefined, 10, 100), 'large horizontal'],
      [new Wall(undefined, undefined, 100, 10), 'large vertical'],
      [new Wall(undefined, undefined, 10, 40), 'small horizontal'],
      [new Wall(undefined, undefined, 40, 10), 'small vertical'],
      [
        new Objective(undefined, undefined, 10, 10, undefined, 1, true),
        'level objective'
      ],
      [
        new Objective(
          undefined,
          undefined,
          20,
          20,
          undefined,
          0,
          false,
          undefined,
          true
        ),
        'start of level'
      ],
      [
        new Objective(
          undefined,
          undefined,
          20,
          20,
          undefined,
          1,
          true,
          this.levelId + 1
        ),
        'end of level'
      ]
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

    // Allow users to change the rand seed for difficulty change.
    this.rand = 10000;

    /**
     * Generate a map using prims algorithm.
     */
    this.generate = () => {
      // Generate the map bounds
      let map = [
        // Top wall
        new Wall(0, 0, Config.wall, Config.width),

        // Bottom wall
        new Wall(0, Config.height - Config.wall, Config.wall, Config.width),

        // Left wall
        new Wall(0, Config.wall, Config.height - Config.wall * 2, Config.wall),

        // Right wall
        new Wall(
          Config.width - Config.wall,
          Config.wall,
          Config.height - Config.wall * 2,
          Config.wall
        )
      ];

      // Assign random weights to each node, to use with prims.
      let weights = {};
      let countX = Config.width / Config.wall - 1;
      let countY = Config.height / Config.wall - 1;
      for (let x = 1; x < countX; x++) {
        for (let y = 1; y < countY; y++) {
          weights[`${x},${y}`] = parseInt(Math.random(1) * this.rand - 1) + 1;
        }
      }

      // Start the maze generation from the center most-ish node.
      const mid = parseInt(Object.keys(weights).length / 2);
      const startNode = Object.keys(weights)[mid];
      
      // Track the final list of visited nodes.
      let visited = [];

      /**
       * Get the shortest path to the 4 straight adjacent nodes.
       * 
       * @param {String} node
       *   The nodes location `x,y`
       */
      const getMin = node => {
        let [x, y] = node.split(',');
        let min = this.rand;
        let index = -1;

        // The possible adjacent nodes.
        let next = [
          `${x},${parseInt(y) - 1}`, // top
          `${parseInt(x) + 1},${y}`, // right
          `${x},${parseInt(y) + 1}`, // bottom
          `${parseInt(x) - 1},${y}` // left
        ];

        // Remove any undefined and previously visited nodes
        let filtered = next.filter(tile => {
          if (!weights.hasOwnProperty(tile) || visited.indexOf(tile) !== -1) {
            return false;
          }

          return true;
        });

        // Determine which node has the shortest path
        filtered.forEach(tile => {
          if (weights[tile] < min) {
            min = weights[tile];
            index = tile;
          }
        });

        // Return the `x,y` node location for the shortest path. 
        return index;
      };

      /**
       * Recursively find the next node in the list using prims algorithm.
       * 
       * @param {String} node
       *   The current node being traversed.
       * @param {Array} list 
       *   The list of previously visited nodes, which may have more paths.
       */
      const findNext = (node, list = []) => {
        if (!node) return;

        // Update the traversal list.
        visited.push(node);
        
        
        // Determine the travel direction
        let next = getMin(node);
        if (next === -1) {
          next = list.pop();
          while (next !== undefined && getMin(next) === -1) {
            next = list.pop();
          }

          // If there are no more nodes in the list, we are done?
          if (next === undefined) return;
        }

        // Update the last visited node list
        list.push(node);

        return findNext(next, list);
      };

      // Build the visited node path.
      findNext(startNode);

      // visited.forEach(node => {
      //   let [x, y] = node.split(',');
      //   map.push(
      //     new Wall(
      //       x * Config.wall,
      //       y * Config.wall,
      //       Config.wall,
      //       Config.wall,
      //       'red'
      //     )
      //   );
      // })

      console.log(visited);
      return map;
    };

    // On keydown, process simple input events.
    window.onkeydown = event => this.keys.push(event.key);

    // Update the mouse location on each move, for use in the editor.
    window.onmousemove = ({ clientX, clientY }) => {
      // TODO: This should really be passed in instead of being recalculated, but, this isn't part of the game, so more of a nice stretch goal.
      const canvas = document.getElementById('canvas');
      const { left, top } = canvas.getBoundingClientRect();
      const scalingFactor = canvas.width / Config.width;

      this.mouse.x = (clientX - left) / scalingFactor;
      this.mouse.y = (clientY - top) / scalingFactor;
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
      let [e] = this.builderEntities[this.entityIndex];
      if (this.editor && e) {
        // Dynamically update the end of level objective
        if (e instanceof Objective && e.load !== -1) {
          e.load = this.levelId + 1;
        }

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
      let [e, description] = this.builderEntities[this.entityIndex];
      if (e) {
        // Update the temp entities properties.
        e.x = parseInt(this.mouse.x / Config.gutter) * Config.gutter;
        e.y = parseInt(this.mouse.y / Config.gutter) * Config.gutter;
        e.color = this.colors[this.colorIndex];

        // Render the temp entity.
        e.render({ canvas, ctx, Config });
      }

      // Debug the entity at the active cursor
      canvas.font = `20px san-serif`;
      canvas.fillStyle = 'black';
      canvas.textAlign = 'left';
      canvas.textBaseline = 'top';
      canvas.fillText(`> ${description}`, 0, 20, Config.width);
    }
  }

  printMap(level) {
    console.log(
      `Level: ${level}`,
      [].concat(this.entities.map(e => e.toJSON()).join(',-1,')).toString()
    );
  }

  /**
   * The update function, called each frame.
   *
   * @param {number} delta The time in ms since the last frame.
   * @param {Object} ctx The game context object.
   */
  update(delta, ctx) {
    // Ensure we memoize the current level for the on-click action
    if (this.editor) {
      this.levelId = ctx.level.level;
    }

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
          ctx.level.load(parseInt(key), ctx);
          break;
        case 'q':
        case 'w':
        case 'e':
        case 'r':
        case 't':
        case 'y':
        case 'u':
          let i = ['q', 'w', 'e', 'r', 't', 'y', 'u'].indexOf(key);
          if (i == -1) return;

          this.entityIndex = i;
          break;
        case 'p':
          if (!this.editor) return;

          this.entities = this.generate();
          ctx.level.entities = this.entities;
          break;
      }
    }
  }
}
