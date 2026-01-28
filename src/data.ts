// Types are now in src/lib/episodes.ts
// Episodes are loaded from content/episodes/*.md

export interface AboutContent {
  title: string;
  tagline: string;
  description: string[];
  team: {
    name: string;
    role: string;
  }[];
}

export const aboutContent: AboutContent = {
  title: "How To Make A Sandwich Smoky",
  tagline: "Rituals, Reality, and Recipes",
  description: [
    "Smoky is a newsletter that follows The Silver Spooners—a group of friends navigating love, life, and London.",
    "Each episode weaves together stories of friendship, quarter-life uncertainty, and the small rituals that keep us grounded. Think: heartfelt conversations over drinks in Kentish Town, Sunday morning scrambled eggs, crossing the river for the first time in weeks.",
    "It's about the in-between moments. The texts that turn into two-hour phone calls. The recipes shared between friends. The courage it takes to change—and the comfort of people who stay the same.",
    "New episodes drop when they're ready. Subscribe via WhatsApp to get Smoky delivered straight to your phone."
  ],
  team: [
    { name: "The Bixt", role: "Creator" }
  ]
};

export const siteConfig = {
  name: "Smoky",
  fullName: "How To Make A Sandwich Smoky",
  tagline: "Rituals, Reality, and Recipes",
  whatsappLink: "https://api.whatsapp.com/send?phone=447822032838&text=I+consent+to+being+sent+messages+by+The+Bixt%27s+_Smoky_+and+will+reply+UNSUBSCRIBE+should+this+change.+%F0%9F%91%91",
  colors: {
    cream: "#081E28",
    burgundy: "#E6E2C5"
  }
};
