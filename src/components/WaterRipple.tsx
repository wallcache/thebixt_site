"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function WaterRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = useCallback((e: MouseEvent) => {
    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
    };

    setRipples((prev) => [...prev.slice(-4), newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [handleClick]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9997] overflow-hidden">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Concentric rings */}
            {[0, 1, 2].map((ring) => (
              <motion.div
                key={ring}
                className="absolute rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  border: `${1.5 - ring * 0.3}px solid var(--hot-pink)`,
                }}
                initial={{
                  width: 0,
                  height: 0,
                  opacity: 0.6 - ring * 0.15,
                }}
                animate={{
                  width: 60 + ring * 25,
                  height: 60 + ring * 25,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.4 + ring * 0.1,
                  delay: ring * 0.05,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
