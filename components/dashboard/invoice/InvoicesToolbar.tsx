"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import SearchInput from "../SearchInput";
import FillterButton from "../FillterButton";
import MainButton from "../shared/MainButton";
import { ExportDropdown } from "../shared/ExportDropdown";
import {
    useExportInvoicesPdf,
    useExportInvoicesExcel,
    useExportInvoicesEmail,
} from "@/hooks/use-invoice";

const STATUS_OPTIONS = ["الكل", "مكتملة", "كنسل", "باقي الدفع"];

interface InvoicesToolbarProps {
    query: string;
    setQuery: (value: string) => void;
    setPage: (page: number) => void;
    statusFilter: string;
    onFilterChange: (value: string) => void;
    onCreateInvoice?: () => void;
    onOpenDrafts?: () => void;
    className?: string;
}

export function InvoicesToolbar({
    query,
    setQuery,
    setPage,
    statusFilter,
    onFilterChange,
    onCreateInvoice,
    onOpenDrafts,
    className,
}: InvoicesToolbarProps) {
    const { mutate: exportPdf, isPending: isExportingPdf } = useExportInvoicesPdf();
    const { mutate: exportExcel, isPending: isExportingExcel } = useExportInvoicesExcel();
    const { mutate: exportEmail, isPending: isExportingEmail } = useExportInvoicesEmail();

    function handleExportPdf() {
        exportPdf({});
    }

    function handleExportExcel() {
        exportExcel({});
    }

    function handleExportEmail(email: string) {
        exportEmail({ to: email });
    }

    return (
        <div className={cn("flex flex-col md:flex-row bg-red  items-center justify-between gap-3", className)}>
            <div className="w-full md:w-auto"><SearchInput query={query} setQuery={setQuery} setPage={setPage} /></div>

            <div className="flex flex-col md:flex-row justify-end  w-full gap-2">
                <FillterButton
                    options={STATUS_OPTIONS}
                    selectedFilter={statusFilter}
                    onFilterChange={onFilterChange}
                    className="md:w-auto w-full"
                />

                <ExportDropdown
                    label="تصدير"
                    className="md:w-auto w-full"
                    isExportingPdf={isExportingPdf}
                    isExportingExcel={isExportingExcel}
                    isExportingEmail={isExportingEmail}
                    onExportPdf={handleExportPdf}
                    onExportExcel={handleExportExcel}
                    onExportEmail={handleExportEmail}
                />

                <MainButton
                    text="إنشاء فاتورة"
                    icon={<Plus className="h-4 w-4" />}
                    href="/dashboard/invoices/create"
                    onClick={onCreateInvoice}
                    className="md:w-auto w-full "
                />
            </div>
        </div>
    );
}
