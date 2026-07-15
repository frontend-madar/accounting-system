"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/** Builds a windowed page list like [1,2,3,4,"...",40]. */
function buildPageList(
  current: number,
  total: number
): (number | "ellipsis")[] {
  if (total <= 6) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, 2, 3, 4, total]);
  pages.add(current);
  pages.add(Math.min(current + 1, total));

  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      result.push("ellipsis");
    }
    result.push(page);
  });

  return result;
}

export function DataTablePagination({
  page,
  pageSize,
  totalRecords,
  onPageChange,
  className,
}: DataTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const rangeStart = totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalRecords);
  const pageList = buildPageList(page, totalPages);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <p className="text-center text-[13px] text-muted-foreground sm:text-right">
        عرض {rangeStart}–{rangeEnd} من إجمالي {totalRecords} سجل
      </p>

      <div dir="ltr" className="flex items-center justify-center gap-1.5">
        <PaginationArrow
          direction="prev"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        />

        {/* Mobile */}
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#40369F] bg-[#40369F] text-[13px] font-medium text-white sm:hidden"
        >
          {page}
        </button>

        {/* Desktop */}
        <div className="hidden items-center gap-1 sm:flex">
          {pageList.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="px-1 text-sm text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md border text-[13px] font-medium transition-colors",
                  item === page
                    ? "border-[#40369F] bg-[#40369F] text-white"
                    : "border-[#EEEEEE] text-[#404B52] hover:bg-muted"
                )}
              >
                {item}
              </button>
            )
          )}
        </div>

        <PaginationArrow
          direction="next"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </div>
  );
}

function PaginationArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={
        direction === "prev" ? "الصفحة السابقة" : "الصفحة التالية"
      }
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:bg-muted"
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}