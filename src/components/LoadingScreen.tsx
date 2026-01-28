"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

type AnimationPhase = "tracing" | "text" | "complete";

const TIMING = {
  TRACE_DURATION: 700,
  TEXT_DELAY: 100,
  GET_NOW_DELAY: 400,
  COMPLETE_DELAY: 500,
};

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<AnimationPhase>("tracing");
  const [circleProgress, setCircleProgress] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    let animationFrame: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      // Animate circle trace
      if (elapsed < TIMING.TRACE_DURATION) {
        const progress = elapsed / TIMING.TRACE_DURATION;
        const eased = 1 - Math.pow(1 - progress, 3);
        setCircleProgress(eased);
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    // Phase 2: Show "Smoky" text
    const textTimer = setTimeout(() => {
      setCircleProgress(1);
      setPhase("text");
    }, TIMING.TRACE_DURATION + TIMING.TEXT_DELAY);

    // Phase 3: Show "Get" and "Now"
    const completeTimer = setTimeout(() => {
      setPhase("complete");
    }, TIMING.TRACE_DURATION + TIMING.TEXT_DELAY + TIMING.GET_NOW_DELAY);

    // Signal loading complete
    const finishTimer = setTimeout(() => {
      onLoadingComplete();
    }, TIMING.TRACE_DURATION + TIMING.TEXT_DELAY + TIMING.GET_NOW_DELAY + TIMING.COMPLETE_DELAY);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
      clearTimeout(finishTimer);
    };
  }, [onLoadingComplete]);

  const showText = phase === "text" || phase === "complete";
  const showGetNow = phase === "complete";

  const circumference = 2 * Math.PI * 10;
  const strokeDashoffset = circumference * (1 - circleProgress);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ backgroundColor: "#081E28" }}
    >
      <div className="flex items-center gap-6">
        {/* Get link */}
        <motion.a
          href="https://api.whatsapp.com/send?phone=447822032838&text=I+consent+to+being+sent+messages+by+The+Bixt%27s+_Smoky_+and+will+reply+UNSUBSCRIBE+should+this+change.+%F0%9F%91%91"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cream font-serif text-lg tracking-wide"
          style={{
            textDecoration: "underline",
            textUnderlineOffset: "4px",
            pointerEvents: showGetNow ? "auto" : "none",
          }}
          initial={{ opacity: 0, x: -10 }}
          animate={showGetNow ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
        >
          Get
        </motion.a>

        {/* Smoky with O as circle */}
        <div className="flex items-center">
          {/* Sm */}
          <motion.span
            className="font-serif text-2xl md:text-3xl font-semibold tracking-[0.1em] uppercase text-cream"
            initial={{ opacity: 0 }}
            animate={showText ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            Sm
          </motion.span>

          {/* O - the circle */}
          <div className="relative w-8 h-8 mx-0.5 flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              className="absolute"
            >
              {/* Circle outline being traced */}
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#E6E2C5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "center",
                }}
              />

              {/* Filled circle */}
              <motion.circle
                cx="12"
                cy="12"
                r="9"
                initial={{ fill: "transparent" }}
                animate={showText ? { fill: "#FD05A0" } : { fill: "transparent" }}
                transition={{ duration: 0.15 }}
              />
            </svg>
          </div>

          {/* ky. */}
          <motion.span
            className="font-serif text-2xl md:text-3xl font-semibold tracking-[0.1em] uppercase text-cream"
            initial={{ opacity: 0 }}
            animate={showText ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            ky.
          </motion.span>
        </div>

        {/* Now link */}
        <motion.a
          href="/episode/14"
          className="text-cream font-serif text-lg tracking-wide"
          style={{
            textDecoration: "underline",
            textUnderlineOffset: "4px",
            pointerEvents: showGetNow ? "auto" : "none",
          }}
          initial={{ opacity: 0, x: 10 }}
          animate={showGetNow ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
          transition={{ duration: 0.3 }}
        >
          Now
        </motion.a>
      </div>
    </div>
  );
}
