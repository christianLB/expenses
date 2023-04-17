import { useState, useEffect } from "react";

const useNote = (osmd) => {
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

  const setGraphicalNoteColor = (sourceNote, color) => {
    if (
      sourceNote &&
      sourceNote.parentStaffEntry &&
      sourceNote.parentStaffEntry.graphicalStaffEntry
    ) {
      const graphicalNotes =
        sourceNote.parentStaffEntry.graphicalStaffEntry.findGraphicalNotesBySourceNote(
          sourceNote
        );
      for (const graphicalNote of graphicalNotes) {
        graphicalNote.setNoteheadColor(color);
      }
    }
  };

  const highlight = (notes, color) => {
    if (!notes) {
      return;
    }

    if (!Array.isArray(notes)) {
      notes = [notes];
    }

    for (const note of notes) {
      setGraphicalNoteColor(note, color);
    }

    osmd.render();
  };

  const getNoteName = (midiNumber) => {
    const note = noteNames[midiNumber % 12];
    return note;
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

    const noteName = getNoteName(pitch.halfTone); //noteNames[pitch.halfTone % 12]; // Corrected note name calculation
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

  return { getNoteInfo, highlight, getNoteName };
};

export default useNote;
