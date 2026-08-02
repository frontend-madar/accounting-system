"use client";

import { useMemo, useState } from "react";

import SearchInput from "../SearchInput";
import { DataTablePagination } from "../Pagination";
import { DataTable } from "../DataTable";
import { getPayrollDetailColumns } from "./Payrolldetailcolumns";
import { usePayrollDetails, useUpdatePayrollDetail } from "@/hooks/use-payroll";

const PAGE_SIZE = 9;

interface PayrollDetailTableSectionProps {
    payrollRunId?: string;
    title?: string;
    searchPlaceholder?: string;
    className?: string;
}

export function PayrollDetailTableSection({
    payrollRunId,
    title = "جدول الرواتب التفصيلي",
    searchPlaceholder = "بحث عن موظف...",
    className,
}: PayrollDetailTableSectionProps) {
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");

    const { data: detailsRes, isLoading } = usePayrollDetails({
        payrollRunId,
        search: query || undefined,
        page,
        limit: PAGE_SIZE,
    });

    const { mutate: updateDetail } = useUpdatePayrollDetail();

    const rows = detailsRes?.data.data ?? [];
    const totalRecords = detailsRes?.data.total ?? 0;

    const handleBonusChange = (id: string, value: number) => {
        updateDetail({ id, payload: { bonuses: value } });
    };

    const handleDeductionChange = (id: string, value: number) => {
        updateDetail({ id, payload: { deductions: value } });
    };

    

    const columns = useMemo(
        () =>
            getPayrollDetailColumns({
                onBonusChange: handleBonusChange,
                onDeductionChange: handleDeductionChange,
            }),
        []
    );

    function resetToFirstPage() {
        setPage(1);
    }

    return (
        <section className={`bg-white p-4 rounded-2xl ctm-shadow ${className ?? ""}`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-[20px] font-bold text-[#0F1219]">{title}</h2>

                <div>
                    <SearchInput
                        query={query}
                        setQuery={setQuery}
                        setPage={resetToFirstPage}
                        placeholder={searchPlaceholder}
                    />
                </div>
            </div>

            <div className="mt-6 overflow-x-auto">
                <DataTable columns={columns} data={rows} isLoading={isLoading} />
            </div>

            <DataTablePagination
                className="mt-4"
                page={page}
                pageSize={PAGE_SIZE}
                totalRecords={totalRecords}
                onPageChange={setPage}
            />
        </section>
    );
}