import { Bell, Clock, Landmark, ReceiptText, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { NotificationType } from "@/types/types";

interface IconConfig {
    icon: LucideIcon;
    iconClassName: string;
    bgClassName: string;
    borderClassName: string;
}

const ICON_CONFIG: Record<NotificationType, IconConfig> = {
    salary_paid: {
        icon: Landmark,
        iconClassName: "text-[#2F6FE4]",
        bgClassName: "bg-[#EAF2FF]",
        borderClassName: "border-[#BFD9FF]",
    },
    salary_pending: {
        icon: Clock,
        iconClassName: "text-[#C98A02]",
        bgClassName: "bg-[#FFF6E5]",
        borderClassName: "border-[#FFE1A8]",
    },
    expense_created: {
        icon: ReceiptText,
        iconClassName: "text-[#5B5FEA]",
        bgClassName: "bg-[#EFF0FF]",
        borderClassName: "border-[#D8DAFF]",
    },
};

const DEFAULT_ICON_CONFIG: IconConfig = {
    icon: Bell,
    iconClassName: "text-[#6B6B70]",
    bgClassName: "bg-[#F2F2F5]",
    borderClassName: "border-[#E1E1E6]",
};

/** Maps the raw API notification `type` string (e.g. "PAYROLL_DRAFT", "EXPENSE_CREATED")
 * to the local NotificationType keys this component's icon config is keyed by. */
const API_TYPE_MAP: Record<string, NotificationType> = {
    PAYROLL_DRAFT: "salary_pending",
    PAYROLL_PAID: "salary_paid",
    EXPENSE_CREATED: "expense_created",
};

interface NotificationIconProps {
    type: string;
    className?: string;
}

export function NotificationIcon({ type, className }: NotificationIconProps) {
    const mappedType = API_TYPE_MAP[type];
    const { icon: Icon, iconClassName, bgClassName, borderClassName } =
        (mappedType && ICON_CONFIG[mappedType]) || DEFAULT_ICON_CONFIG;

    return (
        <div
            className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
                bgClassName,
                borderClassName,
                className
            )}
        >
            <Icon className={cn("h-5 w-5", iconClassName)} strokeWidth={1.75} />
        </div>
    );
}