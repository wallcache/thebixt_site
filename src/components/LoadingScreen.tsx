"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase("hold"), 600);
    const outTimer = setTimeout(() => setPhase("out"), 1200);
    const doneTimer = setTimeout(() => onLoadingComplete(), 1700);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(outTimer);
      clearTimeout(doneTimer);
    };
  }, [onLoadingComplete]);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ backgroundColor: "#081E28" }}
    >
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={
          phase === "out"
            ? { opacity: 0, scale: 1.05 }
            : { opacity: 1, scale: 1 }
        }
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <h1 className="font-serif text-5xl md:text-7xl text-burgundy tracking-tight">
          Smoky<span className="text-hot-pink">.</span>
        </h1>
        <motion.p
          className="text-burgundy/40 text-xs tracking-[0.3em] uppercase mt-4"
          initial={{ opacity: 0, y: 8 }}
          animate={
            phase === "out"
              ? { opacity: 0, y: -4 }
              : { opacity: 1, y: 0 }
          }
          transition={{ duration: 0.4, delay: phase === "in" ? 0.3 : 0, ease: [0.4, 0, 0.2, 1] }}
        >
          Rituals, Reality, and Recipes
        </motion.p>
      </motion.div>
    </div>
  );
}
