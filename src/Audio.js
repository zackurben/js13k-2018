'use strict';

export default class Audio {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.volume = this.context.createGain();
    this.volume.connect(this.context.destination);
    this.volume.gain.value = 0.2;
  }

  pickup() {
    this.play(440, 0.05);
    this.play(550, 0.05, 0.05);
  }

  load() {
    this.play(293.66, 0.2, 0, 'square');
    this.play(349.23, 0.2, 0.2, 'square');
    this.play(440.0, 0.2, 0.4, 'square');
  }

  music() {}

  play(freq = 440, len = 0.1, off = 0, type = 'sine') {
    let osc = this.context.createOscillator();
    osc.frequency.value = freq;
    osc.type = type;

    let now = this.context.currentTime;
    osc.connect(this.volume);
    osc.start(now + off);
    osc.stop(now + off + len);
  }
}
