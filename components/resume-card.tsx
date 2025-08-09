"use client";

import { useRoastume, type Resume } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Kalam } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ComicCard } from "./comic-card";
import { AiOutlineLike, AiOutlineComment, AiFillFire } from "react-icons/ai";

const body = Kalam({ subsets: ["latin"], weight: ["300", "400", "700"] });

export function ResumeCard({ resume }: { resume: Resume }) {
  const { like } = useRoastume();

  return (
    <ComicCard
      variant="light"
      fontStyle="body"
      shadow="medium"
      className="grid gap-4"
    >
      {/* Header section with avatar and info */}
      <div className="flex items-start gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-[3px] border-[#2c2c2c] bg-white shadow-[3px_3px_0_#2c2c2c]">
          <Image
            src={
              resume.avatar ||
              "/placeholder.svg?height=64&width=64&query=avatar"
            }
            alt={`${resume.name} avatar`}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              body.className,
              "text-xl sm:text-2xl font-bold tracking-wide text-[#2c2c2c]"
            )}
            style={{ textShadow: "1px 1px 0 rgba(44, 44, 44, 0.1)" }}
          >
            {resume.name}
          </h3>
          <p
            className={cn(
              body.className,
              "mt-1 line-clamp-2 text-sm leading-relaxed text-[#2c2c2c]/80"
            )}
          >
            {resume.blurb || "No description provided."}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-[#2c2c2c]/60">
            <span>📅 {new Date(resume.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => like(resume.id)}
          className={cn(
            body.className,
            "flex items-center gap-2 rounded-full border-[2px] border-[#2c2c2c] bg-green-400 hover:bg-green-500 px-3 py-2 text-sm font-bold shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-all text-[#2c2c2c]"
          )}
          aria-label="Like this resume"
        >
          <AiOutlineLike className="h-4 w-4" />
          Like
          <span className="ml-1 rounded-full border-[2px] border-[#2c2c2c] bg-white px-2 py-0.5 text-xs font-bold">
            {resume.likes}
          </span>
        </button>

        <Link
          href={`/resume/${resume.id}#comments`}
          className={cn(
            body.className,
            "flex items-center gap-2 rounded-full border-[2px] border-[#2c2c2c] bg-blue-400 hover:bg-blue-500 px-3 py-2 text-sm font-bold shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-all text-[#2c2c2c]"
          )}
        >
          <AiOutlineComment className="h-4 w-4" />
          Comment
          <span className="ml-1 rounded-full border-[2px] border-[#2c2c2c] bg-white px-2 py-0.5 text-xs font-bold">
            {resume.comments.length}
          </span>
        </Link>

        <Link
          href={`/resume/${resume.id}`}
          className={cn(
            body.className,
            "flex items-center gap-2 rounded-full border-[2px] border-[#2c2c2c] bg-red-400 hover:bg-red-500 px-3 py-2 text-sm font-bold shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-all text-[#2c2c2c] sm:ml-auto"
          )}
          aria-label="Roast this resume"
        >
          <AiFillFire className="h-4 w-4" />
          Roast It!
        </Link>
      </div>
    </ComicCard>
  );
}
