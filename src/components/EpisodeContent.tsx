"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Episode } from "@/lib/episodes";
import TypewriterText from "./TypewriterText";
import TapedPhoto from "./TapedPhoto";
import EpisodeSensesGrid from "./EpisodeSensesGrid";

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
    <div ref={containerRef} className="min-h-screen -mt-20 pt-20" style={{ backgroundColor: "#2B4593" }}>
      {/* Header Image */}
      <div className="flex justify-center pt-8">
        <TapedPhoto
          src={episode.headerImage}
          alt={episode.title}
          caption={episode.date}
          rotation={1.5}
          isDark
          size="medium"
        />
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/episodes"
            className="inline-block text-sm text-cream/60 hover:text-cream transition-colors mb-8"
          >
            &larr; Back to episodes
          </Link>
        </motion.div>

        <article>
          <header className="mb-12">
            <motion.p
              className="text-sm text-cream/50 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              {episode.date}
            </motion.p>
            <h1 className="font-serif text-3xl md:text-4xl text-cream mb-4">
              <TypewriterText text={episode.title} wordByWord />
            </h1>
            <p className="text-cream/70 text-lg">
              <TypewriterText text={episode.subtitle} wordByWord delay={0.3} />
            </p>
          </header>

          {/* Brief description / excerpt */}
          <motion.p
            className="text-cream/90 text-lg leading-relaxed mb-12 font-serif italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {episode.excerpt}
          </motion.p>

          {/* Four Senses Grid */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-serif text-xl text-cream/80 mb-6 text-center">
              Experience This Episode
            </h2>
            <EpisodeSensesGrid senses={episode.fourSenses} />
          </motion.div>

          <motion.div
            className="prose prose-invert"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {episode.content.map((paragraph, index) => (
              <p
                key={index}
                className="text-cream/80 leading-relaxed mb-6"
              >
                {paragraph}
              </p>
            ))}
          </motion.div>

          {episode.images && episode.images.length > 0 && (
            <motion.section
              className="mt-16 pt-12 border-t border-cream/20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-serif text-2xl text-cream mb-8 text-center">
                <TypewriterText text="Moments" wordByWord />
              </h2>
              <div className="grid grid-cols-2 gap-4 justify-items-center">
                {episode.images.map((image, index) => (
                  <TapedPhoto
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    caption={image.caption}
                    rotation={image.rotation}
                    isDark
                    size="small"
                  />
                ))}
              </div>
            </motion.section>
          )}

          {episode.recipe && (
            <motion.section
              className="mt-16 pt-12 border-t border-cream/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-serif text-2xl text-cream mb-8">
                <TypewriterText text={episode.recipe.title} wordByWord />
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="text-sm uppercase tracking-wider text-cream/60 mb-4">
                    Ingredients
                  </h3>
                  <ul className="space-y-2">
                    {episode.recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-cream/80">
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <h3 className="text-sm uppercase tracking-wider text-cream/60 mb-4">
                    Instructions
                  </h3>
                  <ol className="space-y-3">
                    {episode.recipe.instructions.map((instruction, index) => (
                      <li key={index} className="text-cream/80">
                        <span className="font-medium text-cream">{index + 1}.</span>{" "}
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </motion.div>
              </div>
            </motion.section>
          )}
        </article>

        {/* Footer */}
        <motion.footer
          className="mt-20 pt-12 border-t border-cream/20"
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
                  <span className="text-xs uppercase tracking-wider text-cream/40 mb-1 block">
                    Previous
                  </span>
                  <span className="font-serif text-lg text-cream/70 group-hover:text-cream transition-colors">
                    ← {prevEpisode.title.replace(/^Episode \d+: /, '')}
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
                  <span className="text-xs uppercase tracking-wider text-cream/40 mb-1 block">
                    Next
                  </span>
                  <span className="font-serif text-lg text-cream/70 group-hover:text-cream transition-colors">
                    {nextEpisode.title.replace(/^Episode \d+: /, '')} →
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
              <p className="text-cream/30 text-sm mb-2">Scroll down for next episode</p>
              <motion.div
                className="text-cream/40 text-2xl"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                ↓
              </motion.div>
            </motion.div>
          )}

          {/* Bottom */}
          <div className="text-center pt-8 pb-4 border-t border-cream/10">
            <p className="text-cream/30 text-xs">
              © {new Date().getFullYear()} The Bixt · Rituals, Reality, and Recipes
            </p>
          </div>
        </motion.footer>

      </div>
    </div>
  );
}
