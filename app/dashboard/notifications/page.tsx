import { NotificationsList } from "@/components/dashboard/notifications/NotificationsList";
import { Topbar } from "@/components/dashboard/Topbar";
import { NOTIFICATION_GROUPS } from "@/data/data";


export default function NotificationsPage() {
    return (
        <main className=" space-y-4 px-4">
            <Topbar title="الإشعارات" />
            <NotificationsList groups={NOTIFICATION_GROUPS} />
        </main>
    );
}