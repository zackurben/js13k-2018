'use strict';

import Config from './Config';
import Player from './Player';
import Wall from './Wall';
import TestImport from './TestInput';

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

// The game context.
const ctx = {
  canvas: getCanvas(),
  player: new Player(),
  input: new TestImport(),
  Config
};

// The list of entities in the game.
let entities = [ctx.player, ctx.input].concat(
  [[0, 0, 100, 0], [100, 0, 100, 100]].map(item => new Wall(item))
);

// Run the game.
let update = delta => {
  ctx.canvas.clearRect(0, 0, Config.width, Config.height);
  entities.forEach(entity => {
    // Physics calculations.
    entity.update(delta, ctx);

    // GFX drawing
    ctx.canvas.save();
    entity.render(ctx);
    ctx.canvas.restore();
  });

  window.requestAnimationFrame(update);
};
update();
