import React from "react";
import { cn } from "@/lib/utils";

export interface CandyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "emerald" | "blue" | "neutral";
}

export function CandyButton({
  className,
  variant = "emerald",
  children = "Candy Button",
  ...props
}: CandyButtonProps) {
  const variantStyles = {
    emerald: cn(
      "border border-emerald-400/70 bg-[radial-gradient(95%_60%_at_50%_75%,#047857_0%,#10b981_100%)]",
      "shadow-[0px_4px_32px_-8px_rgba(16,185,129,0.5),inset_0px_1px_8px_-3px_#FFFFFF]"
    ),
    blue: cn(
      "border border-[#54A1FD] bg-[radial-gradient(95%_60%_at_50%_75%,#005FD6_0%,#209BFF_100%)]",
      "shadow-[0px_4px_48px_-12px_#1187FF,inset_0px_1px_8px_-4px_#FFFFFF]"
    ),
    neutral: cn(
      "border border-white/20 bg-[radial-gradient(95%_60%_at_50%_75%,#1e293b_0%,#334155_100%)]",
      "shadow-[0px_4px_32px_-8px_rgba(0,0,0,0.6),inset_0px_1px_6px_-2px_#FFFFFF]"
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
