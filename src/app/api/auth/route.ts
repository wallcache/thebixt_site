import { NextRequest, NextResponse } from "next/server";
import { hashPassword, verifyPasswordHash, createToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Missing password" }, { status: 400 });
    }

    const hash = await hashPassword(password);
    if (!verifyPasswordHash(hash)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = createToken();
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
