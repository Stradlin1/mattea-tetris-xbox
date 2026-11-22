import store from '../store';

// Original 8-bit sound effects synthesized in the browser.
// No sampled audio, third-party files, or downloads are required.
const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
const hasWebAudioAPI = { data: !!AudioContextConstructor };
const music = {};
let context = null;

const play = (notes, volume = 0.028) => {
  if (!hasWebAudioAPI.data || !store.getState().get('music')) {
    return;
  }
  try {
    if (!context) {
      context = new AudioContextConstructor();
    }
    if (context.state === 'suspended') {
      context.resume().catch(() => {});
    }
    const base = context.currentTime + 0.012;
    notes.forEach(note => {
      const start = base + note[1];
      const duration = note[2];
      const osc = context.createOscillator();
      const envelope = context.createGain();

      osc.type = note[3] || 'square';
      osc.frequency.setValueAtTime(note[0], start);
      if (note[4]) {
        osc.frequency.exponentialRampToValueAtTime(note[4], start + duration);
      }
      envelope.gain.setValueAtTime(0.0001, start);
      envelope.gain.linearRampToValueAtTime(volume, start + 0.006);
      envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(envelope);
      envelope.connect(context.destination);
      osc.start(start);
      osc.stop(start + duration + 0.015);
      osc.onended = () => {
        osc.disconnect();
        envelope.disconnect();
      };
    });
  } catch (error) {
    hasWebAudioAPI.data = false;
    if (window.console && window.console.warn) {
      window.console.warn('8-bit audio unavailable:', error);
    }
  }
};

// Each cue is an original short sequence; pitch values are in hertz.
// Note format: [frequency, delay, duration, waveform, optional end frequency].
music.start = () => play([
  [523.25, 0, 0.08],
  [659.25, 0.10, 0.08],
  [783.99, 0.20, 0.09],
  [1046.50, 0.31, 0.18, 'triangle'],
], 0.035);

music.move = () => play([[196, 0, 0.028]], 0.012);
music.rotate = () => play([
  [523.25, 0, 0.045],
  [783.99, 0.043, 0.07, 'triangle'],
], 0.022);
music.fall = () => play([
  [659.25, 0, 0.09, 'square', 164.81],
  [130.81, 0.09, 0.045],
], 0.035);
music.clear = () => play([
  [523.25, 0, 0.085],
  [659.25, 0.09, 0.085],
  [783.99, 0.18, 0.085],
  [1046.50, 0.27, 0.19, 'triangle'],
], 0.036);
music.gameover = () => play([
  [523.25, 0, 0.13],
  [392, 0.15, 0.13],
  [329.63, 0.30, 0.13],
  [196, 0.46, 0.32, 'triangle'],
], 0.029);

module.exports = { hasWebAudioAPI, music };
