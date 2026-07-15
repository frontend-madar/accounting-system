import { Card, CardContent } from "@/components/ui/card";
import { NotificationItemData } from "@/types/types";
import { NotificationIcon } from "./NotificationIcon";


interface NotificationItemProps {
    notification: NotificationItemData;
}

export function NotificationItem({ notification }: NotificationItemProps) {
    const { type, title, description, time, unread } = notification;

    return (
        <Card className="rounded-2xl !border-none min-h-[147px] justify-center bg-white py-4 shadow-[0px_2px_5.3px_0px_#00000014]">
            <CardContent className="flex flex-col md:flex-row items-start !border-none justify-between gap-4 px-4">
                

                <div className="flex flex-col md:flex-row items-start justify-end gap-3">
                    <NotificationIcon type={type} />
                    <div className="text-right">
                        <p className="text-[20px] lg:text-[26px] font-bold text-[#010204]">{title}</p>
                        <p className="mt-1 text-[18px] lg:text-[22px] leading-relaxed text-[#1E2024]">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                    {unread && (
                        <span
                            className="h-2 w-2 shrink-0 rounded-full bg-[#0F9D8B]"
                            aria-label="إشعار غير مقروء"
                        />
                    )}
                    <span className="whitespace-nowrap text-[16px] lg:text-[20px] text-[#585959]">
                        {time}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}