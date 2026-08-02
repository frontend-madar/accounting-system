"use client";

import { CreateInvoiceForm } from "@/components/dashboard/invoice/CreateInvoiceForm";
import { Topbar } from "@/components/dashboard/Topbar";
import { InvoiceFormValues } from "@/validations/Invoice";

 
export default function CreateInvoicePage() {
    function handleSaveDraft(values: Partial<InvoiceFormValues>) {
        // TODO: persist as a draft (e.g. POST /api/invoices?status=draft)
        console.log("save draft", values);
    }

     

    return (
        <div className="px-4 space-y-5">
            <Topbar isNested={true} path="إضافة فاتورة" />
            <CreateInvoiceForm onSaveDraft={handleSaveDraft} />
        </div>
    );
}