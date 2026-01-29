"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LETTERS = ["S", "m", "o", "k", "y"];
const STAGGER_DELAY = 0.12;
const LETTER_DURATION = 0.4;
// Total time for all letters + period to appear
const ALL_IN_TIME =
  LETTERS.length * STAGGER_DELAY * 1000 + // last letter starts
  0.15 * 1000 + // period extra delay
  LETTER_DURATION * 1000; // animation duration of last element
const HOLD_TIME = 600;

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // After all letters are in + hold time, begin exit
    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, ALL_IN_TIME + HOLD_TIME);

    // After exit animation completes, notify parent
    const doneTimer = setTimeout(() => {
      onLoadingComplete();
    }, ALL_IN_TIME + HOLD_TIME + 400);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onLoadingComplete]);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ backgroundColor: "#081E28" }}
    >
      <motion.h1
        className="font-serif text-7xl md:text-9xl text-burgundy tracking-tight whitespace-nowrap"
        animate={exiting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        {LETTERS.map((letter, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: LETTER_DURATION,
              delay: i * STAGGER_DELAY,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {letter}
          </motion.span>
        ))}
        {/* Pink period appears last */}
        <motion.span
          className="inline-block text-hot-pink"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: LETTER_DURATION,
            delay: LETTERS.length * STAGGER_DELAY + 0.15,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          .
        </motion.span>
      </motion.h1>
    </div>
  );
}
