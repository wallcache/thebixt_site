"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
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

      {/* Main content — always rendered so the hero is in place behind the loading screen */}
      <div>
        {/* Hide nav during loading so it doesn't peek through */}
        <div
          className="transition-opacity duration-500"
          style={{ opacity: isLoading ? 0 : 1 }}
        >
          <Navigation />
        </div>
        <main
          className={`min-h-screen relative ${isHome ? "" : "pt-20"}`}
          style={{ zIndex: 10 }}
        >
          <AnimatePresence mode="wait">
            <PageTransition>{children}</PageTransition>
          </AnimatePresence>
        </main>
      </div>

      {/* Loading screen — overlays on top, removed instantly since hero text is identical underneath */}
      {isLoading && (
        <div className="fixed inset-0 z-50">
          <LoadingScreen onLoadingComplete={handleLoadingComplete} />
        </div>
      )}
    </>
  );
}
