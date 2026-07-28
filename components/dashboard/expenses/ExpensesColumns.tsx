"use client";

import * as React from "react";
import { MoreVertical, Paperclip, Pencil, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ExpenseStatusBadge } from "./ExpenseStatusBadge";
import { ExpenseRecord } from "@/types/expense.types";
import Link from "next/link";

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
                  <Link  
                        href={row.original.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#101011]"
                    >
                        <Paperclip className="h-4 w-4" />
                        <span className="text-[14px]">عرض المرفق</span>
                    </Link>
                ) : (
                    <span className="text-[14px] text-muted-foreground">لا يوجد</span>
                ),
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger className="text-muted-foreground">
                        <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
                            <Pencil className="h-4 w-4" />
                            تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete?.(row.original)}
                            className="text-red-600 focus:text-red-600"
                        >
                            <Trash2 className="h-4 w-4" />
                            حذف
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];
}