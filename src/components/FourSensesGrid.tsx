"use client";

import { motion } from "framer-motion";
import SenseCard from "./SenseCard";

interface SenseItem {
  title: string;
  subtitle: string;
  image: string;
  link?: string;
}

interface FourSensesGridProps {
  senses?: SenseItem[];
}

// Default sense items - can be overridden via props for CMS flexibility
const defaultSenses: SenseItem[] = [
  {
    title: "See",
    subtitle: "Eyes",
    image: "/content/london_girlys/tube-girls.png",
    link: "#see",
  },
  {
    title: "Hear",
    subtitle: "Ears",
    image: "/content/london_girlys/abbey-road.png",
    link: "#hear",
  },
  {
    title: "Try",
    subtitle: "Mouth",
    image: "/content/london_girlys/trench-coat.png",
    link: "#try",
  },
  {
    title: "Touch",
    subtitle: "Hands",
    image: "/content/london_girlys/escalator.png",
    link: "#touch",
  },
];

export default function FourSensesGrid({ senses = defaultSenses }: FourSensesGridProps) {
  // All four cards appear simultaneously (staggerChildren: 0)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0, // All at once - equality between senses
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <motion.section
      className="w-full max-w-6xl mx-auto px-6 md:px-12 py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Section header */}
      <motion.div
        className="text-center mb-12"
        variants={itemVariants}
      >
        <h2 className="font-serif text-3xl md:text-4xl text-burgundy mb-2">
          The Four Senses
        </h2>
        <p className="text-burgundy/60 text-sm tracking-wider uppercase">
          Experience London through every sense
        </p>
      </motion.div>

      {/* Grid - 2x2 on desktop, 1 column on mobile */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        variants={containerVariants}
      >
        {senses.map((sense) => (
          <motion.div
            key={sense.title}
            variants={itemVariants}
          >
            <SenseCard
              title={sense.title}
              subtitle={sense.subtitle}
              image={sense.image}
              link={sense.link}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
