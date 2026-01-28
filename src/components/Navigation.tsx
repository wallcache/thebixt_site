"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { siteConfig } from "@/data";
import NavLink from "./NavLink";

export default function Navigation() {
  const pathname = usePathname();
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    lastScrollY.current = latest;

    if (latest < 80) {
      setHidden(false);
      return;
    }

    if (latest > previous && latest - previous > 5) {
      setHidden(true);
    } else if (previous > latest && previous - latest > 5) {
      setHidden(false);
    }
  });

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-[50] backdrop-blur-md"
      style={{ backgroundColor: "rgba(8, 30, 40, 0.85)" }}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="max-w-6xl mx-auto px-8 md:px-12 py-5 flex items-center justify-between">
        <Link href="/" className="hover:opacity-70 transition-opacity">
          <span
            className="font-serif text-2xl font-semibold tracking-[0.3em] uppercase transition-colors duration-300 text-burgundy"
          >
            Smoky
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <NavLink
            href="/episodes"
            isActive={pathname === "/episodes"}
          >
            Past Episodes
          </NavLink>
          <NavLink
            href="/brands"
            isActive={pathname === "/brands"}
          >
            Brands
          </NavLink>
          <NavLink
            href="/about"
            isActive={pathname === "/about"}
          >
            About
          </NavLink>
          <motion.a
            href={siteConfig.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative text-sm tracking-wide px-4 py-2 rounded-full border overflow-hidden border-burgundy/40"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span
              className="absolute inset-0 bg-burgundy"
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
                color: isButtonHovered ? "#081E28" : "#E6E2C5",
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
