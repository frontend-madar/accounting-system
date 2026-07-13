"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type CreditAccountStatus = "completed" | "cancelled";

const STATUS_CONFIG: Record<
  CreditAccountStatus,
  { label: string; dot: string; text: string; bg: string }
> = {
  completed: {
    label: "مكتملة",
    dot: "bg-[#1DB682]",
    text: "text-[#1DB682]",
    bg: "bg-[#E7F8F1]",
  },
  cancelled: {
    label: "كنسل",
    dot: "bg-[#F5A623]",
    text: "text-[#F5A623]",
    bg: "bg-[#FDF3E3]",
  },
};

interface CreditAccountStatusBadgeProps {
  status: CreditAccountStatus;
  onChange?: (status: CreditAccountStatus) => void;
}

export function CreditAccountStatusBadge({
  status,
  onChange,
}: CreditAccountStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <button
      type="button"
      onClick={() =>
        onChange?.(status === "completed" ? "cancelled" : "completed")
      }
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[13px] font-medium",
        config.bg,
        config.text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
      <ChevronDown className="h-3.5 w-3.5" />
    </button>
  );
}