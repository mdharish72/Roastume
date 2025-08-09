"use client"

import Link from "next/link"
import { ComicCard } from "./comic-card"
import Image from "next/image"
import { ThumbsUp, MessageCircle, Flame } from "lucide-react"
import { useRoastume, type Resume } from "@/lib/store"
import { cn } from "@/lib/utils"

export function ResumeCard({ resume }: { resume: Resume }) {
  const { like } = useRoastume()

  return (
    <ComicCard className="grid gap-3">
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-[3px] border-[#2c2c2c] bg-white">
          <Image
            src={resume.avatar || "/placeholder.svg?height=64&width=64&query=avatar"}
            alt={`${resume.name} avatar`}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <h3
            className={cn("text-xl sm:text-2xl font-extrabold tracking-wider text-[#1f1f1f]")}
            style={{ textShadow: "1px 1px 0 #2c2c2c" }}
          >
            {resume.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-[15px] leading-snug">{resume.blurb || "No description provided."}</p>
        </div>
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-2">
        <button
          onClick={() => like(resume.id)}
          className="w-full sm:w-auto justify-center flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-[#EBDDBF] px-3 py-2 text-sm font-bold shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
          aria-label="Like"
        >
          <ThumbsUp className="h-4 w-4" />
          Like
          <span className="ml-1 rounded-full border-[2px] border-[#2c2c2c] bg-white px-2 py-0.5 text-xs">
            {resume.likes}
          </span>
        </button>

        <Link
          href={`/resume/${resume.id}#comments`}
          className="w-full sm:w-auto justify-center flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-[#EBDDBF] px-3 py-2 text-sm font-bold shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
        >
          <MessageCircle className="h-4 w-4" />
          Comment
          <span className="ml-1 rounded-full border-[2px] border-[#2c2c2c] bg-white px-2 py-0.5 text-xs">
            {resume.comments.length}
          </span>
        </Link>

        <Link
          href={`/resume/${resume.id}`}
          className="w-full sm:w-auto sm:ml-auto justify-center flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-[#EBDDBF] px-3 py-2 text-sm font-bold shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
          aria-label="Roast this resume"
        >
          <Flame className="h-4 w-4" />
          Roast
        </Link>
      </div>
    </ComicCard>
  )
}
