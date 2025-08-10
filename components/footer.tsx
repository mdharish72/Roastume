"use client";

import { body, display } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AiOutlineHome, AiOutlineUpload, AiOutlineUser } from "react-icons/ai";
import { FaBullseye, FaGithub, FaHeart, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-8 border-t-4 border-[#2c2c2c] bg-[#97D4D5]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Main footer content */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand section */}
          <div className="text-center md:text-left">
            <Link
              href="/"
              className={cn(
                display.className,
                "text-3xl tracking-wide leading-none text-[#F2D5A3] hover:-translate-y-0.5 transition-transform inline-block"
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
              }}
            >
              ROASTUME
            </Link>
            <p className={cn(body.className, "mt-2 text-sm text-[#2c2c2c]/80")}>
              Get your resume roasted in a fun, constructive way!
            </p>
          </div>

          {/* Navigation links */}
          <div className="text-center">
            <h3
              className={cn(display.className, "font-bold text-[#2c2c2c] mb-3")}
            >
              Quick Links
            </h3>
            <div className="flex justify-center gap-3">
              <Link
                href="/"
                className={cn(
                  body.className,
                  "flex items-center justify-center w-12 h-12 rounded-full border-[2px] border-[#2c2c2c] bg-[#EFD7B7] shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
                )}
                title="Home"
              >
                <AiOutlineHome className="h-5 w-5 text-[#2c2c2c]" />
              </Link>
              <Link
                href="/upload"
                className={cn(
                  body.className,
                  "flex items-center justify-center w-12 h-12 rounded-full border-[2px] border-[#2c2c2c] bg-[#F8E4C6] shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
                )}
                title="Upload Resume"
              >
                <AiOutlineUpload className="h-5 w-5 text-[#2c2c2c]" />
              </Link>
              <Link
                href="/profile"
                className={cn(
                  body.className,
                  "flex items-center justify-center w-12 h-12 rounded-full border-[2px] border-[#2c2c2c] bg-[#F2D5A3] shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
                )}
                title="Profile"
              >
                <AiOutlineUser className="h-5 w-5 text-[#2c2c2c]" />
              </Link>
            </div>
          </div>

          {/* Community section */}
          <div className="text-center md:text-right">
            <h3
              className={cn(display.className, "font-bold text-[#2c2c2c] mb-3")}
            >
              Community
            </h3>
            <div className="flex justify-center md:justify-end gap-3 mb-4">
              <button className="p-2 rounded-full border-[2px] border-[#2c2c2c] bg-[#EBDDBF] shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform">
                <FaGithub className="h-4 w-4 text-[#2c2c2c]" />
              </button>
              <button className="p-2 rounded-full border-[2px] border-[#2c2c2c] bg-[#EBDDBF] shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform">
                <FaTwitter className="h-4 w-4 text-[#2c2c2c]" />
              </button>
            </div>
            <p className={cn(body.className, "text-sm text-[#2c2c2c]/80")}>
              Built with{" "}
              <FaHeart className="inline h-4 w-4 text-red-500 mx-1" />
              for the community
            </p>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-6 border-t-2 border-[#2c2c2c]/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p
              className={cn(
                body.className,
                "text-sm text-[#2c2c2c]/70 flex-wrap flex items-center gap-2"
              )}
            >
              © 2025 Roastume. Built for fun. Keep it kind!
              <FaBullseye className="h-4 w-4 text-orange-500" />
            </p>
            <div className="flex gap-4 text-sm">
              <button
                className={cn(
                  body.className,
                  "text-[#2c2c2c]/70 hover:text-[#2c2c2c] transition-colors"
                )}
              >
                Privacy
              </button>
              <button
                className={cn(
                  body.className,
                  "text-[#2c2c2c]/70 hover:text-[#2c2c2c] transition-colors"
                )}
              >
                Terms
              </button>
              <button
                className={cn(
                  body.className,
                  "text-[#2c2c2c]/70 hover:text-[#2c2c2c] transition-colors"
                )}
              >
                Guidelines
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
