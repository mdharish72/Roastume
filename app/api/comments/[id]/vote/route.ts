import { authOptions } from "@/lib/auth";
import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/comments/[id]/vote - Vote on comment (upvote/downvote)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { voteType } = body; // 'upvote' or 'downvote'

    if (!voteType || !["upvote", "downvote"].includes(voteType)) {
      return NextResponse.json(
        { error: "Invalid vote type. Must be 'upvote' or 'downvote'" },
        { status: 400 }
      );
    }

    // Check if comment exists
    const { data: comment, error: commentError } = await supabase
      .from("comments")
      .select("id")
      .eq("id", id)
      .single();

    if (commentError || !comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Check if user has already voted on this comment
    let votesSupported = true as boolean;
    let existingVote: any = null;
    const voteLookup = await supabase
      .from("comment_votes")
      .select("*")
      .eq("comment_id", id)
      .eq("user_id", session.user.id)
      .single();

    if (voteLookup.error) {
      if (voteLookup.error.code === "PGRST116") {
        // not found is fine; continue with existingVote null
        existingVote = null;
      } else if (voteLookup.error.code === "PGRST205") {
        // table missing; fallback mode
        votesSupported = false;
      } else {
        console.error("Error checking existing vote:", voteLookup.error);
        return NextResponse.json(
          { error: "Failed to check existing vote" },
          { status: 500 }
        );
      }
    } else {
      existingVote = voteLookup.data;
    }

    let result: { voted: boolean; voteType: "upvote" | "downvote" | null };

    if (!votesSupported) {
      // Fallback: increment counters without per-user tracking
      const { data: current, error: readErr } = await supabase
        .from("comments")
        .select("upvotes_count, downvotes_count")
        .eq("id", id)
        .single();

      if (readErr) {
        console.error("Error reading counts in fallback:", readErr);
        return NextResponse.json(
          { error: "Failed to update vote" },
          { status: 500 }
        );
      }

      const nextUp =
        voteType === "upvote"
          ? (current.upvotes_count || 0) + 1
          : current.upvotes_count || 0;
      const nextDown =
        voteType === "downvote"
          ? (current.downvotes_count || 0) + 1
          : current.downvotes_count || 0;

      const { error: writeErr } = await supabase
        .from("comments")
        .update({ upvotes_count: nextUp, downvotes_count: nextDown })
        .eq("id", id);

      if (writeErr) {
        console.error("Error updating counts in fallback:", writeErr);
        return NextResponse.json(
          { error: "Failed to update vote" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        voted: true,
        voteType,
        upvotes: nextUp,
        downvotes: nextDown,
      });
    }

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Same vote type - remove the vote
        const { error: deleteError } = await supabase
          .from("comment_votes")
          .delete()
          .eq("id", existingVote.id);

        if (deleteError) {
          console.error("Error removing vote:", deleteError);
          return NextResponse.json(
            { error: "Failed to remove vote" },
            { status: 500 }
          );
        }

        result = { voted: false, voteType: null };
      } else {
        // Different vote type - update the vote
        const { error: updateError } = await supabase
          .from("comment_votes")
          .update({ vote_type: voteType })
          .eq("id", existingVote.id);

        if (updateError) {
          console.error("Error updating vote:", updateError);
          return NextResponse.json(
            { error: "Failed to update vote" },
            { status: 500 }
          );
        }

        result = { voted: true, voteType };
      }
    } else {
      // No existing vote - create new vote
      const { error: insertError } = await supabase
        .from("comment_votes")
        .insert({
          comment_id: id,
          user_id: session.user.id,
          vote_type: voteType,
        });

      if (insertError) {
        console.error("Error creating vote:", insertError);
        return NextResponse.json(
          { error: "Failed to create vote" },
          { status: 500 }
        );
      }

      result = { voted: true, voteType };
    }

    // Get updated vote counts
    const { data: updatedComment, error: countError } = await supabase
      .from("comments")
      .select("upvotes_count, downvotes_count")
      .eq("id", id)
      .single();

    if (countError) {
      console.error("Error getting updated counts:", countError);
      return NextResponse.json(
        { error: "Failed to get updated counts" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...result,
      upvotes: updatedComment.upvotes_count,
      downvotes: updatedComment.downvotes_count,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
