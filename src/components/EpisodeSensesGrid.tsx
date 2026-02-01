"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Sense } from "@/lib/episodes";

const senseLabels: Record<string, string> = {
  hear: "Hear",
  see: "See",
  taste: "Taste",
  grab: "Grab",
  bonusTaste: "Bonus Taste",
};

function SenseTextCard({ sense }: { sense: Sense }) {
  const [isHovered, setIsHovered] = useState(false);

  const content = (
    <motion.div
      className="relative p-6 md:p-8 h-full flex flex-col items-center justify-center"
      style={{
        background: "rgba(230, 226, 197, 0.04)",
        border: "1px solid rgba(230, 226, 197, 0.1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Hot pink border on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ boxShadow: "inset 0 0 0 2px var(--hot-pink)" }}
      />

      {/* Sense type label */}
      <p className="text-hot-pink text-sm uppercase tracking-[0.3em] mb-3 text-center">
        {senseLabels[sense.type] || sense.type}
      </p>

      {/* Story reference quote as header */}
      {sense.storyReference && (
        <h3 className="font-serif text-xl md:text-2xl text-burgundy mb-4 leading-relaxed text-center">
          &ldquo;{sense.storyReference}&rdquo;
        </h3>
      )}

      {/* Brand name */}
      <p className="text-burgundy/60 text-sm md:text-base font-semibold tracking-wide text-center">
        {sense.brand}
      </p>
    </motion.div>
  );

  if (sense.link) {
    return (
      <a href={sense.link} target="_blank" rel="noopener noreferrer" className="block h-full">
        {content}
      </a>
    );
  }

  return content;
}

interface EpisodeSensesGridProps {
  senses: Sense[];
  className?: string;
  centerButtonHref?: string;
}

// Inline mask styles for circular cutouts — more reliable than class-based masks in production
const cutoutStyles: Record<number, React.CSSProperties> = {
  0: { // bottom-right corner
    WebkitMaskImage: "radial-gradient(circle at calc(100% + 8px) calc(100% + 8px), transparent 76px, black 76px)",
    maskImage: "radial-gradient(circle at calc(100% + 8px) calc(100% + 8px), transparent 76px, black 76px)",
  },
  1: { // bottom-left corner
    WebkitMaskImage: "radial-gradient(circle at calc(0% - 8px) calc(100% + 8px), transparent 76px, black 76px)",
    maskImage: "radial-gradient(circle at calc(0% - 8px) calc(100% + 8px), transparent 76px, black 76px)",
  },
  2: { // top-right corner
    WebkitMaskImage: "radial-gradient(circle at calc(100% + 8px) calc(0% - 8px), transparent 76px, black 76px)",
    maskImage: "radial-gradient(circle at calc(100% + 8px) calc(0% - 8px), transparent 76px, black 76px)",
  },
  3: { // top-left corner
    WebkitMaskImage: "radial-gradient(circle at calc(0% - 8px) calc(0% - 8px), transparent 76px, black 76px)",
    maskImage: "radial-gradient(circle at calc(0% - 8px) calc(0% - 8px), transparent 76px, black 76px)",
  },
};

export default function EpisodeSensesGrid({ senses, className = "", centerButtonHref }: EpisodeSensesGridProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
    },
  };

  const isOddCount = senses.length % 2 !== 0;
  const showCenterButton = centerButtonHref && senses.length >= 4;

  return (
    <motion.section
      className={`w-full ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="relative">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
          variants={containerVariants}
        >
          {senses.map((sense, index) => {
            const isLastOdd = isOddCount && index === senses.length - 1;
            const cutoutStyle = showCenterButton && isDesktop && index < 4 ? cutoutStyles[index] : undefined;
            return (
              <motion.div
                key={`${sense.type}-${index}`}
                variants={itemVariants}
                className={isLastOdd ? "md:col-span-2 md:max-w-[50%] md:mx-auto" : ""}
                style={cutoutStyle}
              >
                <SenseTextCard sense={sense} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Center "Read Now" button at the intersection of the 4 cards */}
        {showCenterButton && (
          <a
            href={centerButtonHref}
            className="hidden md:flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full items-center justify-center text-cream text-sm font-bold uppercase tracking-wider hover:scale-110 transition-transform duration-300 z-10 border border-burgundy/30"
            style={{
              backgroundColor: "transparent",
              boxShadow: "0 0 15px 4px rgba(230, 226, 197, 0.25), 0 0 30px 10px rgba(230, 226, 197, 0.08)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 30px 8px rgba(230, 226, 197, 0.5), 0 0 60px 20px rgba(230, 226, 197, 0.2)";
              e.currentTarget.style.backgroundColor = "rgba(230, 226, 197, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 15px 4px rgba(230, 226, 197, 0.25), 0 0 30px 10px rgba(230, 226, 197, 0.08)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <span className="text-burgundy">Read</span>
            <span className="text-burgundy">Now</span>
          </a>
        )}
      </div>
    </motion.section>
  );
}
