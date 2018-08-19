import getInputState from './input'

// The intensity given to a keyboard key press. Can be a minimum of 1 and a maximum of 2.
const keyboardInputIntensity = 2

describe('input', () => {
  describe('#getInputState', () => {
    it('Returns the proper state when one key is pressed', () => {
      // Arrange.
      const keyDownEvent = new KeyboardEvent('keydown', { key: 'w' })

      // Act.
      window.dispatchEvent(keyDownEvent)
      const inputState = getInputState()

      // Assert.
      expect(inputState.upIntensity).toBe(keyboardInputIntensity)
    })

    it('Returns the proper state when one key is pressed, and then released', () => {
      // Arrange.
      const keyDownEvent = new KeyboardEvent('keydown', { key: 'w' })
      const keyUpEvent = new KeyboardEvent('keyup', { key: 'w' })

      // Act.
      window.dispatchEvent(keyDownEvent)
      window.dispatchEvent(keyUpEvent)
      const inputState = getInputState()

      // Assert.
      expect(inputState.upIntensity).toBe(0)
    })

    it('Returns the proper state when two keys are pressed', () => {
      // Arrange.
      const keyDownEventW = new KeyboardEvent('keydown', { key: 'w' })
      const keyDownEventD = new KeyboardEvent('keydown', { key: 'd' })

      // Act.
      window.dispatchEvent(keyDownEventW)
      window.dispatchEvent(keyDownEventD)
      const inputState = getInputState()

      // Assert.
      expect(inputState.upIntensity).toBe(keyboardInputIntensity)
      expect(inputState.rightIntensity).toBe(keyboardInputIntensity)
    })

    it('Returns the proper state when two keys are pressed, and then released', () => {
      // Arrange.
      const keyDownEventW = new KeyboardEvent('keydown', { key: 'w' })
      const keyDownEventD = new KeyboardEvent('keydown', { key: 'd' })
      const keyUpEventW = new KeyboardEvent('keyup', { key: 'w' })
      const keyUpEventD = new KeyboardEvent('keyup', { key: 'd' })

      // Act.
      window.dispatchEvent(keyDownEventW)
      window.dispatchEvent(keyDownEventD)
      window.dispatchEvent(keyUpEventW)
      window.dispatchEvent(keyUpEventD)
      const inputState = getInputState()

      // Assert.
      expect(inputState.upIntensity).toBe(0)
      expect(inputState.rightIntensity).toBe(0)
    })
  })
})
