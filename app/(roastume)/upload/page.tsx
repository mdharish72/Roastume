"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useRoastume } from "@/lib/store"
import { ComicCard } from "@/components/comic-card"

export default function UploadPage() {
  const { addResume } = useRoastume()
  const router = useRouter()
  const [name, setName] = useState("")
  const [blurb, setBlurb] = useState("")
  const [fileUrl, setFileUrl] = useState<string | undefined>()
  const [fileType, setFileType] = useState<"image" | "pdf" | undefined>()
  const fileRef = useRef<HTMLInputElement>(null)

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    setFileUrl(url)
    setFileType(f.type.includes("pdf") ? "pdf" : "image")
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !fileUrl || !fileType) return
    const r = addResume({
      name,
      avatar: "/cartoon-avatar.png",
      blurb,
      fileUrl,
      fileType,
    })
    router.push(`/resume/${r.id}`)
  }

  return (
    <div className="grid gap-6">
      <h2 className="text-3xl font-extrabold tracking-wide" style={{ textShadow: "1px 1px 0 #2c2c2c" }}>
        Upload Resume
      </h2>

      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-[1.2fr_1fr]">
        <div className="grid gap-4">
          <ComicCard className="grid gap-3">
            <label className="text-sm font-bold tracking-wide" htmlFor="name">
              Name on Resume
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tariq"
              className="rounded-xl border-[3px] border-[#2c2c2c] bg-white p-3 shadow-[3px_3px_0_#2c2c2c] focus:outline-none"
              required
            />
            <label className="mt-2 text-sm font-bold tracking-wide" htmlFor="blurb">
              Short Description
            </label>
            <textarea
              id="blurb"
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              placeholder="Add context or a fun prompt for roasters..."
              className="min-h-[90px] rounded-xl border-[3px] border-[#2c2c2c] bg-white p-3 shadow-[3px_3px_0_#2c2c2c] focus:outline-none"
            />
          </ComicCard>

          <button
            type="submit"
            className="w-fit rounded-full border-[3px] border-[#2c2c2c] bg-[#EBDDBF] px-5 py-3 text-base font-extrabold shadow-[4px_4px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform disabled:opacity-60"
            disabled={!name || !fileUrl}
          >
            Publish
          </button>
        </div>

        <ComicCard className="grid gap-4">
          <div>
            <label className="block text-sm font-bold tracking-wide">Resume File (PDF or Image)</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={onFile}
              className="mt-2 block w-full cursor-pointer rounded-xl border-[3px] border-dashed border-[#2c2c2c] bg-[#F8E9CF] p-3 shadow-[3px_3px_0_#2c2c2c]"
            />
          </div>

          {fileUrl ? (
            <div className="rounded-xl border-[3px] border-[#2c2c2c] bg-white p-2 shadow-[3px_3px_0_#2c2c2c]">
              {fileType === "image" ? (
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
                  <Image src={fileUrl || "/placeholder.svg"} alt="Resume preview" fill className="object-contain" />
                </div>
              ) : (
                <iframe src={fileUrl} title="PDF preview" className="h-[500px] w-full rounded-lg" />
              )}
            </div>
          ) : (
            <p className="text-sm opacity-80">Select a file to see a preview.</p>
          )}
        </ComicCard>
      </form>
    </div>
  )
}
