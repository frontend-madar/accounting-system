"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EmployeeAvatar } from "./Employeeavatar";


export interface Employee {
    id: string;
    jobNumber: string;
    name: string;
    department: string;
    baseSalary: number;
}

function currency(value: number) {
    return `EGP ${value.toLocaleString("en-US")}`;
}

/**
 * Returns the column definitions for the employee-selection table used
 * when running a new payroll cycle.
 */
export function getEmployeeSelectionColumns(): ColumnDef<Employee>[] {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center   gap-3">
                    <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border accent-[#40369F]"
                        checked={table.getIsAllRowsSelected()}
                        ref={(el) => {
                            if (el) el.indeterminate = table.getIsSomeRowsSelected();
                        }}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                        aria-label="تحديد كل الموظفين"
                    />
                    <span>الكل</span>
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border accent-[#40369F]"
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        aria-label={`تحديد ${row.original.name}`}
                    />
                </div>
            ),
            enableSorting: false,
        },
        {
            accessorKey: "jobNumber",
            header: "الرقم الوظيفي",
        },
        {
            id: "employee",
            header: "الموظف",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <EmployeeAvatar name={row.original.name} />
                    <span>{row.original.name}</span>
                </div>
            ),
        },
        {
            accessorKey: "department",
            header: "القسم",
        },
        {
            accessorKey: "baseSalary",
            header: "الراتب الاساسي",
            cell: ({ getValue }) => currency(getValue<number>()),
        },
    ];
}