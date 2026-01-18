import { notFound } from "next/navigation";
import { episodes } from "@/data";
import EpisodeContent from "@/components/EpisodeContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return episodes.map((episode) => ({
    slug: episode.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const episode = episodes.find((ep) => ep.slug === slug);

  if (!episode) {
    return { title: "Episode Not Found" };
  }

  return {
    title: `${episode.title} | Smoky`,
    description: episode.content[0],
  };
}

export default async function EpisodePage({ params }: Props) {
  const { slug } = await params;
  const episode = episodes.find((ep) => ep.slug === slug);

  if (!episode) {
    notFound();
  }

  return <EpisodeContent episode={episode} />;
}
