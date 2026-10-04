import React from "react";
import { FlipText } from "@/components/ui/flip-text";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <FlipText className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950" duration={1.8}>
          {title}
        </FlipText>
        {description && <p className="text-xs text-zinc-500 mt-1">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-2.5 shrink-0">{action}</div>}
    </div>
  );
}
