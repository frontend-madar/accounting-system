"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type CreditAccountStatus = "مكتملة" | "كنسل" | "باقي الدفع" | "completed" | "cancelled" | string;

const STATUS_CONFIG: Record<
  string,
  { label: string; dot: string; text: string; bg: string }
> = {
  "مكتملة": {
    label: "مكتملة",
    dot: "bg-[#1DB682]",
    text: "text-[#1DB682]",
    bg: "bg-[#E7F8F1]",
  },
  completed: {
    label: "مكتملة",
    dot: "bg-[#1DB682]",
    text: "text-[#1DB682]",
    bg: "bg-[#E7F8F1]",
  },
  "كنسل": {
    label: "كنسل",
    dot: "bg-[#FF4D4F]",
    text: "text-[#FF4D4F]",
    bg: "bg-[#FFF1F0]",
  },
  cancelled: {
    label: "كنسل",
    dot: "bg-[#FF4D4F]",
    text: "text-[#FF4D4F]",
    bg: "bg-[#FFF1F0]",
  },
  "باقي الدفع": {
    label: "باقي الدفع",
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
  const config = STATUS_CONFIG[status] || {
    label: status,
    dot: "bg-[#6B7280]",
    text: "text-[#374151]",
    bg: "bg-[#F3F4F6]",
  };

  return (
    <button
      type="button"
      onClick={() => {
        if (!onChange) return;
        const nextStatus = status === "مكتملة" || status === "completed" ? "كنسل" : "مكتملة";
        onChange(nextStatus);
      }}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[13px] font-medium",
        config.bg,
        config.text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
      {onChange && <ChevronDown className="h-3.5 w-3.5" />}
    </button>
  );
}