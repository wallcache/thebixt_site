"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface TapedPhotoProps {
  src: string;
  alt: string;
  caption: string;
  rotation?: number;
  isDark?: boolean;
  size?: "small" | "medium" | "large";
}

export default function TapedPhoto({ src, alt, caption, rotation = 0, isDark = false, size = "medium" }: TapedPhotoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedRotation, setExpandedRotation] = useState(0);

  const handleExpand = () => {
    setExpandedRotation((Math.random() - 0.5) * 20);
    setIsExpanded(true);
  };

  const sizeConfig = {
    small: { width: 200, height: 150, padding: "p-1.5", tape: "px-3 py-1", tapeText: "text-xs" },
    medium: { width: 280, height: 210, padding: "p-2", tape: "px-4 py-1.5", tapeText: "text-sm" },
    large: { width: 400, height: 300, padding: "p-2", tape: "px-4 py-1.5", tapeText: "text-sm" },
  };

  const config = sizeConfig[size];

  return (
    <>
      <motion.div
        className="relative inline-block my-4 cursor-pointer"
        style={{ transform: `rotate(${rotation}deg)` }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        onClick={handleExpand}
        whileHover={{ scale: 1.02 }}
      >
        {/* Top tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div
            className={`${config.tape} shadow-sm`}
            style={{
              transform: "rotate(-2deg)",
              background: "linear-gradient(180deg, rgba(255,251,235,0.9) 0%, rgba(254,243,199,0.85) 100%)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            <span
              className={`${config.tapeText} uppercase`}
              style={{
                fontFamily: "var(--font-marker), cursive",
                color: "#2B4593",
                letterSpacing: "0.01em",
              }}
            >
              {caption}
            </span>
          </div>
        </div>

        {/* Photo */}
        <div
          className={`bg-white ${config.padding} shadow-lg`}
          style={{
            boxShadow: isDark
              ? "0 4px 20px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.2)"
              : "0 4px 20px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <Image
            src={src}
            alt={alt}
            width={config.width}
            height={config.height}
            className="block"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      </motion.div>

      {/* Expanded view */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 z-[99999] flex items-center justify-center cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsExpanded(false)}
            style={{ backgroundColor: "rgba(43, 69, 147, 0.2)" }}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.5, rotate: rotation }}
              animate={{ scale: 1, rotate: expandedRotation }}
              exit={{ scale: 0.5, rotate: rotation }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top tape */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                <div
                  className="bg-amber-100/80 px-5 py-2 shadow-sm"
                  style={{
                    transform: "rotate(-2deg)",
                    background: "linear-gradient(180deg, rgba(255,251,235,0.95) 0%, rgba(254,243,199,0.9) 100%)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                  }}
                >
                  <span
                    className="text-base uppercase"
                    style={{
                      fontFamily: "var(--font-marker), cursive",
                      color: "#2B4593",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {caption}
                  </span>
                </div>
              </div>

              {/* Photo */}
              <div
                className="bg-white p-4 shadow-2xl"
                style={{
                  boxShadow: "0 25px 50px rgba(0,0,0,0.25), 0 10px 20px rgba(0,0,0,0.15)",
                  maxWidth: "56vw",
                  maxHeight: "56vh",
                }}
              >
                <img
                  src={src}
                  alt={alt}
                  className="block"
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "52vw",
                    maxHeight: "52vh",
                    objectFit: "contain"
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
