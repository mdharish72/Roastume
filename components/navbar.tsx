"use client";

import { cn } from "@/lib/utils";
import { Bangers, Kalam } from "next/font/google";
import Link from "next/link";
import { AiOutlineHome, AiOutlineUpload, AiOutlineUser } from "react-icons/ai";
import AuthButton from "./auth-button";

const display = Bangers({ subsets: ["latin"], weight: "400" });
const body = Kalam({ subsets: ["latin"], weight: ["300", "400", "700"] });

export default function Navbar() {
  return (
    <nav className="border-b-4 border-[#2c2c2c] bg-[#97D4D5] shadow-[0_4px_0_#2c2c2c] sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-[#97D4D5]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Navigation Links */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className={cn(
                body.className,
                "flex items-center gap-2 rounded-full border-[2px] border-[#2c2c2c] bg-[#EFD7B7] px-3 py-2 text-sm font-bold shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
              )}
            >
              <AiOutlineHome className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/upload"
              className={cn(
                body.className,
                "flex items-center gap-2 rounded-full border-[2px] border-[#2c2c2c] bg-[#F8E4C6] px-3 py-2 text-sm font-bold shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
              )}
            >
              <AiOutlineUpload className="h-4 w-4" />
              Upload
            </Link>
          </div>

          {/* Center - Brand Logo */}
          <Link
            href="/"
            className={cn(
              display.className,
              "text-3xl tracking-wide leading-none text-[#F2D5A3] hover:-translate-y-0.5 transition-transform"
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

          {/* Right side - User Actions */}
          <div className="flex items-center space-x-3">
            <Link
              href="/profile"
              className={cn(
                body.className,
                "flex items-center gap-2 rounded-full border-[2px] border-[#2c2c2c] bg-[#F2D5A3] px-3 py-2 text-sm font-bold shadow-[2px_2px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
              )}
            >
              <AiOutlineUser className="h-4 w-4" />
              Profile
            </Link>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
