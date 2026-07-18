"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { getPayrollColumns, Payroll } from "./Payrollcolumns";
import MainButton from "../MainButton";
import { SelectFilter } from "./Selectfilter";
import SearchInput from "../SearchInput";
import { DataTablePagination } from "../Pagination";
import { DataTable } from "../DataTable";



const PAGE_SIZE = 9;

const MONTH_OPTIONS = [
    { label: "الكل", value: "all" },
    { label: "يناير", value: "1" },
    { label: "فبراير", value: "2" },
    { label: "مارس", value: "3" },
    { label: "ابريل", value: "4" },
    { label: "مايو", value: "5" },
    { label: "يونيو", value: "6" },
    { label: "يوليو", value: "7" },
    { label: "أغسطس", value: "8" },
    { label: "سبتمبر", value: "9" },
    { label: "أكتوبر", value: "10" },
    { label: "نوفمبر", value: "11" },
    { label: "ديسمبر", value: "12" },
];

const YEAR_OPTIONS = [
    { label: "2026", value: "2026" },
    { label: "2025", value: "2025" },
    { label: "2024", value: "2024" },
];

interface PayrollTableSectionProps {
    title?: string;
    subtitle?: string;
    addButtonLabel?: string;
    onAddClick?: () => void;
    onView?: (payrollId: string) => void;
    onOpenActions?: (payrollId: string) => void;
    /** Full dataset — pagination below is client-side over this array. */
    data: Payroll[];
    /** Total record count, if it differs from `data.length` (server pagination). */
    totalRecords?: number;
    className?: string;
}

export function PayrollTableSection({
    title = "قائمة المرتبات",
    subtitle = "إدارة مسيرات الرواتب ومتابعة عمليات الصرف والاعتماد.",
    addButtonLabel = "تشغيل مسير رواتب",
    onAddClick,
    onView,
    onOpenActions,
    data,
    totalRecords,
    className,
}: PayrollTableSectionProps) {
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");
    const [year, setYear] = useState(YEAR_OPTIONS[0].value);
    const [month, setMonth] = useState(MONTH_OPTIONS[0].value);

    const filtered = useMemo(() => {
        return data.filter((row) => {
            const matchesQuery = query.trim()
                ? row.runNumber.includes(query.trim())
                : true;
            const matchesYear = row.month.includes(year);
            const matchesMonth =
                month === "all" ||
                row.month.startsWith(MONTH_OPTIONS.find((m) => m.value === month)?.label ?? "");

            return matchesQuery && matchesYear && matchesMonth;
        });
    }, [data, query, year, month]);

    const pageRows = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);

    const columns = useMemo(
        () => getPayrollColumns({ onView, onOpenActions }),
        [onView, onOpenActions]
    );

    return (
        <section className={className}>
            <div className="flex flex-col gap-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-[24px] font-bold text-[#0F1219]">
                            {title}
                        </h2>
                        <p className="mt-1 font-medium text-[16px] text-[#0F1219]">
                            {subtitle}
                        </p>
                    </div>

                    <MainButton
                        text={addButtonLabel}
                        icon={<Plus className="h-4 w-4" />}
                        href="payroll/run"
                    />
                </div>
            </div>


            <div className=" mt-10 min-h-[114px] flex flex-col md:flex-row md:items-center justify-between  gap-2 bg-white p-4 rounded-2xl ctm-shadow">

                <SearchInput
                    query={query}
                    setQuery={setQuery}
                    setPage={setPage}
                    placeholder="بحث برقم المسير..."
                />
                <div className="flex items-center gap-4" >
                    <span className="text-[14px] text-[#232323] shrink-0">
                        الشهر
                    </span>
                    <SelectFilter
                        value={month}
                        onChange={(value) => {
                            setMonth(value);
                            setPage(1);
                        }}
                        options={MONTH_OPTIONS}
                    />
                    <span className="text-[14px] text-[#232323] shrink-0">
                        السنة
                    </span>
                    <SelectFilter
                        value={year}
                        onChange={(value) => {
                            setYear(value);
                            setPage(1);
                        }}
                        options={YEAR_OPTIONS}
                    />
                </div>
            </div>

            <div className="mt-10 overflow-hidden bg-white p-4 rounded-2xl ctm-shadow">
                <DataTable columns={columns} data={pageRows} />
                <DataTablePagination
                    className="mt-4"
                    page={page}
                    pageSize={PAGE_SIZE}
                    totalRecords={totalRecords ?? filtered.length}
                    onPageChange={setPage}
                />
            </div>

        </section>
    );
}