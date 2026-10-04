import React from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 gap-1.5">
      <p className="text-sm font-semibold text-zinc-950">{title}</p>
      {description && <p className="text-xs text-zinc-500 max-w-xs">{description}</p>}
      {action && <div className="pt-3">{action}</div>}
    </div>
  );
}
