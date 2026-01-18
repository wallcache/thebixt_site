"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { episodes } from "@/data";
import TypewriterText from "@/components/TypewriterText";

export default function Home() {
  const latestEpisode = episodes[0];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
      <motion.header
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-serif text-5xl md:text-7xl text-burgundy mb-4">
          <TypewriterText text="The Bixt." />
        </h1>
        <p className="text-burgundy/70 text-xl tracking-wide">
          <TypewriterText text="Where Escapism meets Reality." delay={0.3} />
        </p>
      </motion.header>

      <motion.section
        className="text-center max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p className="text-sm text-burgundy/50 mb-3 uppercase tracking-wider">Latest Episode</p>
        <Link href={`/episode/${latestEpisode.slug}`} className="block group mb-8">
          <h2 className="font-serif text-3xl md:text-4xl text-burgundy mb-3 group-hover:opacity-70 transition-opacity">
            {latestEpisode.title}
          </h2>
          <p className="text-burgundy/60 text-lg mb-2">{latestEpisode.subtitle}</p>
          <p className="text-burgundy/40 text-sm">{latestEpisode.date}</p>
        </Link>

        <Link
          href={`/episode/${latestEpisode.slug}`}
          className="inline-block bg-burgundy text-cream px-8 py-3 text-sm tracking-wide hover:opacity-90 transition-opacity mb-6"
        >
          READ NOW
        </Link>

        <div className="mt-8 pt-8 border-t border-burgundy/20">
          <Link
            href="/episodes"
            className="text-burgundy/60 hover:text-burgundy transition-colors text-sm tracking-wide"
          >
            View all episodes →
          </Link>
        </div>
      </motion.section>

    </div>
  );
}
