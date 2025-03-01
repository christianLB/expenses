// components/circle/KeyDetails.jsx
import React from "react";
import { playScale, playChord } from "./soundPlayer";

const KeyDetails = ({ keyName }) => {
  const keyInfo = {
    "C Major": {
      notes: ["C", "D", "E", "F", "G", "A", "B"],
      chords: ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
      relatives: ["A Minor"],
      sharps: 0,
    },
    "G Major": {
      notes: ["G", "A", "B", "C", "D", "E", "F#"],
      chords: ["G", "Am", "Bm", "C", "D", "Em", "F#dim"],
      relatives: ["E Minor"],
      sharps: 1,
    },
    // Add more keys here
  };

  const info = keyInfo[keyName] || {};

  return (
    <div className="key-details">
      <h2>{keyName}</h2>
      <p>Notas: {info.notes?.join(", ")}</p>
      <p>Acordes: {info.chords?.join(", ")}</p>
      <p>Relativas: {info.relatives?.join(", ")}</p>
      <p>Alteraciones: {info.sharps} sostenidos</p>
      <button onClick={() => playScale(info.notes)}>Reproducir Escala</button>
      <button onClick={() => playChord(info.chords.slice(0, 3))}>
        Reproducir Acorde
      </button>
    </div>
  );
};

export default KeyDetails;
