"use client";

import * as React from "react";
import { FileEdit, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import SearchInput from "../SearchInput";
import FillterButton from "../FillterButton";
import MainButton from "../shared/MainButton";
import SecondaryButton from "../shared/SecondaryButton";

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
    return (
        <div className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
            <div><SearchInput query={query} setQuery={setQuery} setPage={setPage} /></div>

            <div className="flex items-center gap-2">
                <FillterButton
                    options={STATUS_OPTIONS}
                    selectedFilter={statusFilter}
                    onFilterChange={onFilterChange}
                />

                <MainButton
                    text="إنشاء فاتورة"
                    icon={<Plus className="h-4 w-4" />}
                    href="/dashboard/invoices/create"
                    onClick={onCreateInvoice}
                />
            </div>
        </div>
    );
}