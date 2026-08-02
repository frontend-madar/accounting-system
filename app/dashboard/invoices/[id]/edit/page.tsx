"use client";

import { useParams } from "next/navigation";

import { UpdateInvoiceForm } from "@/components/dashboard/invoice/UpdateInvoiceForm";
import { Topbar } from "@/components/dashboard/Topbar";

export default function EditInvoicePage() {
    const params = useParams<{ id: string }>();

    return (
        <div className="px-4 space-y-5">
            <Topbar isNested={true} path="تعديل الفاتورة" />
            <UpdateInvoiceForm invoiceId={params.id} />
        </div>
    );
}