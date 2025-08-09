"use client"

import Image from "next/image"
import { useRoastume } from "@/lib/store"
import { ResumeCard } from "@/components/resume-card"
import { ComicCard } from "@/components/comic-card"

export default function ProfilePage() {
  const { currentUser, byOwner } = useRoastume()
  const myResumes = byOwner(currentUser.id)

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border-[4px] border-[#2c2c2c] bg-white shadow-[4px_4px_0_#2c2c2c]">
          <Image src={currentUser.avatar || "/placeholder.svg"} alt="Your avatar" fill className="object-cover" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold tracking-wide" style={{ textShadow: "1px 1px 0 #2c2c2c" }}>
            {currentUser.name}
          </h2>
          <p className="opacity-80">Your uploaded resumes and activity</p>
        </div>
      </div>

      <ComicCard className="grid gap-4">
        <h3 className="text-xl font-extrabold tracking-wide">Your Resumes</h3>
        {myResumes.length === 0 ? (
          <p className="text-sm opacity-80">You haven't uploaded anything yet. Try uploading one.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myResumes.map((r) => (
              <ResumeCard key={r.id} resume={r} />
            ))}
          </div>
        )}
      </ComicCard>
    </div>
  )
}
