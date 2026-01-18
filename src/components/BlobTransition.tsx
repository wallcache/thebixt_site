"use client";

import { motion, AnimatePresence } from "framer-motion";

interface BlobTransitionProps {
  show: boolean;
  onComplete: () => void;
  isDark: boolean;
}

export default function BlobTransition({ show, onComplete, isDark }: BlobTransitionProps) {
  const targetColor = isDark ? "#2B4593" : "#E6E2C5";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={onComplete}
        >
          <motion.div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "300vmax",
              height: "300vmax",
              borderRadius: "50%",
              backgroundColor: targetColor,
            }}
            initial={{
              scale: 0,
              x: "-50%",
              y: "50%",
            }}
            animate={{
              scale: 1.5,
              x: "-50%",
              y: "50%",
            }}
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
