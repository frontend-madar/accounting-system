"use client";

import { cn } from "@/lib/utils";
import { ExpenseRecordStatus } from "@/types/types";

const STATUS_CONFIG: Record<
    ExpenseRecordStatus,
    { label: string; dot: string; text: string; bg: string }
> = {
    paid: {
        label: "مدفوع",
        dot: "bg-[#1BA915]",
        text: "text-[#1BA915]",
        bg: "bg-[#E6F6F4]",
    },
    draft: {
        label: "مسودة",
        dot: "bg-[#0F1219]",
        text: "text-[#0F1219]",
        bg: "bg-[#EBEBEC]",
    },
};

interface ExpenseStatusBadgeProps {
    status: ExpenseRecordStatus;
}

export function ExpenseStatusBadge({ status }: ExpenseStatusBadgeProps) {
    const config = STATUS_CONFIG[status];

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[13px] font-medium",
                config.bg,
                config.text
            )}
        >
            <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
            {config.label}
        </span>
    );
}