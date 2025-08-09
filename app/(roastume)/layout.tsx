import AuthButton from "@/components/auth-button";
import Footer from "@/components/footer";
import { RoastumeProvider } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Home, Upload, UserCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { Bangers, Kalam } from "next/font/google";
import Link from "next/link";
import type React from "react";

const display = Bangers({ subsets: ["latin"], weight: "400" });
const body = Kalam({ subsets: ["latin"], weight: ["300", "400", "700"] });

export const metadata: Metadata = {
  title: "Roastume - Roast Your Resume",
  description: "Upload your resume and let the internet roast it (playfully).",
};

export default function RoastumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoastumeProvider>
      <div className="min-h-screen w-full bg-[#97D4D5] text-[#1f1f1f]">
        <header className="border-b-4 border-[#2c2c2c] bg-[#97D4D5]/90 sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-[#97D4D5]/80">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              {/* Left side - Navigation Links */}
              <div className="flex items-center gap-3 justify-start">
                <Link
                  href="/"
                  className={cn(
                    body.className,
                    "flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-[#EFD7B7] px-4 py-2 text-base font-bold shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
                  )}
                >
                  <Home className="h-5 w-5" />
                  Home
                </Link>
                <Link
                  href="/upload"
                  className={cn(
                    body.className,
                    "flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-[#F8E4C6] px-4 py-2 text-base font-bold shadow-[3px_3px_0_#2c2c2c] hover:-translate-y-0.5 transition-transform"
                  )}
                >
                  <Upload className="h-5 w-5" />
                  Upload Resume
                </Link>
              </div>

              {/* Center - Brand Logo */}
              <div className="text-center">
                <h1
                  className={cn(
                    display.className,
                    "text-[clamp(2.25rem,8vw,4rem)] tracking-wide leading-none text-[#F2D5A3]"
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
                </h1>
                <p
                  className={cn(
                    display.className,
                    "mt-1 text-[clamp(0.8rem,2.5vw,1.5rem)] tracking-wider text-[#F2D5A3]"
                  )}
                  style={{
                    textShadow: [
                      "2px 2px 0 #2a7e84",
                      "-1px -1px 0 #2c2c2c",
                      "1px -1px 0 #2c2c2c",
                      "-1px 1px 0 #2c2c2c",
                      "1px 1px 0 #2c2c2c",
                    ].join(", "),
                  }}
                >
                  ROAST YOUR RESUME
                </p>
              </div>

              {/* Right side - User Actions */}
              <div className="flex items-center gap-3 justify-end">
                <Link
                  href="/profile"
                  className={cn(
                    body.className,
                    "flex items-center gap-2 rounded-full border-[3px] border-[#2c2c2c] bg-[#F2D5A3] px-4 py-2 text-base font-bold shadow-[3px_3px_0_#2c2c2c] transition-transform hover:-translate-y-0.5"
                  )}
                  aria-label="Profile"
                >
                  <UserCircle2 className="h-5 w-5" />
                  Profile
                </Link>
                <AuthButton />
              </div>
            </div>
          </div>
        </header>

        <main className={cn(body.className, "mx-auto max-w-6xl px-4 py-6")}>
          {children}
        </main>

        <Footer />
      </div>
    </RoastumeProvider>
  );
}
