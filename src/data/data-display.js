export default class DataDisplay {
  constructor(keyDisplayNodeMap) {
    this.keyDisplayNodeMap = keyDisplayNodeMap;

    this.domState = {};
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
