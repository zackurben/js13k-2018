import getKeyboardInputState from './keyboard-input'

// The intensity given to a keyboard key press. Can be a minimum of 1 and a maximum of 2.
const keyboardInputIntensity = 2

export default function getInputState () {
  /**
   * The current state of the input.
   * Each value has a minimum of 0, and a maximum of 2.
   */
  const inputState = {
    upIntensity: 0,
    downIntensity: 0,
    leftIntensity: 0,
    rightIntensity: 0
  }

  const keyboardInputState = getKeyboardInputState()

  if (keyboardInputState.w) {
    inputState.upIntensity = keyboardInputIntensity
  }

  if (keyboardInputState.s) {
    inputState.downIntensity = keyboardInputIntensity
  }

  if (keyboardInputState.a) {
    inputState.leftIntensity = keyboardInputIntensity
  }

  if (keyboardInputState.d) {
    inputState.rightIntensity = keyboardInputIntensity
  }

  // TODO: Add gyro input handling here to allow it to override keyboard input.

  return inputState
}
