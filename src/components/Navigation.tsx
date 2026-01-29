"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data";
import NavLink from "./NavLink";

interface NavigationProps {
  visible?: boolean;
}

export default function Navigation({ visible = true }: NavigationProps) {
  const pathname = usePathname();
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOffset, setNavOffset] = useState({ x: 0, y: 0 });
  const navRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  const handleNavMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const nav = navRef.current;
    if (!nav) return;
    const rect = nav.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setNavOffset({
      x: (e.clientX - cx) * 0.04,
      y: (e.clientY - cy) * 0.15,
    });
  }, []);

  const handleNavMouseLeave = useCallback(() => {
    setNavOffset({ x: 0, y: 0 });
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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

  const shouldHide = !visible || hidden;

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-5 left-0 right-0 z-[50] flex justify-center pointer-events-none">
        <motion.nav
          ref={navRef}
          className="w-[calc(100%-3rem)] max-w-3xl backdrop-blur-md rounded-2xl shadow-sm pointer-events-auto"
          style={{ backgroundColor: "rgba(230, 226, 197, 0.88)" }}
          initial={{ y: "-120%", opacity: 0 }}
          animate={{
            y: shouldHide && !menuOpen ? "-120%" : "0%",
            opacity: shouldHide && !menuOpen ? 0 : 1,
            x: navOffset.x,
            translateY: navOffset.y,
          }}
          transition={{
            y: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
            opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
            x: { type: "spring", stiffness: 150, damping: 15, mass: 0.2 },
            translateY: { type: "spring", stiffness: 150, damping: 15, mass: 0.2 },
          }}
          onMouseMove={handleNavMouseMove}
          onMouseLeave={handleNavMouseLeave}
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

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6">
              <NavLink href="/episodes" isActive={pathname === "/episodes"}>
                Past Episodes
              </NavLink>
              <NavLink href="/brands" isActive={pathname === "/brands"}>
                Brands
              </NavLink>
              <NavLink href="/about" isActive={pathname === "/about"}>
                About
              </NavLink>
              <motion.a
                href={siteConfig.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm tracking-wide px-4 py-2 rounded-full border"
                animate={{
                  backgroundColor: isButtonHovered ? "#081E28" : "transparent",
                  borderColor: isButtonHovered ? "#FD05A0" : "rgba(8, 30, 40, 0.3)",
                  color: isButtonHovered ? "#E6E2C5" : "#081E28",
                }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Smoky
              </motion.a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <motion.span
                className="block w-5 h-[1.5px] rounded-full"
                style={{ backgroundColor: "#081E28" }}
                animate={menuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />
              <motion.span
                className="block w-5 h-[1.5px] rounded-full"
                style={{ backgroundColor: "#081E28" }}
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block w-5 h-[1.5px] rounded-full"
                style={{ backgroundColor: "#081E28" }}
                animate={menuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[49] flex flex-col items-center justify-center gap-10 md:hidden"
            style={{ backgroundColor: "#081E28" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {[
              { href: "/episodes", label: "Past Episodes" },
              { href: "/brands", label: "Brands" },
              { href: "/about", label: "About" },
            ].map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.08,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <Link
                  href={item.href}
                  className="font-serif text-3xl text-burgundy tracking-wide hover:text-hot-pink transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: 0.24, ease: [0.4, 0, 0.2, 1] }}
            >
              <a
                href={siteConfig.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-burgundy/40 text-burgundy px-8 py-3 text-sm tracking-wider uppercase hover:bg-burgundy hover:text-cream transition-all duration-300 rounded-full"
              >
                Get Smoky
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
