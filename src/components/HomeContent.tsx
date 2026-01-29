"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import BackgroundVideo from "@/components/BackgroundVideo";
import TapedPhoto from "@/components/TapedPhoto";
import GetSmokyButton from "@/components/GetSmokyButton";
import { Episode } from "@/lib/episodes";

interface HomeContentProps {
  latestEpisode: Episode;
  recentEpisodes: Episode[];
}

const ease: [number, number, number, number] = [0.4, 0, 0.2, 1];

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
};

const staggerContainerSlow = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUpSlow = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease },
  },
};

export default function HomeContent({ latestEpisode, recentEpisodes }: HomeContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Zoom IN: starts at 1x, scales up to 50x over the scroll
  const heroScale = useTransform(heroProgress, [0, 0.7], [1, 50]);
  // Text fades out as it zooms past the viewer
  const textOpacity = useTransform(heroProgress, [0.3, 0.6], [1, 0]);
  // Circular clip-path expands to reveal portal content through the O
  const circleRadius = useTransform(heroProgress, [0.05, 0.65], [0, 110]);
  const clipPath = useTransform(circleRadius, (r) => `circle(${r}% at 50% 50%)`);
  // Portal content fades in as circle grows
  const portalOpacity = useTransform(heroProgress, [0.1, 0.4], [0, 1]);

  const gridEpisodes = recentEpisodes.slice(1, 5);

  const senseLabels = ["See", "Hear", "Try", "Touch"] as const;
  const senseKeys = ["see", "hear", "try", "touch"] as const;

  return (
    <div className="relative">
      <BackgroundVideo />

      {/* Section 1 — Hero with zoom-through-O portal */}
      <div ref={heroRef} className="relative z-10" style={{ height: "300vh" }}>
        <div
          className="sticky top-0 h-screen overflow-hidden"
          style={{ backgroundColor: "#081E28" }}
        >
          {/* Portal content layer (behind) — revealed through the O via clip-path */}
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
            style={{ clipPath, opacity: portalOpacity }}
          >
            <div className="max-w-[800px] text-center">
              <p className="font-serif text-2xl md:text-4xl text-burgundy leading-relaxed md:leading-relaxed">
                A newsletter where escapism meets realism.
              </p>
              <p className="font-serif text-2xl md:text-4xl text-burgundy leading-relaxed md:leading-relaxed mt-6">
                Through the fictional world of The Silver Spooners — friends navigating love, life, and London — we invite you to fall back in love with your own story.
              </p>
              <div className="w-16 h-px bg-hot-pink mt-12 mx-auto" />
            </div>
          </motion.div>

          {/* Text layer (in front) — scales up through the O */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <motion.div
              style={{
                scale: heroScale,
                opacity: textOpacity,
                // Origin at center of the O counter-space
                // O is ~52% across "Smoky.", ~43% from top (above center due to descenders)
                transformOrigin: "52% 43%",
              }}
            >
              <h1 className="font-serif text-7xl md:text-9xl text-burgundy tracking-tight whitespace-nowrap">
                Smoky<span className="text-hot-pink">.</span>
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Section 3 — Latest Episode Feature */}
      <section className="py-24 md:py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <TapedPhoto
              src={latestEpisode.headerImage}
              alt={latestEpisode.title}
              caption={latestEpisode.date}
              rotation={-2}
              size="large"
            />
          </motion.div>

          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="w-12 h-px bg-hot-pink mb-6 mx-auto md:mx-0" />
            <p className="text-burgundy/40 text-xs uppercase tracking-[0.2em] mb-4">
              {latestEpisode.date}
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-burgundy mb-3">
              {latestEpisode.title}
            </h2>
            <p className="text-burgundy/60 text-lg mb-6">
              {latestEpisode.subtitle}
            </p>
            <p className="text-burgundy/50 text-base leading-relaxed mb-8">
              {latestEpisode.excerpt}
            </p>
            <Link
              href={`/episode/${latestEpisode.slug}`}
              className="inline-block border border-burgundy/30 text-burgundy px-8 py-3 text-sm tracking-wider uppercase hover:bg-burgundy hover:text-cream transition-all duration-300"
            >
              Read Episode &rarr;
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 4 — Recent Episodes Grid */}
      <section className="py-24 md:py-32 px-6 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <h2 className="font-serif text-3xl md:text-5xl text-burgundy text-center mb-16">
            The Story So Far
          </h2>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {gridEpisodes.map((episode) => (
            <motion.div key={episode.slug} variants={fadeUp}>
              <Link
                href={`/episode/${episode.slug}`}
                className="block p-6 border-b border-burgundy/10 hover:border-hot-pink transition-all duration-300 group hover:-translate-y-1"
              >
                <p className="text-burgundy/40 text-xs uppercase tracking-[0.2em] mb-2">
                  {episode.date}
                </p>
                <h3 className="font-serif text-xl text-burgundy mb-1 group-hover:text-hot-pink transition-colors">
                  {episode.title}
                </h3>
                <p className="text-burgundy/50 text-sm">
                  {episode.subtitle}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease }}
        >
          <Link
            href="/episodes"
            className="inline-block border border-burgundy/30 text-burgundy px-8 py-3 text-sm tracking-wider uppercase hover:bg-burgundy hover:text-cream transition-all duration-300"
          >
            View All Episodes &rarr;
          </Link>
        </motion.div>
      </section>

      {/* Section 5 — Four Senses Showcase */}
      <section className="py-24 md:py-32 px-6 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <h2 className="font-serif text-3xl md:text-5xl text-burgundy mb-4">
            Experience Every Episode
          </h2>
          <p className="text-burgundy/50 text-sm tracking-[0.3em] uppercase">
            Through four senses
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto grid grid-cols-2 gap-4 md:gap-6"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {senseKeys.map((key, index) => {
            const sense = latestEpisode.fourSenses[key];
            return (
              <motion.div
                key={key}
                className="relative overflow-hidden group"
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.7, ease },
                  },
                }}
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={sense.image}
                    alt={sense.caption}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 md:top-4 md:left-4">
                    <span className="text-xs uppercase tracking-[0.2em] text-white/70">
                      {senseLabels[index]}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
                    <p className="text-white text-sm md:text-base font-serif">
                      {sense.caption}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Section 6 — Subscribe CTA */}
      <section className="py-32 md:py-40 px-6 relative z-10">
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
        >
          <h2 className="font-serif text-3xl md:text-5xl text-burgundy mb-10">
            Don&apos;t miss the next chapter.
          </h2>
          <div className="relative">
            <div
              className="absolute inset-0 -m-8 rounded-full blur-3xl opacity-20"
              style={{ background: "radial-gradient(circle, #FD05A0, transparent 70%)" }}
            />
            <GetSmokyButton variant="dark" />
          </div>
          <p className="text-burgundy/30 text-xs tracking-[0.2em] uppercase mt-16">
            &copy; 2025 The Bixt &middot; Rituals, Reality, and Recipes
          </p>
        </motion.div>
      </section>
    </div>
  );
}
