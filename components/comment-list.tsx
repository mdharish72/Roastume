"use client"

import type React from "react"

import { useState } from "react"
import { useRoastume } from "@/lib/store"
import Image from "next/image"
import { ComicCard } from "./comic-card"
import { cn } from "@/lib/utils"

export function CommentList({ resumeId }: { resumeId: string }) {
  const { find, addComment } = useRoastume()
  const [text, setText] = useState("")
  const resume = find(resumeId)

  if (!resume) return null

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    addComment(resumeId, text.trim())
    setText("")
  }

  return (
    <div id="comments" className="grid gap-3">
      <h3 className={cn("text-2xl font-extrabold tracking-wide")} style={{ textShadow: "1px 1px 0 #2c2c2c" }}>
        Comments
      </h3>

      <form onSubmit={onSubmit} className="flex items-start gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Drop your best roast (be kind) ..."
          className="min-h-[70px] flex-1 rounded-2xl border-[3px] border-[#2c2c2c] bg-[#F2D5A3] p-3 shadow-[4px_4px_0_#2c2c2c] focus:outline-none"
        />
        <button
          type="submit"
          className="h-fit rounded-full border-[3px] border-[#2c2c2c] bg-[#EBDDBF] px-4 py-2 font-bold shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
        >
          Post
        </button>
      </form>

      <div className="grid gap-3">
        {resume.comments.length === 0 && <p className="text-sm opacity-80">No comments yet. Be the first to roast!</p>}
        {resume.comments.map((c) => (
          <ComicCard key={c.id} className="flex items-start gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-[3px] border-[#2c2c2c] bg-white">
              <Image
                src={c.avatar || "/placeholder.svg?height=64&width=64&query=user"}
                alt={`${c.author} avatar`}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold tracking-wide">{c.author}</span>
                <span className="text-xs opacity-70">{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-1 text-sm leading-snug">{c.text}</p>
            </div>
          </ComicCard>
        ))}
      </div>
    </div>
  )
}
