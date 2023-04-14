import { OpenSheetMusicDisplay, Cursor } from "opensheetmusicdisplay";
import { useState, useEffect } from "react";
import cursorStyles from "../../styles/Cursor.module.css";

const useCursor = (
  osmd: OpenSheetMusicDisplay | null,
  container: HTMLElement | null,
  systemHeight
  //style: any
) => {
  const [cursor, setCursor] = useState<Cursor | undefined>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [customCursor, setCustomCursor] = useState(null);

  // Initialize the custom cursor
  const initializeCursor = () => {
    const cursorInstance: Cursor | undefined = osmd?.cursor;
    cursorInstance?.show();

    cursorInstance?.cursorElement.classList.add(cursorStyles.custom);
    setCursor(cursorInstance);
    console.log(cursorInstance);
    console.log("systemHeight", systemHeight);
  };

  // Move cursor to the next note
  const next = () => {
    if (cursor) {
      cursor.next();
      //updateCursorPosition();
    }
  };

  // Move cursor to the previous note
  const prev = () => {
    if (cursor) {
      cursor.previous();
      //updateCursorPosition();
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
  };
};

export default useCursor;
