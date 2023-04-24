import Head from "next/head";
import { useRef } from "react";
import useOSMD from "../hooks/piano/useOSMD.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStop,
  faStepBackward,
  faStepForward,
  faMinus,
  faEquals,
  faRefresh,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import PianoRoll from "../components/piano/PianoRoll.tsx";

export default function Piano() {
  const containerRef = useRef(null);
  const {
    osmd,
    prev,
    stop,
    next,
    play,
    pause,
    reset,
    getNoteName,
    isPlaying,
    currentMeasure,
    currentBeatNotesInfo,
    midiEvents,
    currentNotesOn,
  } = useOSMD(containerRef, "/sample.xml");

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Piano</title>
        <meta name="description" content="piano for all" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-1 p-4 md:p-8">
        <div ref={containerRef} className="osmd-container" />
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10 text-center font-cinzel text-2xl">
          <div>
            Measure: {currentMeasure} | Notes:{" "}
            {currentBeatNotesInfo.map((note) => note.noteName).join(", ")}
          </div>
          <div>
            current notes:{" "}
            {currentNotesOn.map((note) => getNoteName(note)).join(", ")}
          </div>
        </div>
        <div className="fixed top-4 right-4 flex flex-row gap-4 bg-white rounded-lg p-4 shadow-lg">
          <div className="flex gap-4 mb-4">
            {!isPlaying && (
              <button onClick={play}>
                <FontAwesomeIcon icon={faPlay} />
              </button>
            )}
            {isPlaying && (
              <button onClick={stop}>
                <FontAwesomeIcon icon={faStop} />
              </button>
            )}
            <button onClick={pause} disabled={!isPlaying}>
              <FontAwesomeIcon icon={faPause} />
            </button>
            <button onClick={reset}>
              <FontAwesomeIcon icon={faRefresh} />
            </button>
          </div>
          <div className="flex gap-4 mb-4">
            <button onClick={prev}>
              <FontAwesomeIcon icon={faStepBackward} />
            </button>
            <button onClick={next}>
              <FontAwesomeIcon icon={faStepForward} />
            </button>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setPlaybackSpeed(0.5)}>
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <button onClick={() => setPlaybackSpeed(1)}>
              <FontAwesomeIcon icon={faEquals} />
            </button>
            <button onClick={() => setPlaybackSpeed(1.5)}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </div>
        <div className={"fixed bottom-4 cneter"}>
          {/* <PianoRoll midiEvents={midiEvents} /> */}
        </div>
      </main>
      <style jsx>{`
        .osmd-container {
          margin-bottom: 1rem;
        }

        .font-cinzel {
          font-family: "Cinzel", serif;
        }

        button {
          background: #ffffff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 1rem;
          cursor: pointer;
          box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.1),
            -6px -6px 12px rgba(255, 255, 255, 0.7);
          transition: all 0.2s ease;
          width: 50px;
          height: 50px;
        }

        button:hover {
          box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.1),
            inset -4px -4px 8px rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </div>
  );
}
