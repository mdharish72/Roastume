"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { body, display } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { useAuthModal } from "./auth-modal-provider";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const { showSignInModal } = useAuthModal();

  if (status === "loading") {
    return (
      <div className="w-12 h-12 bg-[#F2D5A3] rounded-full animate-pulse comic-border comic-shadow-3" />
    );
  }

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-12 w-12 rounded-full comic-border comic-shadow-3 comic-lift bg-[#F2D5A3] hover:bg-[#F2D5A3]/90 p-0"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={session.user?.image || ""}
                alt={session.user?.name || ""}
              />
              <AvatarFallback className="bg-[#EBDDBF] text-[#2c2c2c] font-bold text-lg">
                {session.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-64 comic-border comic-shadow-3 bg-[#EBDDBF]"
          align="end"
        >
          <div className="flex items-center justify-start gap-3 p-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={session.user?.image || ""}
                alt={session.user?.name || ""}
              />
              <AvatarFallback className="bg-[#F2D5A3] text-[#2c2c2c] font-bold">
                {session.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 leading-none">
              {session.user?.name && (
                <p
                  className={cn(
                    display.className,
                    "font-bold text-[#2c2c2c] text-sm"
                  )}
                >
                  {session.user.name}
                </p>
              )}
              {session.user?.email && (
                <p
                  className={cn(
                    body.className,
                    "w-[180px] truncate text-xs text-[#2c2c2c]/70"
                  )}
                >
                  {session.user.email}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuItem
            className={cn(
              display.className,
              "cursor-pointer text-white bg-red-400 hover:bg-red-500 font-bold mx-2 mb-2 rounded comic-border-2 comic-shadow-2 comic-lift"
            )}
            onClick={() => signOut()}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      onClick={showSignInModal}
      className={cn(
        display.className,
        "bg-green-400 hover:bg-green-500 text-black font-bold comic-border comic-shadow-3 comic-lift px-4 py-2 rounded-full"
      )}
    >
      Sign In
    </Button>
  );
}
