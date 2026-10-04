"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function Drawer({ open, onClose, title, subtitle, footer, children }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white border-l border-zinc-200 shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            <div className="p-5 border-b border-zinc-200 flex items-start justify-between gap-3 bg-zinc-50/50">
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-zinc-950 truncate">{title}</h3>
                {subtitle && <p className="text-[10px] font-mono text-zinc-500 mt-0.5">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">{children}</div>
            {footer && <div className="p-4 border-t border-zinc-200 bg-zinc-50/50 flex gap-2">{footer}</div>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
