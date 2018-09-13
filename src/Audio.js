'use strict';

const song = require('../t.json');

// json pitch map to physical note frequency.
// Commented out items are not currently used.
const map = {
  // 70: 932.33,
  69: 880.0,
  // 68: 830.61,
  67: 783.99,
  // 66: 739.99,
  // 65: 698.46,
  // 64: 659.25,
  // 63: 622.25,
  // 62: 587.33,
  // 61: 554.37,
  60: 523.25,
  // 59: 493.88,
  // 58: 466.16,
  57: 440.0,
  // 56: 415.3,
  55: 392.0,
  // 54: 369.99,
  // 53: 349.23,
  52: 329.63,
  // 51: 311.13,
  50: 293.66,
  // 49: 277.18,
  48: 261.63,
  // 47: 246.94,
  // 46: 233.08,
  45: 220.0,
  // 44: 207.65,
  43: 196.0,
  // 42: 185.0,
  // 41: 174.61,
  40: 164.81,
  // 39: 155.56,
  38: 146.83,
  // 37: 138.59,
  36: 130.81,
  // 35: 123.47,
  // 34: 116.54,
  33: 110.0,
  // 32: 103.83,
  31: 98.0,
  // 30: 92.5,
  // 29: 87.31,
  28: 82.41,
  // 27: 77.78,
  26: 73.42,
  // 25: 69.3,
  24: 65.41,
  // 23: 61.74,
  // 22: 58.27,
  21: 55.0,
  // 20: 51.91,
  19: 49.0,
  // 18: 46.25,
  // 17: 43.65,
  16: 41.2
  // 15: 38.89,
  // 14: 36.71, // too low, sounds bad lol
  // 13: 34.65,
  // 12: 32.7,
  // 11: 30.87,
  // 10: 29.14,
  // 9: 27.5,
  // 8: 25.96,
  // 7: 24.5,
  // 6: 23.12,
  // 5: 21.83,
  // 4: 20.6,
  // 3: 19.45,
  // 2: 18.35,
  // 1: 17.32,
  // 0: 16.35
};

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

  music() {
    let out = [];
    let speed = 1000 / (song.beatsPerMinute / 60) / 1000 / 4;
    let lastNode;
    let largestTime;

    song.channels.forEach(channel => {
      let [instrument] = channel.instruments;

      channel.sequence.forEach((pattern, patternIndex) => {
        []
          .concat(
            {
              instrument: 1,
              notes: []
            },
            channel.patterns
          )
          [pattern].notes.forEach(note => {
            note.pitches.forEach(pitch => {
              let [start, stop] = note.points;
              if (!map[pitch]) {
                return;
              }

              let noteDuration = (stop.tick - start.tick) * speed;
              let noteDelay = speed * start.tick + patternIndex * 32 * speed;
              let end = noteDelay + noteDuration;
              let node = this.play(
                map[pitch],
                noteDuration,
                noteDelay,
                instrument.wave,
                0.1
              );

              if (!largestTime) {
                largestTime = end;
              }
              if (!lastNode) {
                lastNode = node;
              }
              if (end >= largestTime) {
                largestTime = end;
                lastNode = node;
              }
            });
          });
      });
    });

    lastNode.onended = () => this.music();
  }

  play(freq = 440, len = 0.1, off = 0, type = 'sine', gain = 0.2) {
    let volume = this.context.createGain();
    volume.connect(this.context.destination);
    volume.gain.value = gain;

    let osc = this.context.createOscillator();
    osc.frequency.value = freq;
    osc.type = type;

    let now = this.context.currentTime;
    osc.connect(volume);
    osc.start(now + off);
    osc.stop(now + off + len);

    return osc;
  }
}
