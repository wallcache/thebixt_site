"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import BackgroundVideo from "@/components/BackgroundVideo";
import DappledLight from "@/components/DappledLight";

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

function LatestEpisodeCard({ episode }: { episode: Episode }) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    setTilt({
      x: -(dy / rect.height) * 10,
      y: (dx / rect.width) * 10,
    });

    setOffset({
      x: dx * 0.06,
      y: dy * 0.06,
    });

    // Light position tracks cursor as % of card
    setLightPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setOffset({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const cardStagger = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease },
    },
  };

  const itemFadeLeft = {
    hidden: { opacity: 0, x: -15 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease },
    },
  };

  const lineDraw = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 0.8, ease },
    },
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={cardStagger}
    >
      <div style={{ perspective: 900 }}>
        <motion.div
          ref={cardRef}
          className="relative rounded-3xl overflow-hidden p-8 md:p-12 cursor-pointer"
          style={{
            background: "linear-gradient(135deg, rgba(230,226,197,0.07) 0%, rgba(230,226,197,0.02) 100%)",
            border: "1px solid rgba(230,226,197,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(230,226,197,0.08)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
          animate={{
            rotateX: tilt.x,
            rotateY: tilt.y,
            x: offset.x,
            y: offset.y,
            boxShadow: isHovered
              ? "0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(230,226,197,0.14)"
              : "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(230,226,197,0.08)",
          }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 22,
            mass: 0.5,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Light that follows cursor */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            animate={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(circle 400px at ${lightPos.x}% ${lightPos.y}%, rgba(230,226,197,0.1) 0%, transparent 70%)`,
            }}
            transition={{ opacity: { duration: 0.4 }, background: { duration: 0 } }}
          />

          {/* Edge highlight that shifts with tilt */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              border: "1px solid transparent",
              background: `linear-gradient(${135 + tilt.y * 2}deg, rgba(230,226,197,0.15) 0%, transparent 40%, transparent 60%, rgba(230,226,197,0.05) 100%) border-box`,
              mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
              WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
            }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Two-column layout — entire card is clickable */}
          <div
            className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12"
            onClick={() => router.push(`/episode/${episode.slug}`)}
          >
            {/* Left — Title & meta */}
            <div className="flex flex-col justify-between">
              <div>
                <motion.div
                  className="w-10 h-px bg-hot-pink origin-left mb-5"
                  variants={lineDraw}
                />
                <motion.p
                  className="text-burgundy/40 text-xs uppercase tracking-[0.2em] mb-3"
                  variants={itemFadeLeft}
                >
                  {episode.date}
                </motion.p>
                <motion.h2
                  className="font-serif text-3xl md:text-4xl text-burgundy mb-2"
                  variants={itemFadeLeft}
                >
                  {episode.title}
                </motion.h2>
                <motion.p
                  className="text-burgundy/55 text-base md:text-lg"
                  variants={itemFadeLeft}
                >
                  {episode.subtitle}
                </motion.p>
              </div>
            </div>

            {/* Right — Excerpt & CTA */}
            <div className="flex flex-col justify-between">
              <motion.p
                className="text-burgundy/50 text-base leading-relaxed mb-8"
                variants={itemFadeUp}
              >
                {episode.excerpt}
              </motion.p>
              <motion.div variants={itemFadeUp}>
                <span
                  className="inline-block border border-burgundy/30 text-burgundy px-8 py-3 text-sm tracking-wider uppercase hover:bg-hot-pink hover:text-cream hover:border-hot-pink transition-all duration-300 rounded-full"
                >
                  Read Episode &rarr;
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function HomeContent({ latestEpisode, recentEpisodes }: HomeContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const oRef = useRef<HTMLSpanElement>(null);
  const textBoxRef = useRef<HTMLDivElement>(null);

  // Measured position of the O's center — used for transform-origin and clip-path
  const [originPct, setOriginPct] = useState("50% 50%");
  const clipCenterRef = useRef("50% 50%");

  useEffect(() => {
    const measure = () => {
      const oEl = oRef.current;
      const boxEl = textBoxRef.current;
      if (!oEl || !boxEl) return;

      const oRect = oEl.getBoundingClientRect();
      const boxRect = boxEl.getBoundingClientRect();

      // letter-spacing adds trailing space after each char — exclude it
      // so we measure the visual center of the O glyph, not the O + trailing gap
      const cs = window.getComputedStyle(oEl);
      const ls = parseFloat(cs.letterSpacing) || 0;
      const oVisualCenterX = oRect.left + (oRect.width - ls) / 2;
      const oVisualCenterY = oRect.top + oRect.height / 2;

      // Transform-origin: O glyph center relative to the text box
      const ox = ((oVisualCenterX - boxRect.left) / boxRect.width) * 100;
      const oy = ((oVisualCenterY - boxRect.top) / boxRect.height) * 100;
      setOriginPct(`${ox.toFixed(1)}% ${oy.toFixed(1)}%`);

      // Clip-path center: O glyph center relative to viewport
      const vx = (oVisualCenterX / window.innerWidth) * 100;
      const vy = (oVisualCenterY / window.innerHeight) * 100;
      clipCenterRef.current = `${vx.toFixed(1)}% ${vy.toFixed(1)}%`;
    };

    document.fonts.ready.then(measure);
  }, []);

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
  const clipPath = useTransform(circleRadius, (r) => `circle(${r}% at ${clipCenterRef.current})`);
  // Portal content fades in as circle grows
  const portalOpacity = useTransform(heroProgress, [0.1, 0.4], [0, 1]);
  // Dappled light fades out as scroll begins
  const dappledScrollOpacity = useTransform(heroProgress, [0, 0.15], [1, 0]);

  // Delay dappled light fade-in until after loading screen (~2.2s)
  const [dappledVisible, setDappledVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setDappledVisible(true), 2200);
    return () => clearTimeout(timer);
  }, []);

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
          {/* Dappled light layer — fades in after loading, fades out on scroll */}
          <motion.div
            className="absolute inset-0 z-[5]"
            initial={{ opacity: 0 }}
            animate={{ opacity: dappledVisible ? 1 : 0 }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.div className="w-full h-full" style={{ opacity: dappledScrollOpacity }}>
              <DappledLight speed={0.8} mouseInfluence={1.2} />
            </motion.div>
          </motion.div>

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
              ref={textBoxRef}
              style={{
                scale: heroScale,
                opacity: textOpacity,
                transformOrigin: originPct,
              }}
            >
              <h1 className="font-serif text-5xl md:text-7xl text-burgundy tracking-[0.15em] whitespace-nowrap">
                SM<span ref={oRef}>O</span>KY<span className="text-hot-pink">.</span>
              </h1>
            </motion.div>
          </div>

          {/* Bouncing scroll chevron */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: dappledVisible ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ opacity: dappledScrollOpacity }}
          >
            <motion.svg
              width="28"
              height="16"
              viewBox="0 0 28 16"
              fill="none"
              className="text-burgundy/50"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <path
                d="M2 2L14 13L26 2"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.div>
        </div>
      </div>

      {/* Section 3 — Latest Episode Feature (Liquid Glass Card) */}
      <section className="py-24 md:py-32 px-6 relative z-10">
        <LatestEpisodeCard episode={latestEpisode} />
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
          <GetSmokyButton variant="dark" />
          <p className="text-burgundy/30 text-xs tracking-[0.2em] uppercase mt-16">
            &copy; 2025 The Bixt &middot; Rituals, Reality, and Recipes
          </p>
        </motion.div>
      </section>
    </div>
  );
}
