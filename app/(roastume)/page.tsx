"use client"

import { useRoastume } from "@/lib/store"
import { ResumeCard } from "@/components/resume-card"

export default function Page() {
  const { resumes } = useRoastume()

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resumes.map((r) => (
          <ResumeCard key={r.id} resume={r} />
        ))}
      </div>
    </div>
  )
}
