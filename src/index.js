'use strict';

import '../index.css';
import Config from '../Config';
import Input from './input/input';
import Player from './Player';
import Wall from './Wall';
import MapEditor from './MapEditor';

/**
 * Get a new canvas context for rendering.
 *
 * @returns {Object}
 *   The canvas context.
 */
const getCanvas = () => {
  const html = document.createElement('canvas');
  html.height = Config.height;
  html.width = Config.width;
  document.body.appendChild(html);
  return html.getContext('2d');
};

// The current level to render.
// @TODO: Replace with some level management system.
let walls = [[100, 100, 10, 100], [200, 50, 100, 10]].map(
  item => new Wall(item)
);

// The game context. Passed to each entity on update and render to make internal
// variables accessible from sub-modules.
const ctx = {
  canvas: getCanvas(),
  player: new Player(),
  input: new Input(),
  mapEditor: new MapEditor(),
  Config,
  walls
};

// The list of enumerated entities in the game.
let entities = [ctx.player, ctx.input, ctx.mapEditor].concat(walls);

// The time in ms since the start of this game.
let start = 0;

// The time in ms since the last frame.
let delta = 0;

/**
 * The primary game loop
 *
 * @param {Number} timestamp
 *   The timestamp of running time in ms.
 */
let update = timestamp => {
  // Calculate the ms delta from the last game tick.
  delta = timestamp - start;
  start = timestamp;

  // Clear the entire canvas.
  ctx.canvas.clearRect(0, 0, Config.width, Config.height);

  // For each entity in the game, update it and then render it.
  entities.forEach(entity => {
    // Physics calculations.
    entity.update(delta, ctx);

    // Save and restore the canvas before each render call, to avoid leaking
    // rendering state from one call to another.
    ctx.canvas.save();
    entity.render(ctx);
    ctx.canvas.restore();
  });

  // Recurse into the next frame @ ~60fps
  window.requestAnimationFrame(update);
};

// Start the game.
update();
