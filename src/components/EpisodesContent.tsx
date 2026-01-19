"use client";

import Link from "next/link";
import TypewriterText from "@/components/TypewriterText";
import { Episode } from "@/lib/episodes";

interface EpisodesContentProps {
  episodes: Episode[];
}

export default function EpisodesContent({ episodes }: EpisodesContentProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
      <header className="mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-burgundy mb-4">
          <TypewriterText text="Episodes" wordByWord />
        </h1>
        <p className="text-burgundy/70 text-lg tracking-wide">
          <TypewriterText text="The story so far." wordByWord delay={0.15} />
        </p>
      </header>

      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {episodes.map((episode) => (
            <Link key={episode.id} href={`/episode/${episode.slug}`} className="block group">
              <article className="border-b border-burgundy/20 pb-8 transition-all hover:border-burgundy/40">
                <p className="text-sm text-burgundy/50 mb-2">{episode.date}</p>
                <h2 className="font-serif text-2xl text-burgundy mb-2 group-hover:opacity-70 transition-opacity">
                  {episode.title}
                </h2>
                <p className="text-burgundy/60">{episode.subtitle}</p>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
