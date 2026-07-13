import { DailyEntriesSection } from "@/components/dashboard/DailyEntriesSection";
import { Topbar } from "@/components/dashboard/Topbar";
import { DAILY_ENTRIES } from "@/data/data";



export default function DailyEntriesPage() {
    return (
        <div className="px-4 space-y-4">
            <Topbar title="القيود اليومية" />
            <DailyEntriesSection data={DAILY_ENTRIES} totalRecords={45} className="bg-white p-5 rounded-3xl" />
        </div>
    );
}