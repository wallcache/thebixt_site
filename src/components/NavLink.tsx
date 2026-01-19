"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

interface NavLinkProps {
  href: string;
  children: string;
  isActive: boolean;
  isDark: boolean;
}

export default function NavLink({ href, children, isActive, isDark }: NavLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseColor = isDark
    ? isActive ? "#E6E2C5" : "rgba(230, 226, 197, 0.6)"
    : isActive ? "#2B4593" : "rgba(43, 69, 147, 0.6)";

  const hoverColor = isDark ? "#E6E2C5" : "#2B4593";

  return (
    <Link
      href={href}
      className="relative text-sm tracking-wide overflow-hidden block"
      style={{ height: "1.5em" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container for the sliding text effect */}
      <span className="relative block overflow-hidden" style={{ height: "1.5em" }}>
        {/* Invisible bold text to set the width */}
        <span className="invisible block whitespace-nowrap font-semibold">
          {children}
        </span>

        {/* Original text - slides up and out */}
        <motion.span
          className="absolute top-0 left-0 block whitespace-nowrap"
          style={{ color: baseColor }}
          animate={{
            y: isHovered ? "-100%" : 0,
          }}
          transition={{
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {children}
        </motion.span>

        {/* Bold text - slides up from below */}
        <motion.span
          className="absolute top-0 left-0 block whitespace-nowrap font-semibold"
          style={{ color: hoverColor }}
          animate={{
            y: isHovered ? 0 : "100%",
          }}
          transition={{
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {children}
        </motion.span>
      </span>

      {/* Underline that draws in */}
      <motion.span
        className="absolute bottom-0 left-0 h-[1px]"
        style={{ backgroundColor: hoverColor }}
        initial={{ width: "0%" }}
        animate={{
          width: isHovered ? "100%" : "0%",
        }}
        transition={{
          duration: 0.25,
          ease: [0.4, 0, 0.2, 1],
        }}
      />
    </Link>
  );
}
