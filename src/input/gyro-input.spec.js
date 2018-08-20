import getGyroInputState from "./gyro-input";
import { gyro } from "./input-variables";

describe("gyro-input", () => {
  describe("#getGyroInputState", () => {
    beforeAll(() => {
      // "Zeroing out" the gyro.
      // Using a generic 'Event' because JSDom does not support the DeviceOrientation constructor.
      const deviceOrientationEvent = new Event("deviceorientation");
      Object.defineProperties(deviceOrientationEvent, {
        beta: { value: 0, writable: false },
        gamma: { value: 0, writable: false }
      });
      window.dispatchEvent(deviceOrientationEvent);
    });

    it("Returns the proper state when the device is oriented in the dead zone", () => {
      // Arrange.

      // Using a generic 'Event' because JSDom does not support the DeviceOrientation constructor.
      const deviceOrientationEvent = new Event("deviceorientation");
      Object.defineProperties(deviceOrientationEvent, {
        beta: { value: 0, writable: false },
        gamma: { value: 0, writable: false }
      });

      // Act.
      window.dispatchEvent(deviceOrientationEvent);
      const gyroInputState = getGyroInputState();

      // Assert.
      expect(gyroInputState.upIntensity).toBe(0);
      expect(gyroInputState.downIntensity).toBe(0);
      expect(gyroInputState.leftIntensity).toBe(0);
      expect(gyroInputState.rightIntensity).toBe(0);
    });

    it("Returns the proper state when the device is oriented in the 'up' direction with an intensity of 1", () => {
      // Arrange.

      // Using a generic 'Event' because JSDom does not support the DeviceOrientation constructor.
      const deviceOrientationEvent = new Event("deviceorientation");
      Object.defineProperties(deviceOrientationEvent, {
        beta: { value: -gyro.intensityAxisThresholds[1], writable: false },
        gamma: { value: 0, writable: false }
      });

      // Act.
      window.dispatchEvent(deviceOrientationEvent);
      const gyroInputState = getGyroInputState();

      // Assert.
      expect(gyroInputState.upIntensity).toBe(1);
      expect(gyroInputState.downIntensity).toBe(0);
      expect(gyroInputState.leftIntensity).toBe(0);
      expect(gyroInputState.rightIntensity).toBe(0);
    });

    it("Returns the proper state when the device is oriented in the 'up' direction with an intensity of 2", () => {
      // Arrange.

      // Using a generic 'Event' because JSDom does not support the DeviceOrientation constructor.
      const deviceOrientationEvent = new Event("deviceorientation");
      Object.defineProperties(deviceOrientationEvent, {
        beta: { value: -gyro.intensityAxisThresholds[2], writable: false },
        gamma: { value: 0, writable: false }
      });

      // Act.
      window.dispatchEvent(deviceOrientationEvent);
      const gyroInputState = getGyroInputState();

      // Assert.
      expect(gyroInputState.upIntensity).toBe(2);
      expect(gyroInputState.downIntensity).toBe(0);
      expect(gyroInputState.leftIntensity).toBe(0);
      expect(gyroInputState.rightIntensity).toBe(0);
    });
  });
});
