"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import TypewriterText from "@/components/TypewriterText";
import DappledLight from "@/components/DappledLight";

const characters = [
  {
    name: "Archie",
    initials: "A",
    image: "/characters/archie.png",
    blurb: "One of the boys. Currently off the market — dating G, and somehow keeping it together.",
  },
  {
    name: "G",
    initials: "G",
    image: "/characters/g.png",
    blurb: "Archie's girlfriend, Birdie's best friend, and the glue holding everyone's social calendar together.",
  },
  {
    name: "Baz",
    initials: "B",
    image: "/characters/baz.png",
    blurb: "Racing enthusiast, one of the boys, and the one most likely to disappear to Silverstone on a Tuesday.",
  },
  {
    name: "Max",
    initials: "M",
    image: "/characters/max.png",
    blurb: "One of the boys. Single, mingling, and treating London like his personal dating app.",
  },
  {
    name: "Teddy",
    initials: "T",
    image: "/characters/teddy.png",
    blurb: "One of the boys. The quiet operator — says little, notices everything.",
  },
  {
    name: "Flick",
    fullName: "Felicity Bhat",
    initials: "F",
    image: "/characters/flick.png",
    blurb: "Tech entrepreneur, best friends with G, and the one who always has a plan B (and C, and D).",
  },
  {
    name: "Birdie",
    fullName: "Beatrice Aelfric",
    initials: "B",
    blurb: "G's best friend, has history with Baz, and the kind of person who makes every room more interesting.",
  },
];

export default function SilverSpoonersContent() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DappledLight speed={0.8} mouseInfluence={1.2} />
      </div>
      <div className="relative z-10">
        {/* Header */}
        <section className="px-6 md:px-12 pt-12 pb-8 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl text-burgundy mb-3">
              <TypewriterText text="The Silver Spooners" wordByWord />
            </h1>
            <p className="text-burgundy/60 text-base max-w-xl mx-auto">
              The friends, lovers, and troublemakers at the heart of the story.
            </p>
          </div>
        </section>

        {/* Character Grid */}
        <section className="px-6 md:px-12 pb-24 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((char, i) => (
              <motion.div
                key={char.name}
                className="border border-burgundy/20 bg-cream rounded-lg overflow-hidden hover:border-hot-pink/40 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.06,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                {/* Character image */}
                <div className="w-full aspect-[4/3] relative overflow-hidden bg-[#1E0A32]">
                  {char.image ? (
                    <Image
                      src={char.image}
                      alt={char.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#1E0A32]">
                      <span className="font-serif text-5xl font-semibold text-hot-pink/60 select-none">
                        {char.initials}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="font-serif text-xl text-burgundy mb-1">
                    {char.name}
                  </h2>
                  {char.fullName && (
                    <p className="text-xs text-burgundy/40 uppercase tracking-wider mb-2">
                      {char.fullName}
                    </p>
                  )}
                  <p className="text-burgundy/60 text-sm leading-relaxed">
                    {char.blurb}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
