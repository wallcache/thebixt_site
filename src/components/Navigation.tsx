"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { siteConfig } from "@/data";
import NavLink from "./NavLink";

interface NavigationProps {
  visible?: boolean;
}

export default function Navigation({ visible = true }: NavigationProps) {
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

  // Determine vertical position: off-screen if not visible or hidden on scroll
  const shouldHide = !visible || hidden;

  return (
    <div className="fixed top-5 left-0 right-0 z-[50] flex justify-center pointer-events-none">
      <motion.nav
        className="w-[calc(100%-3rem)] max-w-3xl backdrop-blur-md rounded-2xl shadow-sm pointer-events-auto"
        style={{ backgroundColor: "rgba(230, 226, 197, 0.88)" }}
        initial={{ y: "-120%", opacity: 0 }}
        animate={{
          y: shouldHide ? "-120%" : "0%",
          opacity: shouldHide ? 0 : 1,
        }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="px-6 md:px-10 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            <span
              className="font-serif text-2xl font-semibold tracking-[0.3em] uppercase transition-colors duration-300"
              style={{ color: "#081E28" }}
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
              className="relative text-sm tracking-wide px-4 py-2 rounded-full border overflow-hidden"
              style={{ borderColor: "rgba(8, 30, 40, 0.3)" }}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.span
                className="absolute inset-0"
                style={{ backgroundColor: "#081E28" }}
                initial={{ scale: 0, borderRadius: "100%" }}
                animate={{
                  scale: isButtonHovered ? 1.5 : 0,
                  borderRadius: isButtonHovered ? "0%" : "100%",
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
              <motion.span
                className="relative z-10"
                animate={{
                  color: isButtonHovered ? "#E6E2C5" : "#081E28",
                }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                Get Smoky
              </motion.span>
            </motion.a>
          </div>
        </div>
      </motion.nav>
    </div>
  );
}
