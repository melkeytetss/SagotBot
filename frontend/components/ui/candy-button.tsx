import React from "react";
import { cn } from "@/lib/utils";

export interface CandyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "black" | "blue" | "emerald" | "neutral";
}

export function CandyButton({
  className,
  variant = "black",
  children = "Button",
  ...props
}: CandyButtonProps) {
  const variantStyles = {
    black: cn(
      "border border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm",
      "after:hidden"
    ),
    blue: cn(
      "border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
      "after:hidden"
    ),
    emerald: cn(
      "border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
      "after:hidden"
    ),
    neutral: cn(
      "border border-zinc-200 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 shadow-sm",
      "after:hidden"
    ),
  };

  return (
    <button
      className={cn(
        "relative text-white font-semibold text-base leading-[22px] tracking-[0.02em]",
        "px-7 py-3 rounded-xl cursor-pointer transition-all duration-160 ease-out",
        "active:scale-95 active:rotate-1",
        "after:absolute after:top-[1px] after:right-[10%] after:w-[60%] after:h-[1px]",
        "after:bg-gradient-to-r after:from-transparent after:via-white/50 after:to-transparent",
        "hover:brightness-110",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 disabled:hover:brightness-100",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default CandyButton;
