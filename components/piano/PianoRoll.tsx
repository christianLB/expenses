import React, { useEffect, useRef } from "react";
import styles from "./PianoRoll.module.css";

const PIANO_ROLL_HEIGHT = 400;
const PIANO_ROLL_WIDTH = 800;
const WHITE_KEY_HEIGHT = PIANO_ROLL_HEIGHT;
const BLACK_KEY_HEIGHT = PIANO_ROLL_HEIGHT * 0.6;
const TOTAL_WHITE_KEYS = 52;

const WHITE_KEY_WIDTH = PIANO_ROLL_WIDTH / TOTAL_WHITE_KEYS;
const BLACK_KEY_WIDTH = WHITE_KEY_WIDTH * 0.6;

interface PianoRollProps {
  midiEvents: any[];
}

const isBlackKey = (keyIndex: number): boolean => {
  return [1, 3, 6, 8, 10].includes(keyIndex % 12);
};

const drawKey = (
  ctx: CanvasRenderingContext2D,
  x: number,
  keyWidth: number,
  isBlack: boolean,
  highlight: boolean,
  velocity: number = 0
) => {
  ctx.fillStyle = highlight
    ? `rgba(255, 0, 0, ${velocity})`
    : isBlack
    ? "black"
    : "white";
  ctx.fillRect(x, 0, keyWidth, isBlack ? BLACK_KEY_HEIGHT : WHITE_KEY_HEIGHT);
  ctx.strokeStyle = "black";
  ctx.strokeRect(x, 0, keyWidth, isBlack ? BLACK_KEY_HEIGHT : WHITE_KEY_HEIGHT);
};

const PianoRoll: React.FC<PianoRollProps> = ({ midiEvents }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawPiano = (ctx: CanvasRenderingContext2D) => {
    let whiteKeyIndex = 0;

    // Draw white keys first
    for (let i = 21; i <= 108; i++) {
      const keyIndex = i % 12;
      const keyIsBlack = isBlackKey(keyIndex);
      const keyX = whiteKeyIndex * WHITE_KEY_WIDTH;

      if (!keyIsBlack) {
        drawKey(ctx, keyX, WHITE_KEY_WIDTH, false, false);
        whiteKeyIndex++;
      }
    }

    // Draw black keys on top of white keys
    whiteKeyIndex = 0;
    for (let i = 21; i <= 108; i++) {
      const keyIndex = i % 12;
      const keyIsBlack = isBlackKey(keyIndex);

      if (!keyIsBlack) {
        whiteKeyIndex++;
      } else {
        const keyX =
          (whiteKeyIndex - 1) * WHITE_KEY_WIDTH + WHITE_KEY_WIDTH * 0.5;
        drawKey(ctx, keyX, BLACK_KEY_WIDTH, true, false);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, PIANO_ROLL_WIDTH, PIANO_ROLL_HEIGHT);
    drawPiano(ctx);

    midiEvents.forEach((event) => {
      const note = event.note - 21;
      if (note < 0 || note > 87) return;

      let whiteKeyIndex = 0;
      let blackKeyOffset = 0;
      for (let i = 0; i <= note; i++) {
        const keyIsBlack = isBlackKey((i + 21) % 12);
        if (!keyIsBlack) {
          whiteKeyIndex++;
        }
        if (i === note) {
          blackKeyOffset = keyIsBlack ? WHITE_KEY_WIDTH * 0.5 : 0;
        }
      }
      const keyIsBlack = isBlackKey((note + 21) % 12);
      const x = (whiteKeyIndex - 1) * WHITE_KEY_WIDTH + blackKeyOffset;
      const keyWidth = keyIsBlack ? BLACK_KEY_WIDTH : WHITE_KEY_WIDTH;

      drawKey(
        ctx,
        x,
        keyWidth,
        keyIsBlack,
        event.type === "note-on",
        event.velocity
      );

      if (event.type === "note-off") {
        drawKey(ctx, x, keyWidth, keyIsBlack, false);

        // Redraw the entire keyboard if the key is white
        if (!keyIsBlack) {
          drawPiano(ctx);
        }
      }
    });
  }, [midiEvents]);

  return (
    <canvas
      ref={canvasRef}
      className="piano-roll"
      width={PIANO_ROLL_WIDTH}
      height={PIANO_ROLL_HEIGHT}
    ></canvas>
  );
};

export default PianoRoll;
