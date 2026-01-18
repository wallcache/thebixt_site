"use client";

import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const TOTAL_DOTS = 10;
const DOT_INTERVAL = 120;

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const [filledDots, setFilledDots] = useState(0);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setFilledDots((prev) => {
        if (prev >= TOTAL_DOTS) {
          clearInterval(dotInterval);
          return prev;
        }
        return prev + 1;
      });
    }, DOT_INTERVAL);

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, TOTAL_DOTS * DOT_INTERVAL + 100);

    const completeTimer = setTimeout(() => {
      onLoadingComplete();
    }, TOTAL_DOTS * DOT_INTERVAL + 600);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: "#2B4593" }}
    >
      <div className="animate-fade-in flex flex-col items-center h-40 justify-center">
        <span className="font-serif text-4xl md:text-5xl font-semibold tracking-[0.3em] uppercase text-cream mb-4">
          Smoky
        </span>

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
            <span
              key={i}
              className={`text-lg transition-opacity duration-150 ${
                i < filledDots ? "text-cream" : "text-cream/20"
              }`}
            >
              •
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
