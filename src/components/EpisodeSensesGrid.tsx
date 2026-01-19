"use client";

import { motion } from "framer-motion";
import { useState, useId } from "react";
import { FourSenses } from "@/lib/episodes";

interface SenseCardProps {
  title: string;
  subtitle: string;
  image: string;
  caption: string;
}

function SenseCard({ title, subtitle, image, caption }: SenseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const maskId = useId();

  return (
    <motion.div
      className="relative aspect-square overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </motion.div>

      {/* SVG with knockout text mask */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="white" />
            <text
              x="50%"
              y="42%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="black"
              fontSize="56"
              fontFamily="var(--font-serif), Georgia, serif"
              fontWeight="600"
              letterSpacing="0.05em"
            >
              {title}
            </text>
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="black"
              fontSize="14"
              fontFamily="var(--font-serif), Georgia, serif"
              fontWeight="400"
              letterSpacing="0.15em"
              style={{ textTransform: "uppercase" }}
            >
              {subtitle}
            </text>
          </mask>
        </defs>

        <motion.rect
          width="100%"
          height="100%"
          fill="rgba(20, 20, 20, 0.85)"
          mask={`url(#${maskId})`}
          animate={{
            fill: isHovered ? "rgba(20, 20, 20, 0.6)" : "rgba(20, 20, 20, 0.85)",
          }}
          transition={{ duration: 0.3 }}
        />
      </svg>

      {/* Hot pink border on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ boxShadow: "inset 0 0 0 3px var(--hot-pink)" }}
      />

      {/* Caption on hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-cream text-sm font-serif italic">{caption}</p>
      </motion.div>
    </motion.div>
  );
}

interface EpisodeSensesGridProps {
  senses: FourSenses;
  className?: string;
}

export default function EpisodeSensesGrid({ senses, className = "" }: EpisodeSensesGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0,
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

  return (
    <motion.section
      className={`w-full ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <motion.div
        className="grid grid-cols-2 gap-2 md:gap-4"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <SenseCard
            title="See"
            subtitle="Eyes"
            image={senses.see.image}
            caption={senses.see.caption}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SenseCard
            title="Hear"
            subtitle="Ears"
            image={senses.hear.image}
            caption={senses.hear.caption}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SenseCard
            title="Try"
            subtitle="Mouth"
            image={senses.try.image}
            caption={senses.try.caption}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SenseCard
            title="Touch"
            subtitle="Hands"
            image={senses.touch.image}
            caption={senses.touch.caption}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
