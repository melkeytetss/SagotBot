"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CandyButton } from "@/components/ui/candy-button";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/30 backdrop-blur-xs"
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18 }}
            className="relative z-10 w-full max-w-xs rounded-2xl bg-white border border-zinc-200 p-5 shadow-lg space-y-4"
          >
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-zinc-950">{title}</h3>
              {description && <p className="text-xs text-zinc-500">{description}</p>}
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-medium cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <CandyButton
                type="button"
                variant={destructive ? "neutral" : "black"}
                disabled={loading}
                onClick={onConfirm}
                className={cn(
                  "px-3.5 py-1.5 text-xs font-medium rounded-lg",
                  destructive && "text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100"
                )}
              >
                {loading ? "Working..." : confirmLabel}
              </CandyButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
