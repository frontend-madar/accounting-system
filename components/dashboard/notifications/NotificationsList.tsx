import { cn } from "@/lib/utils";
import { NotificationGroupData } from "@/types/types";
import { NotificationGroup } from "./NotificationGroup";

interface NotificationsListProps {
    groups: NotificationGroupData[];
    className?: string;
}

export function NotificationsList({ groups, className }: NotificationsListProps) {
    if (groups.length === 0) {
        return (
            <div
                className={cn(
                    "rounded-2xl bg-white p-8 text-center text-[#6B6B70] ctm-shadow",
                    className
                )}
            >
                لا توجد إشعارات حتى الآن
            </div>
        );
    }

    return (
        <div className={cn("w-full space-y-6", className)}>
            {groups.map((group) => (
                <NotificationGroup key={group.id} group={group} />
            ))}
        </div>
    );
}