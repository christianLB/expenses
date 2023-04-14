// pages/piano2.js
import Head from "next/head";
import { useRef } from "react";
import useOSMD from "../hooks/piano/useOSMD.tsx";

export default function Piano() {
  const containerRef = useRef(null);
  const { prev, stop, next, play, pause } = useOSMD(
    containerRef,
    "/sample.xml"
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Piano</title>
        <meta name="description" content="piano for all" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-1 p-4 md:p-8">
        <div ref={containerRef} className="osmd-container" />
        <div
          className={"absolute flex center w-1/2 top-0 border justify-around"}
        >
          <button onClick={play}>Play</button>
          <button onClick={pause}>Pause</button>
          <button onClick={stop}>Stop</button>
          <button onClick={prev}>Prev</button>
          <button onClick={next}>Next</button>
          <button onClick={() => setPlaybackSpeed(0.5)}>Speed 0.5x</button>
          <button onClick={() => setPlaybackSpeed(1)}>Speed 1x</button>
          <button onClick={() => setPlaybackSpeed(1.5)}>Speed 1.5x</button>
        </div>
      </main>
    </div>
  );
}
