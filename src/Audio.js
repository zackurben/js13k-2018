'use strict';

export default class Audio {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
  }

  pickup() {
    this.play(440, 0.05);
    this.play(550, 0.05, 0.05);
  }

  play(freq = 440, len = 0.1, off = 0, type = 'sine') {
    let osc = this.context.createOscillator();
    osc.frequency.value = freq;
    osc.type = type;

    let now = this.context.currentTime;
    osc.connect(this.context.destination);
    osc.start(now + off);
    osc.stop(now + off + len);
  }
}
