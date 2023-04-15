import { OpenSheetMusicDisplay, Cursor } from "opensheetmusicdisplay";
import { useState, useEffect } from "react";
import cursorStyles from "../../styles/Cursor.module.css";
import useNote from "./useNote.tsx";
import useScoreHighlighter from "./useScoreHighlighter.tsx";

const useCursor = (
  osmd: OpenSheetMusicDisplay | null,
  container: HTMLElement | null,
  systemHeight
  //style: any
) => {
  const [cursor, setCursor] = useState<Cursor | undefined>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(12);
  const [currentMeasure, setCurrentMeasure] = useState<Number>(-1);
  const [currentBeatNotes, setCurrentBeatNotes] = useState([]);
  const { getNoteInfo, highlight } = useNote(osmd);

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
      const notes = getNotesForCurrentBeat();
      setCurrentBeatNotes(notes);
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

  const getNoteDuration = (voiceEntry) => {
    if (!voiceEntry || !voiceEntry.Notes || voiceEntry.Notes.length === 0) {
      return 0;
    }

    const duration = voiceEntry.Notes[0].Length.realValue;
    return duration;
  };

  // Play the score from the current position
  const play = async () => {
    if (cursor && !isPlaying) {
      cursor.show();
      setIsPlaying(true);
    }
  };

  // Add this useEffect inside your useCursor hook
  useEffect(() => {
    let timeoutId;

    const playNextNote = () => {
      if (isPlaying) {
        next();
        const notes = getNotesForCurrentBeat();

        if (notes.length > 0) {
          const minDuration = Math.min(
            ...notes.map((note) => note.length.realValue)
          );

          const durationInMilliseconds =
            (minDuration * 60 * 1000) / playbackSpeed;
          timeoutId = setTimeout(playNextNote, durationInMilliseconds);
        } else {
          setIsPlaying(false);
        }
      }
    };

    if (isPlaying) {
      playNextNote();
    } else {
      clearTimeout(timeoutId);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isPlaying, playbackSpeed]);

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

  const handleMidiEvent = (midiEvent) => {
    console.log("Midi event:", midiEvent);
    // const progressIndices = {
    //   left: leftHandProgress,
    //   right: rightHandProgress,
    //   both: Math.min(leftHandProgress, rightHandProgress),
    // };

    // // Pass notes and progressIndices as arguments to compareMidiEventWithNote
    // const result = true; //compareMidiEventWithNote(midiEvent, notes, progressIndices);
    // console.log("Comparison result:", result);

    // // Check if result is an object with isCorrect and hand properties
    // if (!result || typeof result !== "object") {
    //   return;
    // }

    // const { isCorrect, hand } = result;
    // const note = notes[progressIndices[hand]];

    // if (note) {
    //   updateNoteStyling(osmd, note.sourceNote, hand, isCorrect);
    // }

    //return result;
  };

  return {
    next,
    prev,
    play,
    pause,
    reset,
    setSpeed,
    initializeCursor,
    handleMidiEvent,
    stop: () => setIsPlaying(false),
    isPlaying,
    currentMeasure,
    currentBeatNotes,
    currentBeatNotesInfo: currentBeatNotes.map((note) => getNoteInfo(note)),
  };
};

export default useCursor;
