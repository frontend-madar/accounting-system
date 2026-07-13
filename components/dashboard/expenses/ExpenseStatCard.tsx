"use client";

import * as React from "react";
import { MoreVertical, LayoutDashboard, Building2, Calendar } from "lucide-react";
import { ExpenseIconKey, ExpenseStat } from "@/types/types";
 
const ICON_MAP: Record<ExpenseIconKey, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  total: LayoutDashboard,
  count: Building2,
  month: Calendar,
};

interface ExpenseStatCardProps {
  stat: ExpenseStat;
  onMenuClick?: (id: string) => void;
}

export function ExpenseStatCard({ stat, onMenuClick }: ExpenseStatCardProps) {
  const { id, label, value, currency, icon, iconColor, iconBg } = stat;
  const Icon = ICON_MAP[icon];

  return (
    <div
      className="flex-1 flex flex-col justify-between rounded-2xl h-[154px] bg-white shadow-[0px_3px_10.3px_0px_#0000001A] p-5"
    >
      <div className="flex  items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: iconBg }}
          >
            <Icon className="h-6 w-6" style={{ color: iconColor }} />
          </span>
          <span className="text-[22px] text-[#101011CC]">{label}</span>
        </div>
        <button
          type="button"
          onClick={() => onMenuClick?.(id)}
          aria-label="خيارات"
          className="text-muted-foreground"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

      </div>

      <div className="mt-4 flex items-center gap-1">
        <span className="text-[35px] font-bold text-[#101011]">
          {value}
        </span>
        {currency && (
          <span className="text-[24px] text-[#1E2128]">{currency}</span>
        )}
      </div>
    </div>
  );
}