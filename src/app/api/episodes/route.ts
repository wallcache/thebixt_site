import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getAllEpisodes } from "@/lib/episodes";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const episodes = getAllEpisodes();
  const list = episodes.map((ep) => ({
    id: ep.id,
    slug: ep.slug,
    title: ep.title,
    subtitle: ep.subtitle,
    date: ep.date,
  }));
  return NextResponse.json(list);
}
