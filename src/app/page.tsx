import { getLatestEpisode, getAllEpisodes } from "@/lib/episodes";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  const latestEpisode = getLatestEpisode();
  const recentEpisodes = getAllEpisodes().slice(0, 5);

  if (!latestEpisode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-burgundy/60">No episodes yet. Add one to content/episodes/</p>
      </div>
    );
  }

  return <HomeContent latestEpisode={latestEpisode} recentEpisodes={recentEpisodes} />;
}
