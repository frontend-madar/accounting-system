import { NotificationsList } from "@/components/dashboard/notifications/NotificationsList";
import { Topbar } from "@/components/dashboard/Topbar";
 

export default function NotificationsPage() {
    return (
        <main className=" space-y-4 px-4">
            <Topbar title="الإشعارات" />
            <NotificationsList  />
        </main>
    );
}