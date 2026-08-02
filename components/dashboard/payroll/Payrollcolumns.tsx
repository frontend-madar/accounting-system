"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { PayrollStatusBadge } from "./Payrollstatusbadge";
import { PayrollRunListItem } from "@/types/payroll.types";
import { TableRowActions } from "../shared/TableRowActions";

// Re-export for backwards compat
export type { PayrollRunListItem as Payroll };

function currency(value: number) {
    return `EGP ${value.toLocaleString("en-US")}`;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function monthName(month: number) {
    return new Date(2000, month - 1, 1).toLocaleDateString("ar-EG", { month: "long" });
}

interface GetPayrollColumnsOptions {
    onView?: (payrollId: string) => void;
    onEdit?: (payroll: PayrollRunListItem) => void;
    onDelete?: (payroll: PayrollRunListItem) => void;
}


export function getPayrollColumns({
    onView,
    onEdit,
    onDelete,
}: GetPayrollColumnsOptions = {}): ColumnDef<PayrollRunListItem>[] {
    return [
        {
            accessorKey: "runNumber",
            header: "رقم المسير",
        },
        {
            id: "month",
            header: "الشهر",
            cell: ({ row }) => monthName(row.original.month),
        },
        {
            id: "period",
            header: "فترة الرواتب",
            cell: ({ row }) => {
                const start = formatDate(row.original.startDate);
                const end = formatDate(row.original.endDate);
                return `${start} – ${end}`;
            },
        },
        {
            accessorKey: "employeeCount",
            header: "عدد الموظفين",
        },
        {
            accessorKey: "totalNetSalary",
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
            cell: ({ getValue }) => formatDate(getValue<string>()),
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
                <TableRowActions
                    row={row.original}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ),
        },
    ];
}