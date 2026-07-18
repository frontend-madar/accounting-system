"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreVertical } from "lucide-react";
import { PayrollStatus, PayrollStatusBadge } from "./Payrollstatusbadge";

 
export interface Payroll {
    id: string;
    runNumber: string;
    month: string;
    period: string;
    employeesCount: number;
    netSalary: number;
    status: PayrollStatus;
    createdAt: string;
}

function currency(value: number) {
    return `EGP ${value.toLocaleString("en-US")}`;
}

interface GetPayrollColumnsOptions {
    onView?: (payrollId: string) => void;
    onOpenActions?: (payrollId: string) => void;
}

/**
 * Returns the column definitions for the payroll runs table.
 * Kept as a function (rather than a static array) so callbacks like
 * `onView` / `onOpenActions` can close over component state/handlers.
 */
export function getPayrollColumns({
    onView,
    onOpenActions,
}: GetPayrollColumnsOptions = {}): ColumnDef<Payroll>[] {
    return [
        {
            accessorKey: "runNumber",
            header: "رقم المسير",
        },
        {
            accessorKey: "month",
            header: "الشهر",
        },
        {
            accessorKey: "period",
            header: "فترة الرواتب",
        },
        {
            accessorKey: "employeesCount",
            header: "عدد الموظفين",
        },
        {
            accessorKey: "netSalary",
            header: "صافي الرواتب",
            cell: ({ getValue }) => currency(getValue<number>()),
        },
        {
            accessorKey: "status",
            header: "الحالة",
            cell: ({ row }) => <PayrollStatusBadge value={row.original.status} />,
        },
        {
            accessorKey: "createdAt",
            header: "تاريخ الانشاء",
        },
        {
            id: "view",
            header: "",
            cell: ({ row }) => (
                <button
                    type="button"
                    onClick={() => onView?.(row.original.id)}
                    aria-label="عرض المسير"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                >
                    <Eye className="h-4 w-4" />
                </button>
            ),
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <button
                    type="button"
                    onClick={() => onOpenActions?.(row.original.id)}
                    aria-label="خيارات إضافية"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                >
                    <MoreVertical className="h-4 w-4" />
                </button>
            ),
        },
    ];
}