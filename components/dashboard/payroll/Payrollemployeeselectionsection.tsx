"use client";

import { useMemo, useState } from "react";
import { PaginationState, RowSelectionState } from "@tanstack/react-table";
import { Employee } from "@/types/types";
import { getEmployeeSelectionColumns } from "./Employeecolumns";
import { SelectFilter } from "./Selectfilter";
import SearchInput from "../SearchInput";
import { EmployeeSelectionTable } from "./Employeeselectiontable";
import { DataTablePagination } from "../Pagination";


const PAGE_SIZE = 9;
const ALL_DEPARTMENTS = "all";

interface DepartmentOption {
    label: string;
    value: string;
}

interface PayrollEmployeeSelectionSectionProps {
    title?: string;
    subtitle?: string;
    /** Full employee dataset available for this payroll run. */
    data: Employee[];
    /** Department filter options (excluding the "all" option, added automatically). */
    departments: DepartmentOption[];
    onSelectionChange?: (selectedIds: string[]) => void;
    className?: string;
}

export function PayrollEmployeeSelectionSection({
    title = "تشغيل مسير رواتب",
    subtitle = "اتبع الخطوات لاحتساب وإنشاء مسير رواتب جديد.",
    data,
    departments,
    onSelectionChange,
    className,
}: PayrollEmployeeSelectionSectionProps) {
    const [query, setQuery] = useState("");
    const [department, setDepartment] = useState(ALL_DEPARTMENTS);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });

    const departmentOptions = useMemo(
        () => [{ label: "جميع الاقسام", value: ALL_DEPARTMENTS }, ...departments],
        [departments]
    );

    const filtered = useMemo(() => {
        const trimmedQuery = query.trim();

        return data.filter((employee) => {
            const matchesQuery = trimmedQuery
                ? employee.name.includes(trimmedQuery) ||
                employee.jobNumber.includes(trimmedQuery)
                : true;
            const matchesDepartment =
                department === ALL_DEPARTMENTS || employee.department === department;

            return matchesQuery && matchesDepartment;
        });
    }, [data, query, department]);

    const columns = useMemo(() => getEmployeeSelectionColumns(), []);

    const selectedCount = useMemo(
        () => Object.values(rowSelection).filter(Boolean).length,
        [rowSelection]
    );

    function handleRowSelectionChange(
        updater: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState)
    ) {
        setRowSelection((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            onSelectionChange?.(
                Object.keys(next).filter((id) => next[id])
            );
            return next;
        });
    }

    function resetToFirstPage() {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
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

                    <div className="flex items-center  gap-2 w-[250px] h-[50px] px-4  rounded-lg border border-border">
                        <span className="text-[14px] text-[#0F1219] font-medium">القسم:</span>
                        <SelectFilter
                            value={department}
                            className="border-none text-[#0F1219] font-medium"
                            onChange={(value) => {
                                setDepartment(value);
                                resetToFirstPage();
                            }}
                            options={departmentOptions}
                        />
                    </div>
                </div>
                <div className=" text-center  md:text-[20px] text-[#676A6E]">
                    تم تحديد {selectedCount} من {data.length}
                </div>

            </div>

            <div className="mt-4 overflow-hidden">
                <EmployeeSelectionTable
                    columns={columns}
                    data={filtered}
                    getRowId={(row) => row.id}
                    rowSelection={rowSelection}
                    onRowSelectionChange={handleRowSelectionChange}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                />
            </div>

            <DataTablePagination
                className="mt-4"
                page={pagination.pageIndex + 1}
                pageSize={pagination.pageSize}
                totalRecords={filtered.length}
                onPageChange={(page) =>
                    setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))
                }
            />
        </section>
    );
}