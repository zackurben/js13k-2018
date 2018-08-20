import { gyro } from "./input-variables";

/**
 * The current state of the input.
 * Each value has a minimum of 0, and a maximum of 2.
 */
const gyroInputState = {
  upIntensity: 0,
  downIntensity: 0,
  leftIntensity: 0,
  rightIntensity: 0
};

let getZeroedY = null;
let getZeroedX = null;

export default function getGyroInputState() {
  return gyroInputState;
}

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

function _getPositiveIntensity(axisValue) {
  if (axisValue >= gyro.intensityAxisThresholds[1]) {
    return 1;
  }

  if (axisValue >= gyro.intensityAxisThresholds[2]) {
    return 2;
  }

  return 0;
}

function _getNegativeIntensity(axisValue) {
  if (axisValue <= -gyro.intensityAxisThresholds[2]) {
    return 2;
  }

  if (axisValue <= -gyro.intensityAxisThresholds[1]) {
    return 1;
  }

  return 0;
}

window.addEventListener("deviceorientation", deviceOrientationEvent => {
  if (getZeroedY == null) {
    getZeroedY = actualBeta =>
      Math.round(actualBeta - deviceOrientationEvent.beta);
  }

  if (getZeroedX == null) {
    getZeroedX = actualGamma =>
      Math.round(actualGamma - deviceOrientationEvent.gamma);
  }

  _handleDeviceOrientation(deviceOrientationEvent);
});
