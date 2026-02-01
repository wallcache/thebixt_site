import { getAllEpisodes } from "@/lib/episodes";
import FeaturedContent from "@/components/FeaturedContent";

export const metadata = {
  title: "Featured | Smoky",
  description: "Every brand, collab, and recommendation mentioned across all episodes of Smoky.",
};

interface FeaturedSense {
  type: string;
  brand: string;
  description: string;
  storyReference?: string;
  link?: string;
  episodeTitle: string;
  episodeDate: string;
  episodeSlug: string;
}

export default function FeaturedPage() {
  const episodes = getAllEpisodes();

  // Flatten senses from all episodes, sorted newest first
  const allSenses: FeaturedSense[] = [...episodes]
    .sort((a, b) => b.id - a.id) // newest first
    .flatMap((ep) =>
      ep.senses.map((sense) => ({
        ...sense,
        episodeTitle: ep.title,
        episodeDate: ep.date,
        episodeSlug: ep.slug,
      }))
    );

  return <FeaturedContent senses={allSenses} />;
}
