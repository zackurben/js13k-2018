import { gyro } from './input-variables';

/**
 * The current state of the input.
 * Each value has a minimum intensity of 0, and a maximum intensity of 2.
 */
const gyroInputState = {
  upIntensity: 0,
  downIntensity: 0,
  leftIntensity: 0,
  rightIntensity: 0
};

let getZeroedY = null;
let getZeroedX = null;

/**
 * Gets the current gyro input state.
 *
 * @returns {Object} The current gyro input state.
 */
export default function getGyroInputState() {
  return gyroInputState;
}

/**
 * Gets the negative intensity for the given axis degrees.
 *
 * @param {number} axisDegrees Degrees the axis is tilted.
 * @returns {number} The intensity for the given axis degrees.
 */
function _getNegativeIntensity(axisDegrees) {
  if (axisDegrees <= -gyro.intensityAxisThresholds[2]) {
    return 2;
  }

  if (axisDegrees <= -gyro.intensityAxisThresholds[1]) {
    return 1;
  }

  return 0;
}

/**
 * Gets the positive intensity for the given axis degrees.
 *
 * @param {number} axisDegrees Degrees the axis is tilted.
 * @returns {number} The intensity for the given axis degrees.
 */
function _getPositiveIntensity(axisDegrees) {
  if (axisDegrees >= gyro.intensityAxisThresholds[2]) {
    return 2;
  }

  if (axisDegrees >= gyro.intensityAxisThresholds[1]) {
    return 1;
  }

  return 0;
}

/**
 * Event handler for device orientation events.
 * Calculates directional "intensity" based on device action positions
 *
 * @param {DeviceOrientationEvent} deviceOrientationEvent
 */
function _handleDeviceOrientation(deviceOrientationEvent) {
  const actualY = deviceOrientationEvent.beta;
  const actualX = deviceOrientationEvent.gamma;

  const y = getZeroedY(actualY);
  const x = getZeroedX(actualX);

  gyroInputState.upIntensity = _getNegativeIntensity(y);
  gyroInputState.downIntensity = _getPositiveIntensity(y);
  gyroInputState.leftIntensity = _getNegativeIntensity(x);
  gyroInputState.rightIntensity = _getPositiveIntensity(x);
}

window.addEventListener('deviceorientation', deviceOrientationEvent => {
  // Create a function to return "zeroed" y axis values.
  // When the application starts, assume the y axis of the device is at 0 instead of the "actual" value.
  if (getZeroedY == null) {
    getZeroedY = actualBeta =>
      Math.round(actualBeta - deviceOrientationEvent.beta);
  }

  // Create a function to return "zeroed" x axis values.
  // When the application starts, assume the x axis of the device is at 0 instead of the "actual" value.
  if (getZeroedX == null) {
    getZeroedX = actualGamma =>
      Math.round(actualGamma - deviceOrientationEvent.gamma);
  }

  _handleDeviceOrientation(deviceOrientationEvent);
});
