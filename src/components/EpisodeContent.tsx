"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Episode } from "@/lib/episodes";
import TypewriterText from "./TypewriterText";
import EpisodeSensesGrid from "./EpisodeSensesGrid";
import DappledLight from "./DappledLight";

interface EpisodeContentProps {
  episode: Episode;
  allEpisodes: Episode[];
}

export default function EpisodeContent({ episode, allEpisodes }: EpisodeContentProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndex = allEpisodes.findIndex((ep) => ep.id === episode.id);
  const nextEpisode = currentIndex > 0 ? allEpisodes[currentIndex - 1] : null;
  const prevEpisode = currentIndex < allEpisodes.length - 1 ? allEpisodes[currentIndex + 1] : null;

  // Vertical scroll navigation - when scrolling up at bottom, go to next episode
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isAtBottom = currentScrollY + windowHeight >= documentHeight - 100;

      // If at bottom and scrolling down, navigate to prev episode (older)
      if (isAtBottom && currentScrollY > lastScrollY && prevEpisode) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          router.push(`/episode/${prevEpisode.slug}`);
        }, 300);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [prevEpisode, router]);

  return (
    <div className="relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DappledLight speed={0.8} mouseInfluence={1.2} />
      </div>
      <div ref={containerRef} className="relative z-10 min-h-screen -mt-20 pt-20">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/episodes"
            className="inline-block text-sm text-burgundy/60 hover:text-burgundy transition-colors mb-8"
          >
            &larr; Back to episodes
          </Link>
        </motion.div>

        <article>
          <header className="mb-12">
            <motion.p
              className="text-sm text-hot-pink mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              {episode.date}
            </motion.p>
            <h1 className="font-serif text-3xl md:text-4xl text-burgundy mb-4">
              <TypewriterText text={episode.title} wordByWord />
            </h1>
            <p className="text-burgundy/70 text-lg">
              <TypewriterText text={episode.subtitle} wordByWord delay={0.3} />
            </p>
          </header>

          <motion.div
            className="prose prose-invert mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {episode.content.map((paragraph, index) => (
              <p
                key={index}
                className="text-burgundy/80 leading-relaxed mb-6"
              >
                {paragraph}
              </p>
            ))}
          </motion.div>

          {/* Senses Grid */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-serif text-xl text-hot-pink mb-6 text-center">
              Experience This Episode
            </h2>
            <EpisodeSensesGrid senses={episode.senses} />
          </motion.div>

          {/* Food for Thought */}
          {episode.foodForThought && (
            <motion.div
              className="my-12 py-8 border-t border-b border-burgundy/15"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-hot-pink text-xs uppercase tracking-[0.2em] mb-4">
                Food for Thought
              </p>
              <p className="font-serif text-lg md:text-xl text-burgundy/80 italic leading-relaxed">
                {episode.foodForThought}
              </p>
            </motion.div>
          )}
        </article>

        {/* Footer */}
        <motion.footer
          className="mt-20 pt-12 border-t border-burgundy/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Episode Navigation */}
          <div className="flex justify-between items-start mb-12">
            <div className="flex-1">
              {prevEpisode && (
                <Link
                  href={`/episode/${prevEpisode.slug}`}
                  className="group block"
                >
                  <span className="text-xs uppercase tracking-wider text-burgundy/40 mb-1 block">
                    Previous
                  </span>
                  <span className="font-serif text-lg text-burgundy/70 group-hover:text-burgundy transition-colors">
                    &larr; {prevEpisode.title.replace(/^Episode \d+: /, '')}
                  </span>
                </Link>
              )}
            </div>
            <div className="flex-1 text-right">
              {nextEpisode && (
                <Link
                  href={`/episode/${nextEpisode.slug}`}
                  className="group block"
                >
                  <span className="text-xs uppercase tracking-wider text-burgundy/40 mb-1 block">
                    Next
                  </span>
                  <span className="font-serif text-lg text-burgundy/70 group-hover:text-burgundy transition-colors">
                    {nextEpisode.title.replace(/^Episode \d+: /, '')} &rarr;
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Scroll hint for next episode */}
          {prevEpisode && (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-burgundy/30 text-sm mb-2">Scroll down for next episode</p>
              <motion.div
                className="text-burgundy/40 text-2xl"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                &darr;
              </motion.div>
            </motion.div>
          )}

          {/* Bottom */}
          <div className="text-center pt-8 pb-4 border-t border-burgundy/10">
            <p className="text-burgundy/30 text-xs">
              &copy; {new Date().getFullYear()} The Bixt &middot; Rituals, Reality, and Recipes
            </p>
          </div>
        </motion.footer>

      </div>
      </div>
    </div>
  );
}
