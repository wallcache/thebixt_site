"use client";

import { motion } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  className?: string;
  delay?: number;
  wordByWord?: boolean;
  staggerDelay?: number;
}

export default function TypewriterText({
  text,
  className = "",
  delay = 0,
  wordByWord = false,
  staggerDelay = 0.08
}: TypewriterTextProps) {
  if (!wordByWord) {
    return (
      <motion.span
        className={className}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay, ease: "easeOut" }}
      >
        {text}
      </motion.span>
    );
  }

  const words = text.split(" ");

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.4,
                delay: delay + index * staggerDelay,
                ease: [0.25, 0.1, 0.25, 1],
              },
            },
          }}
        >
          {word}
          {index < words.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </motion.span>
  );
}
