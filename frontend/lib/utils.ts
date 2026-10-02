import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPHP(amount: number): string {
  // Deterministic formatting prevents SSR hydration mismatch across different OS locales
  const formatted = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `₱${formatted}`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
}
