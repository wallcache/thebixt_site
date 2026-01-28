"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import BackgroundVideo from "@/components/BackgroundVideo";
import TapedPhoto from "@/components/TapedPhoto";
import { Episode } from "@/lib/episodes";

interface HomeContentProps {
  latestEpisode: Episode;
}

export default function HomeContent({ latestEpisode }: HomeContentProps) {
  return (
    <div className="min-h-screen relative">
      {/* Background Video */}
      <BackgroundVideo />

      {/* Hero Section */}
      <motion.section
        className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Tagline */}
        <motion.p
          className="text-burgundy/50 text-sm tracking-[0.3em] uppercase mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Rituals, Reality, and Recipes
        </motion.p>

        {/* Current Episode Showcase */}
        <motion.div
          className="w-full max-w-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <p className="text-xs text-burgundy/40 mb-4 uppercase tracking-[0.2em] text-center">
            Latest Episode
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 max-w-3xl mx-auto">
            {/* Sketch/Illustration */}
            <div className="flex justify-center flex-shrink-0">
              <TapedPhoto
                src={latestEpisode.headerImage}
                alt={latestEpisode.title}
                caption={latestEpisode.date}
                rotation={-2}
                size="small"
              />
            </div>

            {/* Episode Info */}
            <div className="text-center md:text-left">
              <Link href={`/episode/${latestEpisode.slug}`} className="block group mb-6">
                <h2 className="font-serif text-3xl md:text-4xl text-burgundy mb-3 group-hover:text-hot-pink transition-colors">
                  {latestEpisode.title}
                </h2>
                <p className="text-burgundy/60 text-lg mb-2">
                  {latestEpisode.subtitle}
                </p>
                <p className="text-burgundy/40 text-sm">
                  {latestEpisode.date}
                </p>
              </Link>

              {/* Episode excerpt - one paragraph */}
              <p className="text-burgundy/60 text-base leading-relaxed mb-6">
                {latestEpisode.excerpt}
              </p>

              <Link
                href={`/episode/${latestEpisode.slug}`}
                className="inline-block bg-burgundy text-cream px-8 py-3 text-sm tracking-wider uppercase hover:bg-hot-pink transition-colors"
              >
                Read Episode
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* View All Episodes Link */}
      <motion.div
        className="text-center py-16 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Link
          href="/episodes"
          className="inline-block border border-burgundy/30 text-burgundy px-8 py-3 text-sm tracking-wider uppercase hover:bg-burgundy hover:text-cream transition-colors"
        >
          View All Episodes
        </Link>
      </motion.div>

      {/* Footer spacing for the persistent SmokyLogo */}
      <div className="h-32" />
    </div>
  );
}
