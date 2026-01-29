"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/data";

interface GetSmokyButtonProps {
  variant?: "light" | "dark";
}

export default function GetSmokyButton({ variant = "light" }: GetSmokyButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.3;
    const deltaY = (e.clientY - centerY) * 0.3;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const isDark = variant === "dark";

  return (
    <motion.a
      ref={buttonRef}
      href={siteConfig.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        relative inline-block px-10 py-4 text-sm tracking-widest font-medium
        rounded-full border
        ${isDark
          ? "border-hot-pink/60 text-burgundy"
          : "border-burgundy/30 text-burgundy"
        }
      `}
      style={{
        backgroundColor: isDark ? "rgba(253, 5, 160, 0.12)" : "rgba(230, 226, 197, 0.1)",
      }}
      animate={{
        x: position.x,
        y: position.y,
        scale: isHovered ? 1.1 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Pink glow behind */}
      <motion.div
        className="absolute inset-0 rounded-full -z-10"
        animate={{
          boxShadow: isHovered
            ? "0 0 30px 8px rgba(253, 5, 160, 0.5), 0 0 60px 20px rgba(253, 5, 160, 0.2)"
            : "0 0 15px 4px rgba(253, 5, 160, 0.25), 0 0 30px 10px rgba(253, 5, 160, 0.08)",
        }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Hover fill */}
      <motion.div
        className="absolute inset-0 rounded-full -z-10"
        style={{ backgroundColor: "#FD05A0" }}
        animate={{
          opacity: isHovered ? 0.25 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      <span className="relative z-10">GET SMOKY</span>
    </motion.a>
  );
}
