import getInputState from './input';
import { gyro, keyboard } from './input-variables';
import Input from './input';

describe('input', () => {
  let input;

  beforeAll(() => {
    input = new Input();
  });

  describe('#getInputState', () => {
    beforeAll(() => {
      // "Zeroing out" the gyro.
      // Using a generic 'Event' because JSDom does not support the DeviceOrientation constructor.
      const deviceOrientationEvent = new Event('deviceorientation');
      Object.defineProperties(deviceOrientationEvent, {
        beta: { value: 0, writable: false },
        gamma: { value: 0, writable: false }
      });
      window.dispatchEvent(deviceOrientationEvent);
    });

    it('Returns the proper state when one key is pressed', () => {
      // Arrange.
      const keyDownEvent = new KeyboardEvent('keydown', { key: 'w' });

      // Act.
      window.dispatchEvent(keyDownEvent);
      const inputState = input._getInputState();

      // Assert.
      expect(inputState.upIntensity).toBe(keyboard.intensity);
    });

    it('Returns the proper state when one key is pressed, and then released', () => {
      // Arrange.
      const keyDownEvent = new KeyboardEvent('keydown', { key: 'w' });
      const keyUpEvent = new KeyboardEvent('keyup', { key: 'w' });

      // Act.
      window.dispatchEvent(keyDownEvent);
      window.dispatchEvent(keyUpEvent);
      const inputState = input._getInputState();

      // Assert.
      expect(inputState.upIntensity).toBe(0);
    });

    it('Returns the proper state when two keys are pressed', () => {
      // Arrange.
      const keyDownEventW = new KeyboardEvent('keydown', { key: 'w' });
      const keyDownEventD = new KeyboardEvent('keydown', { key: 'd' });

      // Act.
      window.dispatchEvent(keyDownEventW);
      window.dispatchEvent(keyDownEventD);
      const inputState = input._getInputState();

      // Assert.
      expect(inputState.upIntensity).toBe(keyboard.intensity);
      expect(inputState.rightIntensity).toBe(keyboard.intensity);
    });

    it('Returns the proper state when two keys are pressed, and then released', () => {
      // Arrange.
      const keyDownEventW = new KeyboardEvent('keydown', { key: 'w' });
      const keyDownEventD = new KeyboardEvent('keydown', { key: 'd' });
      const keyUpEventW = new KeyboardEvent('keyup', { key: 'w' });
      const keyUpEventD = new KeyboardEvent('keyup', { key: 'd' });

      // Act.
      window.dispatchEvent(keyDownEventW);
      window.dispatchEvent(keyDownEventD);
      window.dispatchEvent(keyUpEventW);
      window.dispatchEvent(keyUpEventD);
      const inputState = input._getInputState();

      // Assert.
      expect(inputState.upIntensity).toBe(0);
      expect(inputState.rightIntensity).toBe(0);
    });

    it('Returns the proper state when the device is oriented in the dead zone', () => {
      // Arrange.

      // Using a generic 'Event' because JSDom does not support the DeviceOrientation constructor.
      const deviceOrientationEvent = new Event('deviceorientation');
      Object.defineProperties(deviceOrientationEvent, {
        beta: { value: 0, writable: false },
        gamma: { value: 0, writable: false }
      });

      // Act.
      window.dispatchEvent(deviceOrientationEvent);
      const inputState = input._getInputState();

      // Assert.
      expect(inputState.upIntensity).toBe(0);
      expect(inputState.downIntensity).toBe(0);
      expect(inputState.leftIntensity).toBe(0);
      expect(inputState.rightIntensity).toBe(0);
    });

    it("Returns the proper state when the device is oriented in the 'up' direction with an intensity of 1", () => {
      // Arrange.

      // Using a generic 'Event' because JSDom does not support the DeviceOrientation constructor.
      const deviceOrientationEvent = new Event('deviceorientation');
      Object.defineProperties(deviceOrientationEvent, {
        beta: { value: -gyro.intensityAxisThresholds[1], writable: false },
        gamma: { value: 0, writable: false }
      });

      // Act.
      window.dispatchEvent(deviceOrientationEvent);
      const inputState = input._getInputState();

      // Assert.
      expect(inputState.upIntensity).toBe(1);
      expect(inputState.downIntensity).toBe(0);
      expect(inputState.leftIntensity).toBe(0);
      expect(inputState.rightIntensity).toBe(0);
    });

    it("Returns the proper state when the device is oriented in the 'up' direction with an intensity of 2", () => {
      // Arrange.

      // Using a generic 'Event' because JSDom does not support the DeviceOrientation constructor.
      const deviceOrientationEvent = new Event('deviceorientation');
      Object.defineProperties(deviceOrientationEvent, {
        beta: { value: -gyro.intensityAxisThresholds[2], writable: false },
        gamma: { value: 0, writable: false }
      });

      // Act.
      window.dispatchEvent(deviceOrientationEvent);
      const inputState = input._getInputState();

      // Assert.
      expect(inputState.upIntensity).toBe(2);
      expect(inputState.downIntensity).toBe(0);
      expect(inputState.leftIntensity).toBe(0);
      expect(inputState.rightIntensity).toBe(0);
    });
  });
});
