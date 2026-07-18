"use client";

export type PayrollStatus = "مدفوع" | "معتمد" | "مسودة";

const STATUS_CONFIG: Record<
    PayrollStatus,
    { label: string; badgeClass: string; dotClass: string }
> = {
    مدفوع: {
        label: "مدفوع",
        badgeClass: "bg-[#E6F6F4] text-[#1BA915]",
        dotClass: "bg-[#1F9254]",
    },
    معتمد: {
        label: "معتمد",
        badgeClass: "bg-[#E7F7EF] text-[#1F9254]",
        dotClass: "bg-[#1F9254]",
    },
    مسودة: {
        label: "مسودة",
        badgeClass: "bg-[#EBEBEC] text-[#0F1219]",
        dotClass: "bg-[#9CA3AF]",
    },
};

interface PayrollStatusBadgeProps {
    value: PayrollStatus;
}

export function PayrollStatusBadge({ value }: PayrollStatusBadgeProps) {
    const config = STATUS_CONFIG[value];

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium ${config.badgeClass}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
            {config.label}
        </span>
    );
}