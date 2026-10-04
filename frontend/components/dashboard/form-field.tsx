import React from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors disabled:opacity-50";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, hint, error, className, children }: FormFieldProps) {
  return (
    <div className={cn("text-xs", className)}>
      <label htmlFor={htmlFor} className="block text-zinc-700 font-medium mb-1">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-rose-600 mt-1">{error}</p>
      ) : hint ? (
        <p className="text-zinc-500 mt-1">{hint}</p>
      ) : null}
    </div>
  );
}
