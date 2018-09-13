'use strict';

import Util from './Util';
const { levels } = Util;

/**
 * A simple level manager.
 */
export default class Level {
  constructor() {
    this.level = 1;
    this.entities = [];
    this.score = 0;

    this.startTime = 0;
    this.time = 0;
  }

  /**
   * The render function, called each frame.
   *
   * @param {Object} ctx
   *   The game context object
   */
  render(ctx) {
    this.getEntities().forEach(e =>
      e.render({ canvas: ctx.canvas, Config: ctx.Config })
    );

    ctx.dataDisplay.updateDisplayNode('level', this.level);
    ctx.dataDisplay.updateDisplayNode('score', this.score);
    ctx.dataDisplay.updateDisplayNode('time', parseInt(this.time));
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
    if (isNaN(delta)) {
      return;
    }

    this.time += delta / 1000;
  }

  load(id, ctx) {
    setTimeout(() => {
      // Don't reload the first level after finishing the game.
      if (this.level === 7 && id === 1) {
        ctx.pause();
        ctx.dataDisplay.showEndSplash(this.score, parseInt(this.time));
        return;
      }

      this.level = id;
      this.entities = [].concat(levels[this.level].w, levels[this.level].o);

      let start = this.entities
        .filter(e => e.hasOwnProperty('start') && e.start)
        .shift();
      if (start) {
        // Spawn the player in the center of the tile.
        let origin = {
          x: start.x + parseInt((start.width - ctx.player.width) / 2),
          y: start.y + parseInt((start.height - ctx.player.height) / 2)
        };

        ctx.player.move(ctx, origin);
      }
    });

    // Restart the level timer on each level load.
    this.startTime = parseInt(new Date().getTime() / 1000);
  }

  /**
   *
   */
  getEntities() {
    return this.entities;
  }

  addScore(score) {
    this.score += score;
  }
}
