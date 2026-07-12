"use client";

import { InvoicesList } from "@/components/dashboard/invoice/InvoicesList";
import { InvoicesToolbar } from "@/components/dashboard/invoice/InvoicesToolbar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SAMPLE_INVOICES } from "@/data/data";
import { useMemo, useState } from "react";



export default function InvoicesPage() {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        if (!query.trim()) return SAMPLE_INVOICES;
        return SAMPLE_INVOICES.filter(
            (invoice) =>
                invoice.clientName.includes(query) ||
                invoice.employeeName.includes(query) ||
                invoice.invoiceNumber.includes(query)
        );
    }, [query]);

    return (
        <div className="space-y-4 px-4">

            <Topbar title=" الفواتير" userName="mohamed ali" search={false} />
            <div className="bg-white p-4 space-y-4 shadow-[0px_3px_10.3px_0px_#0000001A] rounded-3xl" >
                <InvoicesToolbar
                    onSearch={setQuery}
                    onCreateInvoice={() => console.log("navigate to create invoice")}
                    onOpenDrafts={() => console.log("open drafts")}
                    onFilterChange={(value) => console.log("filter:", value)}
                />

                <InvoicesList
                    invoices={filtered}
                    onSelectInvoice={(invoice) => console.log("open invoice", invoice.id)}
                    getActions={(invoice) => [
                        { label: "عرض التفاصيل", onSelect: () => console.log("view", invoice.id) },
                        { label: "طباعة", onSelect: () => console.log("print", invoice.id) },
                        {
                            label: "حذف",
                            destructive: true,
                            onSelect: () => console.log("delete", invoice.id),
                        },
                    ]}
                />
            </div>
        </div>
    );
}