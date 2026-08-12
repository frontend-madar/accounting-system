"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { getPayrollColumns } from "./Payrollcolumns";
import MainButton from "../shared/MainButton";
import { SelectFilter } from "./Selectfilter";
import SearchInput from "../SearchInput";
import { DataTablePagination } from "../Pagination";
import { DataTable } from "../DataTable";
import { ConfirmDeleteDialog } from "../shared/ConfirmDeleteDialog";
import { UpdatePayrollRunForm } from "./UpdatePayrollRunForm";
import { usePayrollRuns, useDeletePayrollRun } from "@/hooks/use-payroll";
import { useRouter } from "next/navigation";
import type { PayrollRunListItem } from "@/types/payroll.types";
import FilterButton from "../FillterButton";

const PAGE_SIZE = 10;

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
    className?: string;
}

export function PayrollTableSection({
    title = "قائمة المرتبات",
    subtitle = "إدارة مسيرات الرواتب ومتابعة عمليات الصرف والاعتماد.",
    addButtonLabel = "تشغيل مسير رواتب",
    className,
}: PayrollTableSectionProps) {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");
    const [year, setYear] = useState(YEAR_OPTIONS[0].value);
    const [month, setMonth] = useState(MONTH_OPTIONS[0].value);

    const [editingRunId, setEditingRunId] = useState<string | null>(null);
    const [deletingRun, setDeletingRun] = useState<PayrollRunListItem | null>(null);

    const { data: runsRes, isLoading } = usePayrollRuns({
        page,
        limit: PAGE_SIZE,
        search: query || undefined,
        month: month === "all" ? undefined : Number(month),
        year: Number(year),
    });

    const rows = runsRes?.data.data ?? [];
    const totalRecords = runsRes?.data.total ?? 0;

    const { mutate: deletePayrollRun, isPending: isDeleting } = useDeletePayrollRun();

    const columns = useMemo(
        () =>
            getPayrollColumns({
                onView: (id) => router.push(`/dashboard/payroll/payroll-details?id=${id}`),
                onEdit: (payroll) => setEditingRunId(payroll.id),
                onDelete: (payroll) => setDeletingRun(payroll),
            }),
        [router]
    );

    function resetToFirstPage() {
        setPage(1);
    }

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

                <div className="w-75" >
                    <SearchInput
                        query={query}
                        setQuery={setQuery}
                        setPage={resetToFirstPage}
                        placeholder="بحث برقم المسير..."
                    />
                </div>
                <div className="flex items-center gap-4">
                    <FilterButton
                        options={MONTH_OPTIONS.map((o) => o.label)}
                        selectedFilter={
                            MONTH_OPTIONS.find((o) => o.value === month)?.label ?? MONTH_OPTIONS[0].label
                        }
                        onFilterChange={(label) => {
                            const found = MONTH_OPTIONS.find((o) => o.label === label);
                            if (found) {
                                setMonth(found.value);
                                resetToFirstPage();
                            }
                        }}
                        className="min-w-[170px]"
                    />

                    <FilterButton
                        options={YEAR_OPTIONS.map((o) => o.value)}
                        selectedFilter={year}
                        onFilterChange={(value) => {
                            setYear(value);
                            resetToFirstPage();
                        }}
                        className="min-w-[130px]"
                    />
                </div>

            </div>

            <div className="mt-10 overflow-hidden bg-white p-4 rounded-2xl ctm-shadow">
                <DataTable columns={columns} data={rows} isLoading={isLoading} />
                <DataTablePagination
                    className="mt-4"
                    page={page}
                    pageSize={PAGE_SIZE}
                    totalRecords={totalRecords}
                    onPageChange={setPage}
                />
            </div>

            <UpdatePayrollRunForm
                payrollRunId={editingRunId}
                open={!!editingRunId}
                onOpenChange={(open) => !open && setEditingRunId(null)}
            />

            <ConfirmDeleteDialog
                open={!!deletingRun}
                onOpenChange={(open) => !open && setDeletingRun(null)}
                isLoading={isDeleting}
                title="حذف مسير الرواتب"
                description="هل أنت متأكد من حذف هذا المسير؟ لا يمكن التراجع عن هذا الإجراء."
                onConfirm={() => {
                    if (deletingRun) {
                        deletePayrollRun(deletingRun.id, {
                            onSuccess: () => setDeletingRun(null),
                        });
                    }
                }}
            />
        </section>
    );
}