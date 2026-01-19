"use client";

import { motion } from "framer-motion";

interface SmokyLogoProps {
  isDark?: boolean;
}

const CIRCLE_RADIUS = 18;

export default function SmokyLogo({ isDark = false }: SmokyLogoProps) {
  const textColor = isDark ? "#E6E2C5" : "#2B4593";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
    >
      <div className="flex items-center gap-8 pointer-events-auto">
        {/* Get link (left underline) */}
        <a
          href="https://api.whatsapp.com/send?phone=447822032838&text=I+consent+to+being+sent+messages+by+The+Bixt%27s+_Smoky_+and+will+reply+UNSUBSCRIBE+should+this+change.+%F0%9F%91%91"
          target="_blank"
          rel="noopener noreferrer"
          className="font-serif text-lg tracking-wide hover:opacity-70 transition-opacity"
          style={{
            color: textColor,
            textDecoration: "underline",
            textUnderlineOffset: "4px",
          }}
        >
          Get
        </a>

        {/* Center: Circle + Smoky text */}
        <div className="relative flex items-center justify-center">
          {/* SVG Circle */}
          <svg
            width="90"
            height="90"
            viewBox="0 0 60 60"
            className="absolute"
          >
            {/* Circle outline */}
            <circle
              cx="30"
              cy="30"
              r={CIRCLE_RADIUS}
              fill="none"
              stroke={textColor}
              strokeWidth="2"
            />

            {/* Filled circle */}
            <circle
              cx="30"
              cy="30"
              r={CIRCLE_RADIUS - 1}
              fill="#FF10F0"
            />
          </svg>

          {/* Smoky text */}
          <span
            className="font-serif text-lg md:text-xl font-semibold tracking-[0.1em] uppercase relative z-10"
            style={{ color: "#E6E2C5" }}
          >
            Smoky.
          </span>
        </div>

        {/* Now link (right underline) */}
        <a
          href="/episode/14"
          className="font-serif text-lg tracking-wide hover:opacity-70 transition-opacity"
          style={{
            color: textColor,
            textDecoration: "underline",
            textUnderlineOffset: "4px",
          }}
        >
          Now
        </a>
      </div>
    </motion.div>
  );
}
