import getKeyboardInputState from './keyboard-input';

describe('keyboard-input', () => {
  describe('#getKeyboardInputState', () => {
    it('Returns the proper state when one key is pressed', () => {
      // Arrange.
      const keyDownEvent = new KeyboardEvent('keydown', { key: 'w' });

      // Act.
      window.dispatchEvent(keyDownEvent);
      const keyboardInputState = getKeyboardInputState();

      // Assert.
      expect(keyboardInputState.w).toBe(true);
    });

    it('Returns the proper state when one key is pressed, and then released', () => {
      // Arrange.
      const keyDownEvent = new KeyboardEvent('keydown', { key: 'w' });
      const keyUpEvent = new KeyboardEvent('keyup', { key: 'w' });

      // Act.
      window.dispatchEvent(keyDownEvent);
      window.dispatchEvent(keyUpEvent);
      const keyboardInputState = getKeyboardInputState();

      // Assert.
      expect(keyboardInputState.w).toBe(false);
    });

    it('Returns the proper state when two keys are pressed', () => {
      // Arrange.
      const keyDownEventW = new KeyboardEvent('keydown', { key: 'w' });
      const keyDownEventD = new KeyboardEvent('keydown', { key: 'd' });

      // Act.
      window.dispatchEvent(keyDownEventW);
      window.dispatchEvent(keyDownEventD);
      const keyboardInputState = getKeyboardInputState();

      // Assert.
      expect(keyboardInputState.w).toBe(true);
      expect(keyboardInputState.d).toBe(true);
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
      const keyboardInputState = getKeyboardInputState();

      // Assert.
      expect(keyboardInputState.w).toBe(false);
      expect(keyboardInputState.d).toBe(false);
    });
  });
});
