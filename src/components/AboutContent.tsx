"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import TypewriterText from "./TypewriterText";
import DappledLight from "./DappledLight";
import GetSmokyButton from "./GetSmokyButton";

export default function AboutContent() {
  const rainRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      {/* Rain effect background — fixed behind all content */}
      <div ref={rainRef} className="fixed inset-0 z-0 pointer-events-none">
        <DappledLight speed={0.8} mouseInfluence={1.2} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-16">
        <h1 className="font-serif text-5xl md:text-6xl text-burgundy mb-16">
          <TypewriterText text="About…" wordByWord />
        </h1>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-burgundy text-xl md:text-2xl leading-relaxed mb-8">
              Enter <em className="font-serif">How To Make A Sandwich Smoky</em>, our newsletter where escapism meets realism. Through the fictional world of <em className="font-serif">The Silver Spooners</em> – a best friend group navigating love, life, and London – we invite you to fall back in love with your own story.
            </p>

            <p className="text-burgundy/80 text-lg tracking-wide">
              Rituals. Reality. Recipes. All delivered to your senses.
            </p>
          </motion.div>

          {/* Right Column */}
          <div className="space-y-12">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="font-serif text-2xl md:text-3xl text-hot-pink mb-6">
                <TypewriterText text="Coffee? Or something stronger…" wordByWord delay={0.2} />
              </h2>
              <p className="text-burgundy/80 text-lg leading-relaxed">
                If you&apos;re a brand that refuses to compromise, an actor in search of something real, or simply possess good taste… we should talk.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-3 text-burgundy/80">
                <p>
                  <span className="text-sm uppercase tracking-wider text-burgundy/50">Email</span>
                  <br />
                  <a href="mailto:info@thebixt.com" className="hover:text-hot-pink transition-colors">
                    info@thebixt.com
                  </a>
                </p>
                <p>
                  <span className="text-sm uppercase tracking-wider text-burgundy/50">Phone</span>
                  <br />
                  <a href="tel:+447822032838" className="hover:text-hot-pink transition-colors">
                    +44 (0) 7822 032838
                  </a>
                </p>
              </div>
            </motion.section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-20 px-6">
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <h2 className="font-serif text-3xl md:text-5xl text-burgundy mb-10">
            Don&apos;t miss the next chapter.
          </h2>
          <GetSmokyButton variant="dark" />
          <p className="text-burgundy/30 text-xs tracking-[0.2em] uppercase mt-16">
            &copy; 2025 The Bixt &middot; Rituals, Reality, and Recipes
          </p>
        </motion.div>
      </footer>
    </div>
  );
}
