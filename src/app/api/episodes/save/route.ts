import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import matter from "gray-matter";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const repo = process.env.GITHUB_REPO;
  const ghToken = process.env.GITHUB_TOKEN;
  if (!repo || !ghToken) {
    return NextResponse.json(
      { error: "GitHub not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const {
      id,
      slug,
      title,
      subtitle,
      date,
      headerImage,
      excerpt,
      senses,
      foodForThought,
      content,
    } = body;

    // Build frontmatter object
    const frontmatter: Record<string, unknown> = {
      id: Number(id),
      slug,
      title,
      subtitle,
      date,
      headerImage,
      excerpt,
      senses: senses || [],
    };
    if (foodForThought) {
      frontmatter.foodForThought = foodForThought;
    }

    // Generate markdown using gray-matter.stringify
    const markdown = matter.stringify(content || "", frontmatter);

    // Filename: zero-padded id + slug
    const paddedId = String(id).padStart(2, "0");
    const filename = `${paddedId}-${slug}.md`;
    const filePath = `content/episodes/${filename}`;

    // Check if file already exists (need SHA for updates)
    const ghHeaders = {
      Authorization: `token ${ghToken}`,
      Accept: "application/vnd.github.v3+json",
    };

    let existingSha: string | undefined;
    const checkRes = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      { headers: ghHeaders }
    );
    if (checkRes.ok) {
      const existing = (await checkRes.json()) as { sha: string };
      existingSha = existing.sha;
    }

    // Commit file via GitHub Contents API
    const commitBody: Record<string, string> = {
      message: existingSha
        ? `Update episode: ${title}`
        : `Add new episode: ${title}`,
      content: Buffer.from(markdown).toString("base64"),
    };
    if (existingSha) {
      commitBody.sha = existingSha;
    }

    const putRes = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      {
        method: "PUT",
        headers: ghHeaders,
        body: JSON.stringify(commitBody),
      }
    );

    if (!putRes.ok) {
      const err = await putRes.text();
      return NextResponse.json(
        { error: `GitHub API error: ${err}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: existingSha ? "Episode updated" : "Episode created",
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Server error: ${err}` },
      { status: 500 }
    );
  }
}
