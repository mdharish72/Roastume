import { authOptions } from "@/lib/auth";
import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ResumeScoreRow = {
  id: string;
  likes_count: number | null;
  comments_count: number | null;
  created_at: string;
};

function toScoreRow(r: ResumeScoreRow) {
  const likes = r.likes_count ?? 0;
  const comments = r.comments_count ?? 0;
  const score = likes + comments;
  const createdAt = new Date(r.created_at).getTime();
  return { id: r.id, likes, comments, score, createdAt };
}

function upsertTopN<T>(
  top: T[],
  candidate: T,
  compare: (a: T, b: T) => number,
  limit: number
) {
  top.push(candidate);
  top.sort(compare);
  if (top.length > limit) top.length = limit;
}

// GET /api/resumes/hot?limit=3 - Fetch top resumes by (likes_count + comments_count)
export async function GET(request: NextRequest) {
  try {
    // Keep session read to align with other routes, even if not strictly required.
    await getServerSession(authOptions);

    const { searchParams } = new URL(request.url);
    const limitRaw = Number(searchParams.get("limit") || 3);
    const limit = Math.max(
      1,
      Math.min(10, Number.isFinite(limitRaw) ? limitRaw : 3)
    );

    // Iterate through resumes in chunks and keep only the top N by score.
    const chunkSize = 1000;
    let from = 0;
    let top: Array<ReturnType<typeof toScoreRow>> = [];

    for (;;) {
      const to = from + chunkSize - 1;
      const chunk = await supabase
        .from("resumes")
        .select("id, likes_count, comments_count, created_at")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (chunk.error) {
        console.error("Error fetching resume scores:", chunk.error);
        return NextResponse.json(
          { error: "Failed to fetch hot resumes" },
          { status: 500 }
        );
      }

      const rows = (chunk.data ?? []) as ResumeScoreRow[];
      for (const r of rows) {
        const scored = toScoreRow(r);
        upsertTopN(
          top,
          scored,
          (a, b) =>
            b.score - a.score ||
            b.likes - a.likes ||
            b.comments - a.comments ||
            b.createdAt - a.createdAt,
          limit
        );
      }

      if (rows.length < chunkSize) break;
      from += chunkSize;
    }

    if (top.length === 0) {
      return NextResponse.json({ resumes: [] });
    }

    const topIds = top.map((t) => t.id);
    const full = await supabase
      .from("resumes")
      .select(
        `
        *,
        profiles:user_id (
          id,
          name,
          avatar_url
        )
      `
      )
      .in("id", topIds);

    if (full.error) {
      console.error("Error fetching hot resumes:", full.error);
      return NextResponse.json(
        { error: "Failed to fetch hot resumes" },
        { status: 500 }
      );
    }

    const byId = new Map((full.data ?? []).map((r: any) => [r.id, r]));
    const transformedResumes = topIds
      .map((id) => byId.get(id))
      .filter(Boolean)
      .map((resume: any) => ({
        id: resume.id,
        name: resume.name,
        blurb: resume.blurb,
        likes: resume.likes_count,
        comments: [], // loaded separately elsewhere
        commentsCount: resume.comments_count,
        fileUrl: resume.file_url,
        fileType: resume.file_type,
        ownerId: resume.user_id,
        createdAt: new Date(resume.created_at).getTime(),
        avatar: resume.profiles?.avatar_url || "/cartoon-avatar-user.png",
      }));

    return NextResponse.json({ resumes: transformedResumes });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
