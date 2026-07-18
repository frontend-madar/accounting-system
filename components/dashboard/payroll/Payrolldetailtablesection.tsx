"use client";

import { useMemo, useState } from "react";

import SearchInput from "../SearchInput";
import { DataTablePagination } from "../Pagination";
import { DataTable } from "../DataTable";
import { getPayrollDetailColumns, PayrollDetail } from "./Payrolldetailcolumns";

const PAGE_SIZE = 9;

interface PayrollDetailTableSectionProps {
    title?: string;
    searchPlaceholder?: string;
    onBonusChange?: (payrollId: string, value: number) => void;
    onDeductionChange?: (payrollId: string, value: number) => void;
    /** Full dataset — pagination below is client-side over this array. */
    data: PayrollDetail[];
    /** Total record count, if it differs from `data.length` (server pagination). */
    totalRecords?: number;
    className?: string;
}

export function PayrollDetailTableSection({
    title = "جدول الرواتب التفصيلي",
    searchPlaceholder = "بحث عن موظف...",
    onBonusChange,
    onDeductionChange,
    data,
    totalRecords,
    className,
}: PayrollDetailTableSectionProps) {
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        if (!query.trim()) return data;
        const q = query.trim().toLowerCase();
        return data.filter((row) => row.employee.name.toLowerCase().includes(q));
    }, [data, query]);

    const pageRows = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);

    const columns = useMemo(
        () => getPayrollDetailColumns({ onBonusChange, onDeductionChange }),
        [onBonusChange, onDeductionChange]
    );

    return (
        <section className={`bg-white p-4 rounded-2xl ctm-shadow ${className ?? ""}`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-[20px] font-bold text-[#0F1219]">{title}</h2>

                <SearchInput
                    query={query}
                    setQuery={setQuery}
                    setPage={setPage}
                    placeholder={searchPlaceholder}
                    // className="md:w-[280px]"
                />
            </div>

            <div className="mt-6 overflow-x-auto">
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