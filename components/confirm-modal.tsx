"use client";

import { body, display } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

type ConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isConfirming?: boolean;
};

export function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isConfirming = false,
}: ConfirmModalProps) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onCancel}
    >
      <div
        className="bg-[#EFD7B7] comic-border-4 comic-shadow-8 rounded-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-[#2c2c2c]/20">
          <h2
            className={cn(
              display.className,
              "text-2xl font-extrabold tracking-wide text-[#F2D5A3]"
            )}
            style={{
              textShadow: [
                "3px 3px 0 #2a7e84",
                "2px 2px 0 #2a7e84",
                "-1px -1px 0 #2c2c2c",
                "1px -1px 0 #2c2c2c",
                "-1px 1px 0 #2c2c2c",
                "1px 1px 0 #2c2c2c",
              ].join(", "),
            }}
          >
            {title}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-full comic-border-2 bg-green-400 hover:bg-green-500 text-[#2c2c2c] comic-shadow-2 comic-lift duration-300"
            aria-label="Close"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {description && (
            <p className={cn(body.className, "text-sm text-[#2c2c2c]")}>
              {description}
            </p>
          )}

          {/* Actions */}
          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className={cn(
                body.className,
                "comic-btn bg-[#EBDDBF] comic-shadow-3 comic-lift duration-300"
              )}
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isConfirming}
              className={cn(
                display.className,
                "comic-btn bg-red-500 hover:bg-red-600 text-white comic-shadow-3 comic-lift duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            >
              {isConfirming ? "Deleting…" : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
