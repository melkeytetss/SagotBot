"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabsProps<T extends string> {
  tabs: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}

export function Tabs<T extends string>({ tabs, value, onChange }: TabsProps<T>) {
  const layoutId = useId();
  return (
    <div role="tablist" className="inline-flex items-center gap-1 p-1 rounded-xl bg-zinc-100 border border-zinc-200/70">
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors",
              active ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-900"
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-lg bg-white shadow-2xs border border-zinc-200/80"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
