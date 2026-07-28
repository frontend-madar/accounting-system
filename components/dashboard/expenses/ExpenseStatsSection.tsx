"use client";

import { ExpenseStatCard, ExpenseStatCardSkeleton } from "./ExpenseStatCard";
import { ExpenseStat } from "@/types/types";

interface ExpenseStatsSectionProps {
  stats: ExpenseStat[];
  onMenuClick?: (id: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function ExpenseStatsSection({
  stats,
  onMenuClick,
  isLoading,
  className,
}: ExpenseStatsSectionProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch gap-4 ${className ?? ""}`}>
      {isLoading
        ? Array.from({ length: 3 }).map((_, i) => (
            <ExpenseStatCardSkeleton key={i} />
          ))
        : stats.map((stat) => (
            <ExpenseStatCard key={stat.id} stat={stat} onMenuClick={onMenuClick} />
          ))}
    </div>
  );
}