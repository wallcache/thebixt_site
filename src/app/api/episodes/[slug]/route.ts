import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const repo = process.env.GITHUB_REPO;
  const ghToken = process.env.GITHUB_TOKEN;
  if (!repo || !ghToken) {
    return NextResponse.json(
      { error: "GitHub not configured" },
      { status: 500 }
    );
  }

  // Find the file by slug — list files in the episodes directory
  const listRes = await fetch(
    `https://api.github.com/repos/${repo}/contents/content/episodes`,
    { headers: { Authorization: `token ${ghToken}` } }
  );
  if (!listRes.ok) {
    return NextResponse.json(
      { error: "Failed to list episodes" },
      { status: 500 }
    );
  }

  const files = (await listRes.json()) as Array<{
    name: string;
    download_url: string;
  }>;
  const match = files.find(
    (f) => f.name.endsWith(".md") && f.name.includes(slug)
  );
  if (!match) {
    return NextResponse.json({ error: "Episode not found" }, { status: 404 });
  }

  // Fetch the raw markdown
  const rawRes = await fetch(match.download_url);
  if (!rawRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch episode" },
      { status: 500 }
    );
  }

  const rawMarkdown = await rawRes.text();

  // Parse with gray-matter on the server
  const matter = (await import("gray-matter")).default;
  const { data, content } = matter(rawMarkdown);

  return NextResponse.json({ frontmatter: data, content: content.trim() });
}
