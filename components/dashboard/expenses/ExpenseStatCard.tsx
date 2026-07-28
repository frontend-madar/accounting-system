"use client";

import * as React from "react";
import {
  MoreVertical,
  LayoutDashboard,
  Building2,
  Calendar,
} from "lucide-react";
import { ExpenseIconKey, ExpenseStat } from "@/types/types";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<
  ExpenseIconKey,
  React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>
> = {
  total: LayoutDashboard,
  count: Building2,
  month: Calendar,
};

interface ExpenseStatCardProps {
  stat: ExpenseStat;
  onMenuClick?: (id: string) => void;
  className?: string;
}

export function ExpenseStatCard({
  stat,
  onMenuClick,
  className,
}: ExpenseStatCardProps) {
  const {
    id,
    label,
    value,
    currency,
    icon,
    iconColor,
    iconBg,
  } = stat;

  const Icon = ICON_MAP[icon];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl",
        "border border-slate-100",
        "bg-gradient-to-br from-white via-white to-slate-50",
        "p-6 min-h-[170px]",
        "shadow-sm transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      {/* Decorative Blur */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-100/40 blur-3xl transition-all duration-300 group-hover:scale-125" />

      {/* Header */}
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white shadow-md"
            style={{ backgroundColor: iconBg }}
          >
            <Icon
              className="h-7 w-7 transition-transform duration-300 group-hover:scale-110"
              style={{ color: iconColor }}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              {label}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Updated just now
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onMenuClick?.(id)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700"
          aria-label="Options"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      {/* Value */}
      <div className="relative mt-8">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold tracking-tight text-slate-900">
            {value}
          </span>

          {currency && (
            <span className="mb-1 text-lg font-medium text-slate-500">
              {currency}
            </span>
          )}
        </div>

        <div className="mt-3 h-1.5 w-16 rounded-full bg-slate-200">
          <div
            className="h-full rounded-full"
            style={{
              width: "70%",
              backgroundColor: iconColor,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function ExpenseStatCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl",
        "border border-slate-100",
        "bg-gradient-to-br from-white via-white to-slate-50",
        "p-6 min-h-[170px]",
        "shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 shrink-0 animate-pulse rounded-2xl bg-slate-200" />

          <div className="space-y-2">
            <div className="h-3.5 w-28 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
          </div>
        </div>

        <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
      </div>

      <div className="mt-8">
        <div className="h-9 w-32 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-1.5 w-16 animate-pulse rounded-full bg-slate-200" />
      </div>
    </div>
  );
}