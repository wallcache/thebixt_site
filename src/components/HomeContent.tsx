"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import BackgroundVideo from "@/components/BackgroundVideo";
import DappledLight from "@/components/DappledLight";
import SmokyLight from "@/components/SmokyLight";

import GetSmokyButton from "@/components/GetSmokyButton";
import EpisodeSensesGrid from "@/components/EpisodeSensesGrid";
import { Episode } from "@/lib/episodes";
import { siteConfig } from "@/data";

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

function MagneticCTA({
  href,
  external,
  variant = "pink",
  children,
}: {
  href: string;
  external?: boolean;
  variant?: "pink" | "cream";
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    setPos({ x: dx * 0.3, y: dy * 0.3 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPos({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  const isPink = variant === "pink";
  const linkProps = external
    ? { href, target: "_blank" as const, rel: "noopener noreferrer" }
    : { href };

  const glowColor = isPink ? "rgba(253, 5, 160," : "rgba(230, 226, 197,";
  const fillColor = isPink ? "#FD05A0" : "#E6E2C5";

  return (
    <motion.a
      ref={ref}
      {...linkProps}
      className={`relative inline-block px-12 py-5 text-lg tracking-widest font-medium rounded-full border ${
        isPink
          ? "border-hot-pink/60 text-burgundy"
          : "border-burgundy/30 text-burgundy"
      }`}
      style={{ backgroundColor: "transparent" }}
      animate={{
        x: pos.x,
        y: pos.y,
        scale: hovered ? 1.1 : 1,
        color: hovered
          ? isPink ? "#E6E2C5" : "#081E28"
          : undefined,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow */}
      <motion.div
        className="absolute inset-0 rounded-full -z-10"
        animate={{
          boxShadow: hovered
            ? `0 0 30px 8px ${glowColor}0.5), 0 0 60px 20px ${glowColor}0.2)`
            : `0 0 15px 4px ${glowColor}0.25), 0 0 30px 10px ${glowColor}0.08)`,
        }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Hover fill */}
      <motion.div
        className="absolute inset-0 rounded-full -z-10"
        style={{ backgroundColor: fillColor }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}

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

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Pink background glow */}
      <div
        className="absolute -inset-8 rounded-[3rem] blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, #FD05A0, transparent 70%)" }}
      />
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
                <div className="w-10 h-px bg-hot-pink mb-5" />
                <p className="text-burgundy/40 text-xs uppercase tracking-[0.2em] mb-3">
                  Episode {episode.id}
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-burgundy mb-2">
                  {episode.title}
                </h2>
                <p className="text-burgundy/55 text-base md:text-lg">
                  {episode.subtitle}
                </p>
              </div>
            </div>

            {/* Right — Excerpt & CTA */}
            <div className="flex flex-col justify-between">
              <p className="text-burgundy/50 text-base leading-relaxed mb-8">
                {episode.excerpt}
              </p>
              <div>
                <span
                  className="inline-block border border-burgundy/30 text-burgundy px-8 py-3 text-sm tracking-wider uppercase hover:bg-hot-pink hover:text-cream hover:border-hot-pink transition-all duration-300 rounded-full"
                >
                  Read Episode &rarr;
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
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
  // Text fades out as it zooms past the viewer — disappears before scaling clips it
  const textOpacity = useTransform(heroProgress, [0.1, 0.3], [1, 0]);
  // Circular clip-path expands to reveal portal content through the O
  const circleRadius = useTransform(heroProgress, [0.05, 0.65], [0, 110]);
  const clipPath = useTransform(circleRadius, (r) => `circle(${r}% at ${clipCenterRef.current})`);
  // Portal content fades in as circle grows
  const portalOpacity = useTransform(heroProgress, [0.1, 0.4], [0, 1]);
  // Smoky light fades out as scroll begins
  const smokyScrollOpacity = useTransform(heroProgress, [0, 0.15], [1, 0]);
  // Rain fades in as we pass through the O portal
  const rainOpacity = useTransform(heroProgress, [0.1, 0.3], [0, 1]);
  // Hero background fades to transparent so rain shows through
  const heroBgOpacity = useTransform(heroProgress, [0.15, 0.4], [1, 0]);
  const heroBg = useTransform(heroBgOpacity, (o) => `rgba(8, 30, 40, ${o})`);

  // Delay smoky light fade-in until after loading screen (~2.2s)
  const [smokyVisible, setSmokyVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setSmokyVisible(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  const gridEpisodes = recentEpisodes.slice(1, 5);

  return (
    <div className="relative">
      <BackgroundVideo />

      {/* Section 1 — Hero with zoom-through-O portal */}
      <div ref={heroRef} className="relative z-10" style={{ height: "200vh" }}>
        <motion.div
          className="sticky top-0 h-screen overflow-hidden"
          style={{ backgroundColor: heroBg }}
        >
          {/* Smoky light layer — fades in after loading, fades out on scroll */}
          <motion.div
            className="absolute inset-0 z-[5]"
            initial={{ opacity: 0 }}
            animate={{ opacity: smokyVisible ? 1 : 0 }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.div className="w-full h-full" style={{ opacity: smokyScrollOpacity }}>
              <SmokyLight speed={0.6} mouseInfluence={1.0} />
            </motion.div>
          </motion.div>

          {/* Portal content layer (behind) — revealed through the O via clip-path */}
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
            style={{ clipPath, opacity: portalOpacity }}
          >
            <div className="max-w-[800px] text-center">
              <p className="font-serif text-2xl md:text-4xl text-burgundy leading-relaxed md:leading-relaxed">
                A newsletter where the story could be fictional but the recommendations are impeccably real.
              </p>
              <p className="font-serif text-2xl md:text-4xl text-burgundy leading-relaxed md:leading-relaxed mt-6">
                Follow The Silver Spooners through London... then steal their taste.
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
                SM<span ref={oRef}>O</span>KY<Link href="/admin" className="text-hot-pink pointer-events-auto" style={{ textDecoration: 'none' }}>.</Link>
              </h1>
            </motion.div>
          </div>

          {/* Bouncing scroll chevron */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: smokyVisible ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ opacity: smokyScrollOpacity }}
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
        </motion.div>
      </div>

      {/* Rain layer — fades in after portal zoom-through, stays for remaining sections */}
      <motion.div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{ opacity: rainOpacity }}
      >
        <DappledLight speed={0.8} mouseInfluence={1.2} />
      </motion.div>

      {/* Section 3 — Senses Showcase */}
      <section className="py-12 md:py-16 px-6 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <h2 className="font-serif text-3xl md:text-5xl text-burgundy mb-4">
            Experience Every Episode
          </h2>
          <p className="text-burgundy/50 text-sm tracking-[0.3em] uppercase">
            Through your senses
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <EpisodeSensesGrid senses={latestEpisode.senses} centerButtonHref={`/episode/${latestEpisode.slug}`} />
        </div>
      </section>

      {/* Section 3b — CTA Buttons */}
      <section className="pb-12 md:pb-16 px-6 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <MagneticCTA
            href={siteConfig.whatsappLink}
            external
            variant="pink"
          >
            GET SMOKY
          </MagneticCTA>
          <div className="md:hidden">
            <MagneticCTA
              href={`/episode/${latestEpisode.slug}`}
              variant="cream"
            >
              Read Latest Episode
            </MagneticCTA>
          </div>
        </motion.div>
      </section>

      {/* Section 4 — Latest Episode Feature (Liquid Glass Card) */}
      <section className="py-12 md:py-20 px-6 relative z-10">
        <LatestEpisodeCard episode={latestEpisode} />
      </section>

      {/* Section 5 — Recent Episodes Grid */}
      <section className="py-12 md:py-20 px-6 relative z-10">
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

      {/* Section 6 — Subscribe CTA */}
      <section className="py-16 md:py-24 px-6 relative z-10">
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
            &copy; 2025 The Bixt
          </p>
        </motion.div>
      </section>
    </div>
  );
}
