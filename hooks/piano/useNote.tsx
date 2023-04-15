import { useState, useEffect } from "react";

const useNote = () => {
  const fundamentalNoteToName = (fundamentalNote) => {
    const noteNames = ["C", "D", "E", "F", "G", "A", "B"];
    return noteNames[fundamentalNote % noteNames.length];
  };

  const getNoteInfo = (note) => {
    if (note.isRest()) {
      return {
        noteName: "Rest",
        accidental: null,
        octave: null,
        duration: note.length.toString(),
        midiNoteNumber: null,
      };
    }

    const pitch = note.pitch;
    const noteNames = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
    const noteName = noteNames[pitch.halfTone % 12]; // Corrected note name calculation
    const accidental = pitch.accidental;
    const octave = pitch.octave;
    const duration = note.length.toString();

    return {
      noteName,
      accidental,
      octave,
      duration,
      midiNoteNumber: pitch.halfTone,
    };
  };

  const noteToMidi = (noteName, accidental, octave) => {
    const noteMap = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    const accidentalMap = { bb: -2, b: -1, "": 0, "#": 1, x: 2 };
    const baseNote = noteMap[noteName] || 0;
    const baseAccidental = accidentalMap[accidental] || 0;
    const midiNoteNumber = (octave + 1) * 12 + baseNote + baseAccidental;
    return midiNoteNumber;
  };

  return { getNoteInfo };
};

export default useNote;
