"use client";

import { useEffect, useMemo, useState } from "react";
import { PaginationState, RowSelectionState } from "@tanstack/react-table";
import { getEmployeeSelectionColumns, Employee } from "./Employeecolumns";
import FillterButton from "../FillterButton";
import SearchInput from "../SearchInput";
import { DataTable } from "../DataTable";
import { DataTablePagination } from "../Pagination";
import { useEmployees } from "@/hooks/use-employee";
import { useDepartmentStore } from "@/store/department.store";
import { EmployeeData } from "@/types/employee.types";

const PAGE_SIZE = 10;
const ALL_DEPARTMENTS_LABEL = "جميع الاقسام";

/** Maps the API EmployeeData shape to the column-friendly Employee shape. */
function toTableRow(e: EmployeeData): Employee {
    return {
        id: e.id,
        jobNumber: e.nationalId,
        name: e.fullName,
        department: e.department,
        baseSalary: parseFloat(e.basicSalary) || 0,
    };
}

interface PayrollEmployeeSelectionSectionProps {
    title?: string;
    subtitle?: string;
    initialSelectedIds?: string[];
    onSelectionChange?: (selectedIds: string[]) => void;
    className?: string;
}

export function PayrollEmployeeSelectionSection({
    title = "تشغيل مسير رواتب",
    subtitle = "اتبع الخطوات لاحتساب وإنشاء مسير رواتب جديد.",
    initialSelectedIds,
    onSelectionChange,
    className,
}: PayrollEmployeeSelectionSectionProps) {
     const [query, setQuery] = useState("");
    const [department, setDepartment] = useState(ALL_DEPARTMENTS_LABEL);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>(() => {
        if (!initialSelectedIds) return {};
        return Object.fromEntries(initialSelectedIds.map((id) => [id, true]));
    });
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });

    // ── Departments from store ──────────────────────────────────────────────
    const { departments, fetchDepartments } = useDepartmentStore();

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);

    const departmentOptions = useMemo(
        () => [ALL_DEPARTMENTS_LABEL, ...departments],
        [departments]
    );

    // ── Server-side data ────────────────────────────────────────────────────
    const { data: employeesRes, isLoading } = useEmployees({
        search: query || undefined,
        department: department === ALL_DEPARTMENTS_LABEL ? undefined : department,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });

    const rows = useMemo(
        () => (employeesRes?.data.data ?? []).map(toTableRow),
        [employeesRes]
    );
    const totalRecords = employeesRes?.data.total ?? 0;

    const columns = useMemo(() => getEmployeeSelectionColumns(), []);

    const selectedCount = useMemo(
        () => Object.values(rowSelection).filter(Boolean).length,
        [rowSelection]
    );

    function handleRowSelectionChange(
        updater: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState)
    ) {
        setRowSelection(updater);
    }

    useEffect(() => {
        const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
        onSelectionChange?.(selectedIds);
    }, [rowSelection, onSelectionChange]);

    function resetToFirstPage() {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }

    function handleDepartmentFilterChange(value: string) {
        setDepartment(value);
        resetToFirstPage();
    }

    return (
        <section className={`${className}  bg-white p-4 rounded-2xl ctm-shadow`} >
            <div>
                <h2 className="text-[20px] font-bold text-[#0F1219]">{title}</h2>
                <p className="mt-1 text-[16px] text-[#676A6E]">{subtitle}</p>
            </div>

            <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-2 rounded-lg border border-border p-4 ">
                <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
                    <SearchInput
                        query={query}
                        setQuery={setQuery}
                        setPage={resetToFirstPage}
                        placeholder="بحث عن موظف..."
                    />

                    <FillterButton
                        options={departmentOptions}
                        selectedFilter={department}
                        onFilterChange={handleDepartmentFilterChange}
                    />
                </div>
                <div className=" text-center  md:text-[18px] text-[#676A6E]">
                    تم تحديد {selectedCount} من {totalRecords}
                </div>

            </div>

            <div className="mt-4 overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={rows}
                    isLoading={isLoading}
                    getRowId={(row) => row.id}
                    rowSelection={rowSelection}
                    onRowSelectionChange={handleRowSelectionChange}
                />
            </div>

            <DataTablePagination
                className="mt-4"
                page={pagination.pageIndex + 1}
                pageSize={pagination.pageSize}
                totalRecords={totalRecords}
                onPageChange={(page) =>
                    setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))
                }
            />
        </section>
    );
}