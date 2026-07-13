"use client";

import * as React from "react";
import { ExpenseStatCard } from "./ExpenseStatCard";
import { ExpenseStat } from "@/types/types";
 
interface ExpenseStatsSectionProps {
  stats: ExpenseStat[];
  onMenuClick?: (id: string) => void;
  className?: string;
}

export function ExpenseStatsSection({
  stats,
  onMenuClick,
  className,
}: ExpenseStatsSectionProps) {
  return (
    <div className={`flex items-stretch gap-4 ${className ?? ""}`}>
      {stats.map((stat) => (
        <ExpenseStatCard key={stat.id} stat={stat} onMenuClick={onMenuClick} />
      ))}
    </div>
  );
}