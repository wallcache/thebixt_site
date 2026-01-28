"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import LoadingScreen from "./LoadingScreen";
import Navigation from "./Navigation";
import PageTransition from "./PageTransition";
import WaterRipple from "./WaterRipple";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      <WaterRipple />

      {/* Loading screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1, pointerEvents: "auto" as const }}
            exit={{ opacity: 0, pointerEvents: "none" as const }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50"
          >
            <LoadingScreen onLoadingComplete={handleLoadingComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div
        className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}
      >
        <Navigation />
        <main
          className={`min-h-screen relative ${isHome ? "" : "pt-20"}`}
          style={{ zIndex: 10 }}
        >
          <AnimatePresence mode="wait">
            <PageTransition>{children}</PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}
