export default class DataDisplay {
  constructor(keyDisplayNodeMap) {
    this.keyDisplayNodeMap = keyDisplayNodeMap;

    this.domState = {};
  }

  showEndSplash(finalScore, finalTime) {
    document.getElementById('splash').classList.remove('hidden');
    document.getElementById('game').classList.add('hidden');
    document.getElementById('start-button').classList.add('hidden');

    const timeBonus = Math.max(1, parseInt(7 * 60 / finalTime));

    document.getElementById('splash-message').innerHTML = `
      <p>
        Score: ${Math.max(1, finalScore)} points<br /><br />
        Time: ${finalTime}s<br /><br /><br />
        Time Bonus: ${timeBonus} X<br /><br /><br />
        Final Score: ${Math.max(1, finalScore) *
          timeBonus} points<br /><br /><br /><br />
        Thanks for playing!
      </p>
    `;
  }

  /**
   * Updates the value of a display node
   *
   * @param {string} key The key of the display node to update.
   * @param {string} value The new value of the display node.
   */
  updateDisplayNode(key, value) {
    // Check if a DOM update is necessary before doing it.
    if (this.domState[key] === value) {
      return;
    }

    if (key !== 'level') {
      this.domState[key] = value;
      this.keyDisplayNodeMap[key].innerHTML = value;

      return;
    }

    let levelValue;

    switch (value) {
      case 1: {
        levelValue = '1: Physical';
        break;
      }

      case 2: {
        levelValue = '2: Data Link';
        break;
      }

      case 3: {
        levelValue = '3: Network';
        break;
      }

      case 4: {
        levelValue = '4: Transport';
        break;
      }

      case 5: {
        levelValue = '5: Session';
        break;
      }

      case 6: {
        levelValue = '6: Presentation';
        break;
      }

      case 7: {
        levelValue = '7: Application';
        break;
      }

      default: {
        levelValue = value;
      }
    }

    this.domState[key] = levelValue;
    this.keyDisplayNodeMap[key].innerHTML = levelValue;
  }
}
