/**
 * The current state of the input.
 */
const keyboardInputState = {
  w: false,
  s: false,
  a: false,
  d: false
};

/**
 * Gets the current keyboard input state.
 *
 * @returns {Object} The current keyboard input state.
 */
export default function getKeyboardInputState() {
  return keyboardInputState;
}

/**
 * Event handler for keydown events.
 *
 * @param {KeyboardEvent} keyDownEvent
 */
function _handleKeyDown(keyDownEvent) {
  const key = keyDownEvent.key;

  switch (key) {
    case 'w': {
      keyboardInputState.w = true;
      break;
    }

    case 's': {
      keyboardInputState.s = true;
      break;
    }

    case 'a': {
      keyboardInputState.a = true;
      break;
    }

    case 'd': {
      keyboardInputState.d = true;
      break;
    }
  }
}

/**
 * Event handler for keyup events.
 *
 * @param {KeyboardEvent} keyUpEvent
 */
function _handleKeyUp(keyUpEvent) {
  const key = keyUpEvent.key;

  switch (key) {
    case 'w': {
      keyboardInputState.w = false;
      break;
    }

    case 's': {
      keyboardInputState.s = false;
      break;
    }

    case 'a': {
      keyboardInputState.a = false;
      break;
    }

    case 'd': {
      keyboardInputState.d = false;
      break;
    }
  }
}

window.addEventListener('keydown', _handleKeyDown);
window.addEventListener('keyup', _handleKeyUp);
