import { DailyEntriesSection } from "@/components/dashboard/daily-entries/DailyEntriesSection";
import { Topbar } from "@/components/dashboard/Topbar";



export default function DailyEntriesPage() {
    return (
        <div className="px-4 space-y-4">
            <Topbar title="القيود اليومية" />
            <DailyEntriesSection className="bg-white p-5 rounded-3xl" />
        </div>
    );
}