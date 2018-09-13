import Player from '../Player';
import getGyroInputState from './gyro-input';
import { keyboard } from './input-variables';
import getKeyboardInputState from './keyboard-input';

export default class Input {
  /**
   * The render function, called each frame.
   */
  render() {
    /* NOOP */
  }

  /**
   * The update function, called each frame.
   *
   * @param {number} delta The time in ms since the last frame.
   * @param {Object} gameContext The game context object.
   */
  update(delta, context) {
    if (context.level.time < 1) {
      return;
    }

    context.player.move(
      context,
      this._getUpdatedPlayerPosition(delta, context)
    );
  }

  /**
   *  Gets the current state of the input.
   *
   * @returns {Object} The current state of the input.
   */
  _getInputState() {
    /**
     * The current state of the input.
     * Each value has a minimum intensity of 0, and a maximum intensity of 2.
     */
    const inputState = {
      upIntensity: 0,
      downIntensity: 0,
      leftIntensity: 0,
      rightIntensity: 0
    };

    const keyboardInputState = getKeyboardInputState();
    const gyroInputState = getGyroInputState();

    if (keyboardInputState.w) {
      inputState.upIntensity = keyboard.intensity;
    }

    if (keyboardInputState.s) {
      inputState.downIntensity = keyboard.intensity;
    }

    if (keyboardInputState.a) {
      inputState.leftIntensity = keyboard.intensity;
    }

    if (keyboardInputState.d) {
      inputState.rightIntensity = keyboard.intensity;
    }

    if (gyroInputState.upIntensity > 0) {
      inputState.upIntensity = gyroInputState.upIntensity;
    }

    if (gyroInputState.downIntensity > 0) {
      inputState.downIntensity = gyroInputState.downIntensity;
    }

    if (gyroInputState.leftIntensity > 0) {
      inputState.leftIntensity = gyroInputState.leftIntensity;
    }

    if (gyroInputState.rightIntensity > 0) {
      inputState.rightIntensity = gyroInputState.rightIntensity;
    }

    return inputState;
  }

  /**
   * Updates the players position based on the current input.
   *
   * @param {number} delta The time in ms since the last frame.
   * @param {Player} player The player.
   */
  _getUpdatedPlayerPosition(delta, { player, mapEditor }) {
    const playerPosition = {
      x: player.x,
      y: player.y
    };

    // Disable player input if the map editor is enabled.
    if (mapEditor.editor) return playerPosition;

    const inputState = this._getInputState();

    if (inputState.upIntensity > 0) {
      playerPosition.y -= parseInt(
        player.speed * delta * inputState.upIntensity
      );
    }

    if (inputState.downIntensity > 0) {
      playerPosition.y += parseInt(
        player.speed * delta * inputState.downIntensity
      );
    }

    if (inputState.leftIntensity > 0) {
      playerPosition.x -= parseInt(
        player.speed * delta * inputState.leftIntensity
      );
    }

    if (inputState.rightIntensity > 0) {
      playerPosition.x += parseInt(
        player.speed * delta * inputState.rightIntensity
      );
    }

    return playerPosition;
  }
}
