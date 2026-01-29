"use client";

import { motion } from "framer-motion";
import TypewriterText from "@/components/TypewriterText";
import DappledLight from "@/components/DappledLight";

interface FeaturedSense {
  type: string;
  brand: string;
  description: string;
  storyReference?: string;
  link?: string;
  episodeTitle: string;
  episodeDate: string;
  episodeSlug: string;
}

const badgeColors: Record<string, string> = {
  Hear: "#3B5998",
  See: "#0d3d3a",
  Taste: "#8B6914",
  Grab: "#FD05A0",
};

export default function FeaturedContent({ senses }: { senses: FeaturedSense[] }) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DappledLight speed={0.8} mouseInfluence={1.2} />
      </div>
      <div className="relative z-10">
        {/* Header */}
        <section className="px-6 md:px-12 pt-12 pb-8 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl text-burgundy mb-3">
              <TypewriterText text="Featured" wordByWord />
            </h1>
            <p className="text-burgundy/60 text-base max-w-xl mx-auto">
              Every brand, collab, and recommendation from across the episodes.
            </p>
          </div>
        </section>

        {/* Senses list */}
        <section className="px-6 md:px-12 pb-24 max-w-4xl mx-auto">
          {senses.length === 0 ? (
            <p className="text-center text-burgundy/40">No featured items yet.</p>
          ) : (
            <div className="space-y-6">
              {senses.map((sense, i) => (
                <motion.div
                  key={`${sense.episodeSlug}-${sense.brand}-${i}`}
                  className="border border-burgundy/20 bg-cream rounded-lg p-6 hover:border-hot-pink/40 transition-colors duration-300"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(i * 0.03, 0.3),
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  {/* Episode label + badge */}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-xs text-burgundy/40 uppercase tracking-wider">
                      {sense.episodeTitle} &middot; {sense.episodeDate}
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: badgeColors[sense.type] || "#081E28" }}
                    >
                      {sense.type}
                    </span>
                  </div>

                  {/* Brand name */}
                  <h2 className="font-serif text-xl text-burgundy mb-2">
                    {sense.brand}
                  </h2>

                  {/* Story reference */}
                  {sense.storyReference && (
                    <p className="text-burgundy/50 text-sm italic mb-2 leading-relaxed">
                      &ldquo;{sense.storyReference}&rdquo;
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-burgundy/60 text-sm leading-relaxed">
                    {sense.description}
                  </p>

                  {/* Link */}
                  {sense.link && (
                    <a
                      href={sense.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-xs text-hot-pink hover:underline tracking-wide"
                    >
                      Visit &rarr;
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
