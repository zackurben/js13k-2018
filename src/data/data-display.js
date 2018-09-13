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

    this.domState[key] = value;
    this.keyDisplayNodeMap[key].innerHTML = value;
  }
}
