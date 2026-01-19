"use client";

import { motion } from "framer-motion";
import TypewriterText from "./TypewriterText";

export default function AboutContent() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
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
            <h2 className="font-serif text-2xl md:text-3xl text-burgundy mb-6">
              <TypewriterText text="Coffee? Or something stronger…" wordByWord delay={0.2} />
            </h2>
            <p className="text-burgundy/80 text-lg leading-relaxed">
              If you're a brand that refuses to compromise, an actor in search of something real, or simply possess good taste… we should talk.
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
                <a href="mailto:info@thebixt.com" className="hover:text-burgundy transition-colors">
                  info@thebixt.com
                </a>
              </p>
              <p>
                <span className="text-sm uppercase tracking-wider text-burgundy/50">Phone</span>
                <br />
                <a href="tel:+447822032838" className="hover:text-burgundy transition-colors">
                  +44 (0) 7822 032838
                </a>
              </p>
            </div>
          </motion.section>
        </div>
      </div>

    </div>
  );
}
