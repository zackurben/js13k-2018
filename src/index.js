'use strict';

import '../variables.css';
import '../reset.css';
import '../index.css';
import Config from '../Config';
import Input from './input/input';
import Player from './Player';
import Level from './Level';
import DataDisplay from './data/data-display';
import Color from './color/color';
import Audio from './Audio';

const globalState = {
  paused: false
};

if (window.localStorage.getItem('skip-splash')) {
  start();
}

document.getElementById('start-button').addEventListener('click', () => {
  if (globalState.paused) {
    unPause();
    return;
  }

  start();
});

document.getElementById('pause-button').addEventListener('click', pause);
window.addEventListener('keypress', event => {
  if (event.keyCode === 32 || event.which === 32) {
    pause();
  }
});

function start() {
  unPause();

  let MapEditor = undefined;
  let Crusher = undefined;
  try {
    MapEditor = require('./MapEditor').default;
    Crusher = require('./Crusher').default;
  } catch (e) {}

  /**
   * Get a new canvas context for rendering.
   *
   * @returns {Object}
   *   The canvas context.
   */
  const getCanvas = () => {
    const container = document.getElementById('canvas-container');

    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    const canvas2dContext = canvas.getContext('2d');

    _mutateCanvasSizeAndScalingOnWindowResize(
      canvas,
      canvas2dContext,
      container,
      Config.width
    );

    window.addEventListener('resize', () => {
      _mutateCanvasSizeAndScalingOnWindowResize(
        canvas,
        canvas2dContext,
        container,
        Config.width
      );
    });

    container.appendChild(canvas);

    return canvas2dContext;
  };

  /**
   * Provides the map of data DOM elements.
   *
   * @returns {Object} Map of data DOM elements.
   */
  const getDataDisplayMap = () => {
    return {
      level: document.getElementById('level'),
      score: document.getElementById('score'),
      time: document.getElementById('time')
    };
  };

  // The game context. Passed to each entity on update and render to make internal
  // variables accessible from sub-modules.
  const ctx = {
    canvas: getCanvas(),
    player: new Player(),
    Config,
    level: new Level(),
    dataDisplay: new DataDisplay(getDataDisplayMap()),
    color: new Color(),
    pause,
    audio: new Audio(),
    input: new Input()
  };

  // The list of enumerated entities in the game.
  let entities = [ctx.input, ctx.level, ctx.player];
  if (Config.builder) {
    ctx.mapEditor = new MapEditor();
    ctx.crusher = Crusher;
    entities.push(ctx.mapEditor);
  }

  // The time in ms since the start of this game.
  let start = 0;

  // The time in ms since the last frame.
  let delta = 0;

  // Skip playing music if its set in the local storage
  if (!window.localStorage.getItem('skip-music')) {
    ctx.audio.music();
  }

  ctx.level.load(1, ctx);

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

    // Don't update if the game is paused.
    if (globalState.paused) {
      window.requestAnimationFrame(update);
      return;
    }

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

  /**
   * Mutate the canvas size and scaling on window resize.
   *
   * @param {HTMLCanvasElement} canvas The canvas element.
   * @param {CanvasRenderingContext2D} canvas2dContext The 2D rendering context of the canvas.
   * @param {HTMLElement} canvasContainer The containing element for the canvas.
   * @param {number} scalingBase Base edge dimension of the canvas.
   */
  function _mutateCanvasSizeAndScalingOnWindowResize(
    canvas,
    canvas2dContext,
    canvasContainer,
    scalingBase
  ) {
    // Get the minimum dimension of the canvas container (in order to keep the square aspect ratio).
    const minDimension = Math.min(
      canvasContainer.offsetHeight,
      canvasContainer.offsetWidth
    );
    const scalingFactor = minDimension / scalingBase;

    canvas.height = minDimension;
    canvas.width = minDimension;

    canvas2dContext.scale(scalingFactor, scalingFactor);
  }
}

function pause() {
  // Show the splash screen and hide the game.
  document.getElementById('splash').classList.remove('hidden');
  document.getElementById('game').classList.add('hidden');

  globalState.paused = true;
}

function unPause() {
  // Hide the splash screen and show the game.
  document.getElementById('splash').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');

  globalState.paused = false;
}
