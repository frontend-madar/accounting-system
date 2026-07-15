import { Clock, Landmark, ReceiptText, type LucideIcon } from "lucide-react";

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

interface NotificationIconProps {
    type: NotificationType;
    className?: string;
}

export function NotificationIcon({ type, className }: NotificationIconProps) {
    const { icon: Icon, iconClassName, bgClassName, borderClassName } =
        ICON_CONFIG[type];

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