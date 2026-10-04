import React from "react";
import { cn } from "@/lib/utils";

export type ChipTone = "positive" | "neutral" | "danger";

const tones: Record<ChipTone, string> = {
  positive: "bg-blue-50 text-blue-700 border-blue-200",
  neutral: "bg-zinc-100 text-zinc-600 border-zinc-200",
  danger: "bg-rose-50 text-rose-700 border-rose-200",
};

export function StatusChip({
  tone = "neutral",
  className,
  children,
}: {
  tone?: ChipTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-mono font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function appointmentTone(status: string): ChipTone {
  if (status === "cancelled") return "danger";
  if (status === "completed") return "neutral";
  return "positive";
}
