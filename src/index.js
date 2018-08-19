'use strict';

import Player from './Player';

import getInputState from './input';

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

function onFrame(delta) {
  _mutateEntitiesOnInput(entities);

  entities.forEach(entity => {
    // Physics calculations.
    entity.update(delta);

    // GFX drawing
    ctx.canvas.save();
    entity.render(ctx);
    ctx.canvas.restore();
  });

  window.requestAnimationFrame(onFrame);
}

function _mutateEntitiesOnInput(entities) {
  // TODO: Find a nicer, more generic way to update entities on input. I'm just updating entities[0] for now since that's the "player". We'll need to decide how to determine what should be updated, and what shouldn't later, as well as how (for things like the map).

  const inputState = getInputState();

  entities[0].y -= inputState.upIntensity;
  entities[0].y += inputState.downIntensity;
  entities[0].x -= inputState.leftIntensity;
  entities[0].x += inputState.rightIntensity;
}
