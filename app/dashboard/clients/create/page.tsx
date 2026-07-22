"use client";

import { CreateCustomerForm } from "@/components/dashboard/clients/CreateCustomerForm";
import { CreateInvoiceForm } from "@/components/dashboard/invoice/CreateInvoiceForm";
import { Topbar } from "@/components/dashboard/Topbar";
import { InvoiceFormValues } from "@/validations/Invoice";


export default function CreateCustomerPage() {
    function handleSaveDraft(values: Partial<InvoiceFormValues>) {
        // TODO: persist as a draft (e.g. POST /api/invoices?status=draft)
        console.log("save draft", values);
    }

    function handleSaveAndPrint(values: InvoiceFormValues) {
        // TODO: persist + trigger print (e.g. POST /api/invoices then window.print())
        console.log("save & print", values);
    }

    return (
        <div className="px-4 space-y-5">
            <Topbar path="إضافة عميل" title="" userName="mohamed ali" />
            <CreateCustomerForm
                invoiceNumber="676534"
                onSaveDraft={handleSaveDraft}
                onSaveAndPrint={handleSaveAndPrint}
            />
        </div>
    );
}