"use client";

import { cn } from "@/lib/utils";

// Keyed by the exact status strings returned by GET /expenses (e.g. "مدفوع", "مسودة").
// Add any other status values your API returns here.
const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string; bg: string }> = {
    "مدفوع": {
        label: "مدفوع",
        dot: "bg-[#1BA915]",
        text: "text-[#1BA915]",
        bg: "bg-[#E6F6F4]",
    },
    "مسودة": {
        label: "مسودة",
        dot: "bg-[#0F1219]",
        text: "text-[#0F1219]",
        bg: "bg-[#EBEBEC]",
    },
};

// Fallback for any status value not in the map, so an unexpected string
// from the API never crashes the badge (and thus the whole table).
const DEFAULT_STATUS_CONFIG = {
    dot: "bg-[#6B7280]",
    text: "text-[#6B7280]",
    bg: "bg-[#F3F4F6]",
};

interface ExpenseStatusBadgeProps {
    status: string;
}

export function ExpenseStatusBadge({ status }: ExpenseStatusBadgeProps) {
    const config = STATUS_CONFIG[status];
    const { dot, text, bg } = config ?? DEFAULT_STATUS_CONFIG;
    const label = config?.label ?? status;

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[13px] font-medium",
                bg,
                text
            )}
        >
            <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
            {label}
        </span>
    );
}