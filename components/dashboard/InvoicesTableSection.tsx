"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getInvoiceColumns, Invoice } from "./InvoicesColumns";
import { DataTable } from "./DataTable";
import { DataTablePagination } from "./Pagination";
import { InvoiceStatus } from "./StatusBadge";


const PAGE_SIZE = 5;

interface InvoicesTableSectionProps {
    title?: string;
    addButtonLabel?: string;
    onAddClick?: () => void;
    /** Full dataset — pagination below is client-side over this array. */
    data: Invoice[];
    /** Total record count, if it differs from `data.length` (server pagination). */
    totalRecords?: number;
    className?: string;
}

export function InvoicesTableSection({
    title = "المبالغ المستحقة",
    addButtonLabel = "إضافة عميل",
    onAddClick,
    data,
    totalRecords,
    className,
}: InvoicesTableSectionProps) {
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");
    const [rows, setRows] = useState(data);

    const filtered = useMemo(() => {
        if (!query.trim()) return rows;
        const q = query.trim();
        return rows.filter(
            (row) => row.client.includes(q) || row.employee.includes(q)
        );
    }, [rows, query]);

    const pageRows = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);

    function handleStatusChange(invoiceId: string, status: InvoiceStatus) {
        setRows((prev) =>
            prev.map((row) => (row.id === invoiceId ? { ...row, status } : row))
        );
    }

    const columns = useMemo(
        () => getInvoiceColumns({ onStatusChange: handleStatusChange }),
        []
    );

    return (
        <section className={className}>
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-[18px] font-semibold text-foreground">{title}</h2>
                <div className="flex items-center gap-2">

                    <div className="relative w-full max-w-xs">
                        <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="بحث"
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setPage(1);
                            }}
                            className="h-11 border-[#C8C2FC]   pr-9 text-right"
                        />
                    </div>

                    <Button
                        onClick={onAddClick}
                        className="gap-2 rounded-xl w-38 h-11 bg-[#463BAF] hover:bg-[#332a80] text-[18px]"
                    >
                        <Plus className="h-4 w-4" />
                        {addButtonLabel}
                    </Button>
                </div>

            </div>

            <div className="mt-4 overflow-hidden ">
                <DataTable columns={columns} data={pageRows} />
            </div>

            <DataTablePagination
                className="mt-4"
                page={page}
                pageSize={PAGE_SIZE}
                totalRecords={totalRecords ?? filtered.length}
                onPageChange={setPage}
            />
        </section>
    );
}