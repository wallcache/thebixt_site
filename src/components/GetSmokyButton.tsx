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
        backdrop-blur-md border rounded-full
        transition-all duration-300 ease-out
        ${isDark
          ? "bg-cream/10 border-cream/30 text-cream hover:bg-cream/20 hover:border-cream/50"
          : "bg-burgundy/10 border-burgundy/30 text-burgundy hover:bg-burgundy/20 hover:border-burgundy/50"
        }
      `}
      animate={{
        x: position.x,
        y: position.y,
        scale: isHovered ? 1.05 : 1,
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
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl -z-10"
        style={{ backgroundColor: "#E07A5F" }}
        animate={{
          opacity: isHovered ? 0.6 : 0.3,
          scale: isHovered ? 1.3 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Inner glow */}
      <motion.div
        className="absolute inset-0 rounded-full -z-10"
        style={{ boxShadow: "inset 0 0 20px rgba(224, 122, 95, 0.2)" }}
        animate={{
          opacity: isHovered ? 1 : 0.5,
        }}
        transition={{ duration: 0.3 }}
      />

      <span className="relative z-10">GET SMOKY</span>
    </motion.a>
  );
}
