"use client";

export type PayrollStatus = "مدفوع" | "معتمدة" | "مسودة" | "لم يتم الاختيار";

const STATUS_CONFIG: Record<
    PayrollStatus,
    { label: string; badgeClass: string; dotClass: string }
> = {
    مدفوع: {
        label: "مدفوع",
        badgeClass: "bg-[#E6F6F4] text-[#1BA915]",
        dotClass: "bg-[#1F9254]",
    },
    معتمدة: {
        label: "معتمدة",
        badgeClass: "bg-[#E7F7EF] text-[#1F9254]",
        dotClass: "bg-[#1F9254]",
    },
    مسودة: {
        label: "مسودة",
        badgeClass: "bg-[#EBEBEC] text-[#0F1219]",
        dotClass: "bg-[#9CA3AF]",
    },
    "لم يتم الاختيار": {
        label: "لم يتم الاختيار",
        badgeClass: "bg-[#FFF4E5] text-[#B76E00]",
        dotClass: "bg-[#F59E0B]",
    },
};

interface PayrollStatusBadgeProps {
    value: PayrollStatus;
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