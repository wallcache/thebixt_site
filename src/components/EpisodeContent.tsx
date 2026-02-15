"use client";

import Link from "next/link";
import { useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Episode, Sense } from "@/lib/episodes";
import TypewriterText from "./TypewriterText";
import EpisodeSensesGrid from "./EpisodeSensesGrid";
import DappledLight from "./DappledLight";

function highlightReferences(
  text: string,
  senses: Sense[],
  onClickRef: () => void,
): React.ReactNode {
  // Build a list of {start, end} match positions for all storyReferences
  const refs = senses
    .filter((s) => s.storyReference)
    .map((s) => s.storyReference!);

  if (refs.length === 0) return text;

  const lower = text.toLowerCase();
  const matches: { start: number; end: number }[] = [];

  for (const ref of refs) {
    const idx = lower.indexOf(ref.toLowerCase());
    if (idx !== -1) {
      matches.push({ start: idx, end: idx + ref.length });
    }
  }

  if (matches.length === 0) return text;

  // Sort by position and remove overlaps
  matches.sort((a, b) => a.start - b.start);
  const merged: { start: number; end: number }[] = [matches[0]];
  for (let i = 1; i < matches.length; i++) {
    const prev = merged[merged.length - 1];
    if (matches[i].start <= prev.end) {
      prev.end = Math.max(prev.end, matches[i].end);
    } else {
      merged.push(matches[i]);
    }
  }

  // Build JSX fragments
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const m of merged) {
    if (cursor < m.start) {
      parts.push(text.slice(cursor, m.start));
    }
    parts.push(
      <span
        key={m.start}
        onClick={onClickRef}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClickRef(); }}
        className="cursor-pointer"
        style={{
          textDecoration: "underline",
          textDecorationColor: "var(--hot-pink)",
          textUnderlineOffset: "4px",
          textDecorationThickness: "1px",
        }}
      >
        {text.slice(m.start, m.end)}
      </span>
    );
    cursor = m.end;
  }
  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
}

interface EpisodeContentProps {
  episode: Episode;
  allEpisodes: Episode[];
}

export default function EpisodeContent({ episode, allEpisodes }: EpisodeContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sensesRef = useRef<HTMLDivElement>(null);

  const scrollToSenses = useCallback(() => {
    sensesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  const currentIndex = allEpisodes.findIndex((ep) => ep.id === episode.id);
  const nextEpisode = currentIndex > 0 ? allEpisodes[currentIndex - 1] : null;
  const prevEpisode = currentIndex < allEpisodes.length - 1 ? allEpisodes[currentIndex + 1] : null;

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
          </header>

          <motion.div
            className="prose prose-invert mb-16"
            style={{ fontFamily: "var(--font-body)" }}
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
                {highlightReferences(paragraph, episode.senses, scrollToSenses)}
              </p>
            ))}
          </motion.div>

          {/* Senses Grid */}
          <motion.div
            ref={sensesRef}
            className="mb-16 scroll-mt-24"
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

          {/* Have Your Say */}
          <motion.div
            className="my-12 py-8 border-t border-b border-burgundy/15 text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-hot-pink text-xs uppercase tracking-[0.2em] mb-4">
              Have Your Say
            </p>
            <a
              href="mailto:alex.meits@thebixt.com"
              className="inline-block border border-hot-pink/60 text-burgundy px-8 py-3 text-sm tracking-wider uppercase hover:bg-hot-pink hover:text-cream hover:border-hot-pink transition-all duration-300 rounded-full"
            >
              Get In Touch
            </a>
          </motion.div>
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
