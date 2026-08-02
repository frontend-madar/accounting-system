"use client";

import { CreateDailyEntryForm } from "@/components/dashboard/daily-entries/CreateDailyEntryForm";
import { Topbar } from "@/components/dashboard/Topbar";

export default function CreateDailyEntryPage() {
    return (
        <div className="px-4 space-y-5">
            <Topbar isNested={true} path="إضافة قيد يومي" />
            <CreateDailyEntryForm />
        </div>
    );
}