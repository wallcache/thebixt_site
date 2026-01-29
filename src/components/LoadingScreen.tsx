"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LETTERS = ["S", "M", "O", "K", "Y"];
const STAGGER_DELAY = 0.12;
const LETTER_DURATION = 0.4;
// Total time for all letters + period to appear
const ALL_IN_TIME =
  LETTERS.length * STAGGER_DELAY * 1000 + // last letter starts
  0.15 * 1000 + // period extra delay
  LETTER_DURATION * 1000; // animation duration of last element
const HOLD_TIME = 600;

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  useEffect(() => {
    // After all letters are in + hold time, hand off to hero (no fade — hero text is identical underneath)
    const doneTimer = setTimeout(() => {
      onLoadingComplete();
    }, ALL_IN_TIME + HOLD_TIME);

    return () => {
      clearTimeout(doneTimer);
    };
  }, [onLoadingComplete]);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ backgroundColor: "#081E28" }}
    >
      <h1 className="font-serif text-5xl md:text-7xl text-burgundy tracking-[0.15em] whitespace-nowrap">
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
      </h1>
    </div>
  );
}
