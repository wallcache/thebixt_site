"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import LoadingScreen from "./LoadingScreen";
import Navigation from "./Navigation";
import PageTransition from "./PageTransition";
import BlobTransition from "./BlobTransition";
import WaterRipple from "./WaterRipple";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const isEpisodePage = pathname.startsWith("/episode/");
  const prevIsEpisodePage = useRef(isEpisodePage);
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  const [showBlobTransition, setShowBlobTransition] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (prevIsEpisodePage.current !== isEpisodePage) {
      // Step 1: Header fades out first
      setIsThemeChanging(true);

      // Step 2: After header is gone, start blob transition
      const blobTimer = setTimeout(() => {
        setShowBlobTransition(true);
      }, 350);

      // Step 3: Header fades back in after blob covers screen
      const headerBackTimer = setTimeout(() => {
        setIsThemeChanging(false);
        prevIsEpisodePage.current = isEpisodePage;
      }, 700);

      return () => {
        clearTimeout(blobTimer);
        clearTimeout(headerBackTimer);
      };
    }
  }, [isEpisodePage]);

  return (
    <>
      <WaterRipple />

      {/* Blob transition for theme changes */}
      <BlobTransition
        show={showBlobTransition}
        onComplete={() => setShowBlobTransition(false)}
        isDark={isEpisodePage}
      />

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
        <Navigation isDark={isEpisodePage} isThemeChanging={isThemeChanging} />
        <main
          className="pt-20 min-h-screen relative"
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
