"use client";

import * as React from "react";
import { MoreVertical, Paperclip } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { ExpenseStatusBadge } from "./ExpenseStatusBadge";
import { ExpenseRecord } from "@/types/expense.types";

interface GetExpenseColumnsOptions {
    onDelete?: (row: ExpenseRecord) => void;
    onEdit?: (row: ExpenseRecord) => void;
}

export function getExpenseColumns({
    onDelete,
    onEdit,
}: GetExpenseColumnsOptions = {}): ColumnDef<ExpenseRecord>[] {
    return [
        {
            accessorKey: "code",
            header: "رقم المصروف",
            cell: ({ row }) => (
                <span className="flex items-center gap-2">
                    <Checkbox />
                    {row.original.code}
                </span>
            ),
        },
        {
            accessorKey: "expenseDate",
            header: "التاريخ",
            cell: ({ row }) => (
                <span>{new Date(row.original.expenseDate).toLocaleDateString("ar-EG")}</span>
            ),
        },
        {
            accessorKey: "category",
            header: "فئة المصروف",
            cell: ({ row }) => <span>{row.original.category}</span>,
        },
        {
            id: "paymentMethod",
            header: "طريقة الدفع",
            cell: ({ row }) => <span>{row.original.paymentMethod?.name ?? "-"}</span>,
        },
        {
            accessorKey: "amount",
            header: "المبلغ",
            cell: ({ row }) => (
                <span className="font-medium text-[#101011] text-[22px]">
                    <span className="text-[#1E2128] text-[16px] ml-1">{row.original.currency}</span>
                    <span className="pl-1">{row.original.amount.toLocaleString()}</span>
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "الحالة",
            cell: ({ row }) => <ExpenseStatusBadge status={row.original.status} />,
        },
        {
            accessorKey: "documentUrl",
            header: "المرفقات",
            cell: ({ row }) =>
                row.original.documentUrl ? (
                    <a
                        href={row.original.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#101011]"
                    >
                        <Paperclip className="h-4 w-4" />
                        <span className="text-[14px]">عرض المرفق</span>
                    </a>
                ) : (
                    <span className="text-[14px] text-muted-foreground">لا يوجد</span>
                ),
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <ExpenseRowActions row={row.original} onDelete={onDelete} onEdit={onEdit} />
            ),
        },
    ];
}

function ExpenseRowActions({
    row,
    onDelete,
    onEdit,
}: {
    row: ExpenseRecord;
    onDelete?: (row: ExpenseRecord) => void;
    onEdit?: (row: ExpenseRecord) => void;
}) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!open) return;
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <button type="button" onClick={() => setOpen((v) => !v)} className="text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
            </button>

            {open && (
                <div className="absolute left-0 z-20 mt-2 w-32 rounded-lg border border-[#E4E2E9] bg-white p-1 shadow-md">
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onEdit?.(row);
                        }}
                        className="w-full rounded-md px-3 py-1.5 text-right text-sm hover:bg-slate-50"
                    >
                        تعديل
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onDelete?.(row);
                        }}
                        className="w-full rounded-md px-3 py-1.5 text-right text-sm text-red-600 hover:bg-red-50"
                    >
                        حذف
                    </button>
                </div>
            )}
        </div>
    );
}