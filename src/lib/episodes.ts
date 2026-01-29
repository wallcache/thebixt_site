import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Sense {
  type: string;
  brand: string;
  description: string;
  storyReference?: string;
  link?: string;
}

export interface Episode {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  headerImage: string;
  excerpt: string;
  content: string[];
  senses: Sense[];
  foodForThought?: string;
}

const episodesDirectory = path.join(process.cwd(), "content/episodes");

export function getAllEpisodes(): Episode[] {
  // Check if directory exists
  if (!fs.existsSync(episodesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(episodesDirectory);
  const episodes = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const fullPath = path.join(episodesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      // Split content into paragraphs
      const paragraphs = content
        .split("\n\n")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        subtitle: data.subtitle,
        date: data.date,
        headerImage: data.headerImage,
        excerpt: data.excerpt,
        content: paragraphs,
        senses: data.senses || [],
        foodForThought: data.foodForThought,
      } as Episode;
    })
    .sort((a, b) => b.id - a.id); // Sort by id descending (newest first)

  return episodes;
}

export function getEpisodeBySlug(slug: string): Episode | undefined {
  const episodes = getAllEpisodes();
  return episodes.find((episode) => episode.slug === slug);
}

export function getLatestEpisode(): Episode | undefined {
  const episodes = getAllEpisodes();
  return episodes[0];
}
