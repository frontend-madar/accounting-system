"use client";

import { useParams } from "next/navigation";

import { UpdateDailyEntryForm } from "@/components/dashboard/daily-entries/UpdateDailyEntryForm";
import { Topbar } from "@/components/dashboard/Topbar";

export default function EditDailyEntryPage() {
    const params = useParams<{ id: string }>();

    return (
        <div className="px-4 space-y-5">
            <Topbar isNested={true} path="تعديل قيد يومي" />
            <UpdateDailyEntryForm entryId={params.id} />
        </div>
    );
}