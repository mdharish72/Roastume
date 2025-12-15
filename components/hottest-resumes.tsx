"use client";

import { fetchHotResumes } from "@/lib/api";
import { body, display } from "@/lib/fonts";
import { transformApiResume } from "@/lib/store/transforms";
import type { Resume } from "@/lib/store/types";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { AiFillFire } from "react-icons/ai";
import { ResumeCard } from "./resume-card";

type HotBadge = {
  rank: 1 | 2 | 3;
  label: string;
  wrapClassName: string;
  iconClassName: string;
};

function badgeForRank(rank: 1 | 2 | 3): HotBadge {
  if (rank === 1) {
    return {
      rank,
      label: "#1",
      wrapClassName:
        "bg-red-400 border-[#2c2c2c] comic-border-2 sm:comic-border-4 comic-shadow-2 sm:comic-shadow-3",
      iconClassName: "text-[#2c2c2c]",
    };
  }
  if (rank === 2) {
    return {
      rank,
      label: "#2",
      wrapClassName:
        "bg-orange-400 border-[#2c2c2c] comic-border-2 sm:comic-border-4 comic-shadow-2 sm:comic-shadow-3",
      iconClassName: "text-[#2c2c2c]",
    };
  }
  return {
    rank,
    label: "#3",
    wrapClassName:
      "bg-yellow-300 border-[#2c2c2c] comic-border-2 sm:comic-border-4 comic-shadow-2 sm:comic-shadow-3",
    iconClassName: "text-[#2c2c2c]",
  };
}

export function HottestResumes({ limit = 3 }: { limit?: number }) {
  const [hot, setHot] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        const { resumes } = await fetchHotResumes(limit);
        if (cancelled) return;
        setHot(resumes.map(transformApiResume));
      } catch {
        if (cancelled) return;
        setHot([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  const ranked = useMemo(() => hot.slice(0, 3), [hot]);
  if (!loading && ranked.length === 0) return null;

  return (
    <div className="grid gap-3 sm:gap-4">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h3
            className={cn(
              display.className,
              "text-lg sm:text-2xl font-normal tracking-wide text-[#F2D5A3] leading-tight"
            )}
            style={{
              textShadow: [
                "4px 4px 0 #2a7e84",
                "3px 3px 0 #2a7e84",
                "2px 2px 0 #2a7e84",
                "-1px -1px 0 #2c2c2c",
                "1px -1px 0 #2c2c2c",
                "-1px 1px 0 #2c2c2c",
                "1px 1px 0 #2c2c2c",
              ].join(", "),
              transform: "rotate(-1deg)",
            }}
          >
            Hottest right now
          </h3>
          <p className={cn(body.className, "text-xs sm:text-sm opacity-80")}>
            Ranked by likes + comments
          </p>
        </div>
        <div className="shrink-0 hidden sm:flex items-center gap-1 text-[#2c2c2c]">
          <AiFillFire className="h-5 w-5 text-[#2c2c2c]" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ranked.map((resume, idx) => {
          const rank = (idx + 1) as 1 | 2 | 3;
          const badge = badgeForRank(rank);
          return (
            <div key={resume.id} className="relative h-full">
              <div className="pointer-events-none absolute left-3 top-3 z-10">
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2.5 py-1",
                    badge.wrapClassName
                  )}
                >
                  <AiFillFire className={cn("h-4 w-4", badge.iconClassName)} />
                  <span className={cn(display.className, "text-sm font-black")}>
                    {badge.label}
                  </span>
                </div>
              </div>
              <ResumeCard resume={resume} />
            </div>
          );
        })}
      </div>
    </div>
  );
}


