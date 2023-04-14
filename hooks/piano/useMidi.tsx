import { useEffect, useState } from "react";

export default function useMidi() {
  const [midi, setMidi] = useState(null);
  const [midiEvents, setMidiEvents] = useState<any>([]);

  useEffect(() => {
    async function loadWebMidi() {
      const webMidiModule = await import("webmidi");
      setMidi(webMidiModule.WebMidi);
    }

    loadWebMidi();
  }, []);

  const determineHand = (noteNumber) => {
    // Define the threshold note number for left and right hands (e.g. Middle C is 60)
    const threshold = 60;

    if (noteNumber < threshold) {
      return "left";
    } else {
      return "right";
    }
  };

  const handleMidiMessage = (event) => {
    const [type, note, velocity] = event.data;
    const isNoteOn = (type & 0xf0) === 0x90 && velocity > 0;
    const isNoteOff =
      (type & 0xf0) === 0x80 || ((type & 0xf0) === 0x90 && velocity === 0);

    if (isNoteOn) {
      const midiEvent = {
        type: "note-on",
        note,
        velocity: velocity / 127,
        hand: determineHand(note),
      };
      setMidiEvents((prevEvents) => [...prevEvents, midiEvent]);
    } else if (isNoteOff) {
      const midiEvent = {
        type: "note-off",
        note,
        hand: determineHand(note),
      };
      setMidiEvents((prevEvents) => [...prevEvents, midiEvent]);
    }
  };

  useEffect(() => {
    if (!midi) return;

    midi.enable((err) => {
      if (err) {
        console.error("midi could not be enabled:", err);
        return;
      }

      console.log("midi enabled!");
      console.log("Input devices:", midi.inputs);
      console.log("Output devices:", midi.outputs);

      // Add event listener for each input device
      midi.inputs.forEach((input) => {
        input.addListener("midimessage", "all", handleMidiMessage);
      });

      // Clean up event listeners when the component is unmounted
      return () => {
        midi.inputs.forEach((input) => {
          input.removeListener("midimessage", "all", handleMidiMessage);
        });
      };
    });
  }, [midi]);

  return { midi, midiEvents };
}