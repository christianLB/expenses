import { useEffect, useRef, useState } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import Head from "next/head";
import useMidi from "../hooks/piano/useMidi.tsx";
import PianoRoll from "../components/piano/PianoRoll.tsx";

export default function Piano() {
  const sheetMusicContainerRef = useRef();
  const { midiInput, midiEvents } = useMidi();

  // useEffect(() => {
  //   if (midiInput) {
  //     midiInput.addListener("midimessage", "all", (e) => {
  //       const [type, note, velocity] = e.data;
  //       console.log("MIDI message received:", { type, note, velocity });
  //       // Save the MIDI message to the state
  //       setMidiEvents((prevMessages) => [
  //         ...prevMessages,
  //         { type, note, velocity },
  //       ]);
  //     });

  //     return () => {
  //       if (midiInput) {
  //         midiInput.removeListener("midimessage", "all");
  //       }
  //     };
  //   }
  // }, [midiInput]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const xmlContent = e.target.result;

        if (sheetMusicContainerRef.current) {
          const osmd = new OpenSheetMusicDisplay(
            sheetMusicContainerRef.current,
            {
              backend: "svg",
              drawTitle: true,
            }
          );

          try {
            await osmd.load(xmlContent);
            osmd.render();
          } catch (error) {
            console.error("Error rendering MusicXML:", error);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Piano</title>
        <meta name="description" content="piano for all" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-1 p-4 md:p-8">
        <input
          type="file"
          accept="text/xml,.xml,.musicxml"
          onChange={handleFileUpload}
        />
        <div ref={sheetMusicContainerRef}></div>
        <PianoRoll midiEvents={midiEvents} />
      </main>
    </div>
  );
}
