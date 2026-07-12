"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import { InvoiceStatus, StatusBadge } from "./StatusBadge";

 
export interface Invoice {
    id: string;
    employee: string;
    client: string;
    amount: number;
    travelDate: string;
    paid: number;
    paymentMethod: string;
    paymentDate: string;
    remaining: number;
    status: InvoiceStatus;
}

function currency(value: number) {
    return value.toLocaleString("ar-SA");
}

interface GetColumnsOptions {
    onStatusChange?: (invoiceId: string, status: InvoiceStatus) => void;
    onOpenActions?: (invoiceId: string) => void;
}

/**
 * Returns the column definitions for the invoices table.
 * Kept as a function (rather than a static array) so callbacks like
 * `onStatusChange` can close over component state/handlers.
 */
export function getInvoiceColumns({
    onStatusChange,
    onOpenActions,
}: GetColumnsOptions = {}): ColumnDef<Invoice>[] {
    return [
        {
            id: "select_and_index",
            header: () => null,
            cell: ({ row }) => (
                <div className="flex items-center gap-4">
                    <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border accent-[#40369F]"
                        aria-label="تحديد الصف"
                    />
                    <span className="text-muted-foreground">
                        {String(row.index + 1).padStart(2, "0")}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "employee",
            header: "الموظف",
        },
        {
            accessorKey: "client",
            header: "العميل",
        },
        {
            accessorKey: "amount",
            header: "المبلغ",
            cell: ({ getValue }) => currency(getValue<number>()),
        },
        {
            accessorKey: "travelDate",
            header: "تاريخ السفر",
        },
        {
            accessorKey: "paid",
            header: "المدفوع",
            cell: ({ getValue }) => currency(getValue<number>()),
        },
        {
            accessorKey: "paymentMethod",
            header: "طريقة الدفع",
        },
        {
            accessorKey: "paymentDate",
            header: "تاريخ الدفع",
        },
        {
            accessorKey: "remaining",
            header: "المتبقي",
            cell: ({ getValue }) => currency(getValue<number>()),
        },
        {
            accessorKey: "status",
            header: "الحالة",
            cell: ({ row }) => (
                <StatusBadge
                    value={row.original.status}
                    onChange={
                        onStatusChange
                            ? (status) => onStatusChange(row.original.id, status)
                            : undefined
                    }
                />
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