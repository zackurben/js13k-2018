// Minimum amount of axis movement to be considered an "intensity 1" movement.
const intensity1Threshold = 10;

// Minimum amount of axis movement to be considered an "intensity 2" movement.
const intensity2Threshold = 20;

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
  if (axisValue >= intensity1Threshold) {
    return 1;
  }

  if (axisValue >= intensity2Threshold) {
    return 2;
  }

  return 0;
}

function _getNegativeIntensity(axisValue) {
  if (axisValue <= -intensity2Threshold) {
    return 2;
  }

  if (axisValue <= -intensity1Threshold) {
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
