"use client";

import { useParams } from "next/navigation";

import { InvoiceDetail } from "@/components/dashboard/invoice/InvoiceDetail";
import { Topbar } from "@/components/dashboard/Topbar";

export default function InvoiceDetailPage() {
    const params = useParams<{ id: string }>();

    return (
        <div className="px-4 space-y-5">
            <Topbar isNested={true} path="تفاصيل الفاتورة" />
            <InvoiceDetail invoiceId={params.id} />
        </div>
    );
}