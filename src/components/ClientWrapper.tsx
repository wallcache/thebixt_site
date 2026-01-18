"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import LoadingScreen from "./LoadingScreen";
import Navigation from "./Navigation";
import PageTransition from "./PageTransition";
import BlobTransition from "./BlobTransition";
import GetSmokyButton from "./GetSmokyButton";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [bgHovered, setBgHovered] = useState(false);
  const pathname = usePathname();
  const isEpisodePage = pathname.startsWith("/episode/");
  const prevIsEpisodePage = useRef(isEpisodePage);
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  const [showBlobTransition, setShowBlobTransition] = useState(false);

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
      <BlobTransition show={showBlobTransition} onComplete={() => setShowBlobTransition(false)} isDark={isEpisodePage} />
      {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
      <div
        className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onMouseMove={() => !bgHovered && setBgHovered(true)}
      >
        {/* Subtle tube map background for light theme */}
        {!isEpisodePage && (
          <motion.div
            className="fixed inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: "url(/tube-map.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            initial={{ opacity: 0.03 }}
            animate={{ opacity: bgHovered ? 0.07 : 0.03 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}
        <Navigation isDark={isEpisodePage} isThemeChanging={isThemeChanging} />
        <main
          className="pt-20 min-h-screen relative"
          style={{ zIndex: 10 }}
        >
          <AnimatePresence mode="wait">
            <PageTransition>{children}</PageTransition>
          </AnimatePresence>
        </main>
        <div className="fixed bottom-12 left-14 z-50">
          <GetSmokyButton variant={isEpisodePage ? "dark" : "light"} />
        </div>
      </div>
    </>
  );
}
