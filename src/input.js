import getGyroInputState from "./gyro-input";
import getKeyboardInputState from "./keyboard-input";

// The intensity given to a keyboard key press. Can be a minimum of 1 and a maximum of 2.
const keyboardInputIntensity = 2;

export default function getInputState() {
  /**
   * The current state of the input.
   * Each value has a minimum of 0, and a maximum of 2.
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
    inputState.upIntensity = keyboardInputIntensity;
  }

  if (keyboardInputState.s) {
    inputState.downIntensity = keyboardInputIntensity;
  }

  if (keyboardInputState.a) {
    inputState.leftIntensity = keyboardInputIntensity;
  }

  if (keyboardInputState.d) {
    inputState.rightIntensity = keyboardInputIntensity;
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
