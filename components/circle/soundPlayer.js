// components/circle/soundPlayer.js
import * as Tone from "tone";

export const playScale = (notes) => {
  const synth = new Tone.Synth().toDestination();
  const now = Tone.now();
  notes.forEach((note, i) => {
    synth.triggerAttackRelease(note, "8n", now + i * 0.5);
  });
};

export const playChord = (notes) => {
  const synth = new Tone.PolySynth().toDestination();
  synth.triggerAttackRelease(notes, "1n");
};