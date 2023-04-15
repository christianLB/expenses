import { OpenSheetMusicDisplay, Cursor } from "opensheetmusicdisplay";
import { useState, useEffect } from "react";
import cursorStyles from "../../styles/Cursor.module.css";
import useNote from "./useNote.tsx";

const useCursor = (
  osmd: OpenSheetMusicDisplay | null,
  container: HTMLElement | null,
  systemHeight
  //style: any
) => {
  const [cursor, setCursor] = useState<Cursor | undefined>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentMeasure, setCurrentMeasure] = useState<Number>(-1);
  const [currentBeatNotes, setCurrentBeatNotes] = useState([]);
  const { getNoteInfo } = useNote();

  const getCurrentMeasureIndex = () => {
    if (cursor && cursor.iterator) {
      const iterator = cursor.iterator;
      const currentMeasureIndex = iterator.currentMeasureIndex;
      return currentMeasureIndex;
    }
    return -1;
  };

  // Initialize the custom cursor
  const initializeCursor = () => {
    const cursorInstance: Cursor | undefined = osmd?.cursor;
    cursorInstance?.show();
    cursorInstance?.cursorElement.classList.add(cursorStyles.custom);
    setCursor(cursorInstance);
  };

  const getNotesForCurrentBeat = () => {
    if (osmd && osmd.cursor) {
      const iterator = osmd.cursor.iterator;

      if (iterator.currentVoiceEntries) {
        const notes = iterator.currentVoiceEntries.flatMap(
          (voiceEntry) => voiceEntry.Notes
        );

        return notes;
      }
    }

    return [];
  };

  // Move cursor to the next note
  const next = () => {
    if (cursor) {
      cursor.next();
      const measure = getCurrentMeasureIndex();
      measure != currentMeasure && setCurrentMeasure(measure);
      setCurrentBeatNotes(getNotesForCurrentBeat());
    }
  };

  // Move cursor to the previous note
  const prev = () => {
    if (cursor) {
      cursor.previous();
      const measure = getCurrentMeasureIndex();
      measure != currentMeasure && setCurrentMeasure(measure);
      setCurrentBeatNotes(getNotesForCurrentBeat());
    }
  };

  // Play the score from the current position
  const play = () => {
    if (cursor && !isPlaying) {
      cursor.show();
      setIsPlaying(true);
      const playLoop = () => {
        if (isPlaying) {
          next();
          setTimeout(
            playLoop,
            cursor.currentVoiceEntry.Duration.realValue *
              1000 *
              (1 / playbackSpeed)
          );
        }
      };
      playLoop();
    }
  };

  // Pause the playback
  const pause = () => {
    setIsPlaying(false);
  };

  // Move cursor to the beginning of the score
  const reset = () => {
    if (cursor) {
      cursor.reset();
      //updateCursorPosition();
    }
  };

  // Change the playback speed (1 is normal speed)
  const setSpeed = (speed) => {
    setPlaybackSpeed(speed);
  };

  return {
    next,
    prev,
    play,
    pause,
    reset,
    setSpeed,
    initializeCursor,
    currentMeasure,
    currentBeatNotes,
    currentBeatNotesInfo: currentBeatNotes.map((note) => getNoteInfo(note)),
  };
};

export default useCursor;
