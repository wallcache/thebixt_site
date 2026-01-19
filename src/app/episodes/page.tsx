import { getAllEpisodes } from "@/lib/episodes";
import EpisodesContent from "@/components/EpisodesContent";

export default function Episodes() {
  const episodes = getAllEpisodes();

  return <EpisodesContent episodes={episodes} />;
}
