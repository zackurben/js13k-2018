'use strict';

import Player from './Player';

/**
 * Get a new canvas context for rendering.
 *
 * @returns {Object}
 *   The canvas context.
 */
const getCanvas = () => {
  const html = document.createElement('canvas');
  document.body.appendChild(html);
  return html.getContext('2d');
};

// The game context.
const ctx = {
  canvas: getCanvas()
};

// The list of entities in the game.
let entities = [new Player()];

// Run the game.
window.requestAnimationFrame(onFrame);

function onFrame (delta) {
  entities.forEach(entity => {
    // Physics calculations.
    entity.update(delta);

    // GFX drawing
    ctx.canvas.save();
    entity.render(ctx);
    ctx.canvas.restore();
  });

  window.requestAnimationFrame(onFrame)
}
