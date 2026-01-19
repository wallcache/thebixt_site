"use client";

import { motion } from "framer-motion";
import { useState, useId } from "react";

interface SenseCardProps {
  title: string;
  subtitle: string;
  image: string;
  link?: string;
}

export default function SenseCard({ title, subtitle, image, link = "#" }: SenseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const maskId = useId();

  return (
    <motion.a
      href={link}
      className="relative aspect-square overflow-hidden block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* SVG with knockout text mask */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Mask: white = visible, black = cut out */}
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="white" />
            {/* Main title - knocked out */}
            <text
              x="50%"
              y="45%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="black"
              fontSize="72"
              fontFamily="var(--font-serif), Georgia, serif"
              fontWeight="600"
              letterSpacing="0.05em"
            >
              {title}
            </text>
            {/* Subtitle - knocked out */}
            <text
              x="50%"
              y="62%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="black"
              fontSize="18"
              fontFamily="var(--font-serif), Georgia, serif"
              fontWeight="400"
              letterSpacing="0.15em"
              style={{ textTransform: "uppercase" }}
            >
              {subtitle}
            </text>
          </mask>
        </defs>

        {/* Dark overlay with mask applied - text is cut out */}
        <motion.rect
          width="100%"
          height="100%"
          fill="rgba(20, 20, 20, 0.85)"
          mask={`url(#${maskId})`}
          animate={{
            fill: isHovered ? "rgba(20, 20, 20, 0.7)" : "rgba(20, 20, 20, 0.85)",
          }}
          transition={{ duration: 0.3 }}
        />
      </svg>

      {/* Hot pink border on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: "inset 0 0 0 3px var(--hot-pink)",
        }}
      />

      {/* Hot pink glow effect on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? 0.2 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: "radial-gradient(circle at center, var(--hot-pink) 0%, transparent 70%)",
        }}
      />
    </motion.a>
  );
}
