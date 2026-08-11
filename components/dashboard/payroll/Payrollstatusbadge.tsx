"use client";

import type { PayrollRunStatus } from "@/types/payroll.types";

const STATUS_CONFIG: Record<
    any,
    { label: string; badgeClass: string; dotClass: string }
> = {
    APPROVED: {
        label: "معتمدة",
        badgeClass: "bg-[#E7F7EF] text-[#1F9254]",
        dotClass: "bg-[#1F9254]",
    },
    DRAFT: {
        label: "مسودة",
        badgeClass: "bg-[#EBEBEC] text-[#0F1219]",
        dotClass: "bg-[#9CA3AF]",
    },
    CANCELLED: {
        label: "كانسل",
        badgeClass: "bg-[#FDEDEA] text-[#E0472C]",
        dotClass: "bg-[#E0472C]",
    },
};

interface PayrollStatusBadgeProps {
    value: PayrollRunStatus;
}

export function PayrollStatusBadge({ value }: PayrollStatusBadgeProps) {
    const config = STATUS_CONFIG[value] ?? {
        label: value,
        badgeClass: "bg-[#EBEBEC] text-[#0F1219]",
        dotClass: "bg-[#9CA3AF]",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium ${config.badgeClass}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
            {config.label}
        </span>
    );
}