"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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
      className="relative p-5 md:p-6 h-full"
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
      <p className="text-hot-pink text-xs uppercase tracking-[0.2em] mb-3">
        {senseLabels[sense.type] || sense.type}
      </p>

      {/* Brand name */}
      <h3 className="font-serif text-lg md:text-xl text-burgundy mb-2">
        {sense.brand}
      </h3>

      {/* Story reference */}
      {sense.storyReference && (
        <p className="text-burgundy/40 text-sm font-serif italic mb-3">
          &ldquo;{sense.storyReference}&rdquo;
        </p>
      )}

      {/* Description */}
      <p className="text-burgundy/70 text-sm leading-relaxed">
        {sense.description}
      </p>

      {/* Link */}
      {sense.link && (
        <p className="mt-3">
          <span className="text-hot-pink/70 text-xs uppercase tracking-wider hover:text-hot-pink transition-colors">
            Explore &rarr;
          </span>
        </p>
      )}
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
}

export default function EpisodeSensesGrid({ senses, className = "" }: EpisodeSensesGridProps) {
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

  return (
    <motion.section
      className={`w-full ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
        variants={containerVariants}
      >
        {senses.map((sense, index) => {
          const isLastOdd = isOddCount && index === senses.length - 1;
          return (
            <motion.div
              key={`${sense.type}-${index}`}
              variants={itemVariants}
              className={isLastOdd ? "md:col-span-2 md:max-w-[50%] md:mx-auto" : ""}
            >
              <SenseTextCard sense={sense} />
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
