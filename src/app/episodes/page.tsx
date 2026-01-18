"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { episodes } from "@/data";
import TypewriterText from "@/components/TypewriterText";

export default function Episodes() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
      <header className="mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-burgundy mb-4">
          <TypewriterText text="Episodes" />
        </h1>
        <p className="text-burgundy/70 text-lg tracking-wide">
          <TypewriterText text="The story so far." delay={0.3} />
        </p>
      </header>

      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {episodes.map((episode, index) => (
            <motion.div
              key={episode.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Link href={`/episode/${episode.slug}`} className="block group">
                <article className="border-b border-burgundy/20 pb-8 transition-all hover:border-burgundy/40">
                  <p className="text-sm text-burgundy/50 mb-2">{episode.date}</p>
                  <h2 className="font-serif text-2xl text-burgundy mb-2 group-hover:opacity-70 transition-opacity">
                    {episode.title}
                  </h2>
                  <p className="text-burgundy/60">{episode.subtitle}</p>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
