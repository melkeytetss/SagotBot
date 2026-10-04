import React from "react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyTitle: string;
  emptyDescription?: string;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({
  columns,
  rows,
  getKey,
  onRowClick,
  loading,
  emptyTitle,
  emptyDescription,
  page = 0,
  pageSize = 10,
  total,
  onPageChange,
}: DataTableProps<T>) {
  const pageCount = total ? Math.max(1, Math.ceil(total / pageSize)) : 1;

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={cn("py-3.5 px-4 font-medium", c.className)}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((c) => (
                      <td key={c.key} className="py-4 px-4">
                        <div className="h-3 w-3/4 rounded bg-zinc-100 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((row) => (
                  <tr
                    key={getKey(row)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn("transition-colors", onRowClick && "hover:bg-zinc-50/80 cursor-pointer")}
                  >
                    {columns.map((c) => (
                      <td key={c.key} className={cn("py-4 px-4", c.className)}>
                        {c.render(row)}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!loading && rows.length === 0 && (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}

      {onPageChange && total !== undefined && total > pageSize && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100 text-[11px] text-zinc-500">
          <span className="font-mono">
            {page * pageSize + 1}-{Math.min((page + 1) * pageSize, total)} of {total}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => onPageChange(page - 1)}
              className="px-2.5 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= pageCount - 1}
              onClick={() => onPageChange(page + 1)}
              className="px-2.5 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
