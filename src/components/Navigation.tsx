"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/data";

interface NavigationProps {
  isDark?: boolean;
  isThemeChanging?: boolean;
}

export default function Navigation({ isDark = false, isThemeChanging = false }: NavigationProps) {
  const pathname = usePathname();
  const [displayDark, setDisplayDark] = useState(isDark);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  useEffect(() => {
    if (isThemeChanging) {
      // Update display theme while header is hidden
      const timer = setTimeout(() => {
        setDisplayDark(isDark);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isDark, isThemeChanging]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 backdrop-blur-sm"
      style={{ backgroundColor: displayDark ? "rgba(43, 69, 147, 0.95)" : "rgba(230, 226, 197, 0.95)" }}
      animate={{
        y: isThemeChanging ? -30 : 0,
        opacity: isThemeChanging ? 0 : 1,
      }}
      transition={{
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <div className="max-w-6xl mx-auto px-8 md:px-12 py-6 flex items-center justify-between">
        <Link href="/" className="hover:opacity-70 transition-opacity">
          <span
            className={`font-serif text-2xl font-semibold tracking-[0.3em] uppercase transition-colors duration-300 ${
              displayDark ? "text-cream" : "text-burgundy"
            }`}
          >
            Smoky
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/episodes"
            className={`text-sm tracking-wide transition-colors duration-300 hover:opacity-70 ${
              displayDark
                ? pathname === "/episodes" ? "text-cream" : "text-cream/60"
                : pathname === "/episodes" ? "text-burgundy" : "text-burgundy/60"
            }`}
          >
            All Episodes
          </Link>
          <Link
            href="/about"
            className={`text-sm tracking-wide transition-colors duration-300 hover:opacity-70 ${
              displayDark
                ? pathname === "/about" ? "text-cream" : "text-cream/60"
                : pathname === "/about" ? "text-burgundy" : "text-burgundy/60"
            }`}
          >
            About
          </Link>
          <motion.a
            href={siteConfig.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              relative text-sm tracking-wide px-4 py-2 rounded-full border overflow-hidden
              ${displayDark ? "border-cream/40" : "border-burgundy/40"}
            `}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Pop-out background animation */}
            <motion.span
              className={`absolute inset-0 ${displayDark ? "bg-cream" : "bg-burgundy"}`}
              initial={{ scale: 0, borderRadius: "100%" }}
              animate={{
                scale: isButtonHovered ? 1.5 : 0,
                borderRadius: isButtonHovered ? "0%" : "100%",
              }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
              }}
              style={{ originX: 0.5, originY: 0.5 }}
            />
            <motion.span
              className="relative z-10"
              animate={{
                color: isButtonHovered
                  ? (displayDark ? "#2B4593" : "#E6E2C5")
                  : (displayDark ? "#E6E2C5" : "#2B4593"),
              }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              Get Smoky
            </motion.span>
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
}
