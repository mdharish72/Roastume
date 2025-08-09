import type React from "react"
import { cn } from "@/lib/utils"

export function ComicCard({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode
  className?: string
  as?: any
}) {
  return (
    <Tag
      className={cn("rounded-2xl border-[3px] border-[#2c2c2c] bg-[#F2D5A3] p-4 shadow-[6px_6px_0_#2c2c2c]", className)}
    >
      {children}
    </Tag>
  )
}
