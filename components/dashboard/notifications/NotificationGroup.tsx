import { NotificationGroupData } from "@/types/types";
import { NotificationItem } from "./NotificationItem";


interface NotificationGroupProps {
    group: NotificationGroupData;
}

export function NotificationGroup({ group }: NotificationGroupProps) {
    return (
        <section aria-labelledby={`notification-group-${group.id}`} className="space-y-3">
            <h2
                id={`notification-group-${group.id}`}
                className="text-right text-[25px] font-semibold text-[#010204]"
            >
                {group.label}
            </h2>

            <div className="space-y-3">
                {group.items.map((item) => (
                    <NotificationItem key={item.id} notification={item} />
                ))}
            </div>
        </section>
    );
}