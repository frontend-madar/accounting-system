"use client";

import * as React from "react";
import { CheckCheck, MoreVertical, Paperclip } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { ExpenseStatusBadge } from "./ExpenseStatusBadge";
import { ExpenseRecord } from "@/types/types";

export function getExpenseColumns(): ColumnDef<ExpenseRecord>[] {
    return [
        {
            accessorKey: "expenseNumber",
            header: "رقم المصروف",
            cell: ({ row }) => (
                <span className="flex items-center gap-2">
                    <Checkbox />
                    {row.original.expenseNumber}
                </span>
            )
        },
        {
            accessorKey: "date",
            header: "التاريخ",
        },
        {
            accessorKey: "category",
            header: "فئة المصروف",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: row.original.categoryColor }}
                    />
                    <span>{row.original.category}</span>
                </div>
            ),
        },
        {
            accessorKey: "vendor",
            header: "المورد",
        },
        {
            accessorKey: "paymentMethod",
            header: "طريقة الدفع",
        },
        {
            accessorKey: "amount",
            header: "المبلغ",
            cell: ({ row }) => (
                <span className="font-medium text-[#101011] text-[22px]">
                    <span className="text-[#1E2128] text-[16px] ml-1">EGP</span>
                    <span className="pl-1" >{row.original.amount.toLocaleString()}</span>
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "الحالة",
            cell: ({ row }) => <ExpenseStatusBadge status={row.original.status} />,
        },
        {
            accessorKey: "attachmentsCount",
            header: "المرفقات",
            cell: ({ row }) => (
                <div className="flex items-center  gap-1 text-[#101011">

                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.51966 7.38392C5.76374 7.13984 6.15937 7.13984 6.40345 7.38392C6.64737 7.62801 6.64747 8.02368 6.40345 8.2677L4.22864 10.4425C2.75732 11.9142 2.7571 14.3001 4.22864 15.7716C5.70018 17.2432 8.08607 17.2429 9.55774 15.7716L11.7325 13.5968C11.9766 13.3528 12.3722 13.3529 12.6163 13.5968C12.8604 13.8409 12.8604 14.2365 12.6163 14.4806L10.4425 16.6554C8.4827 18.6152 5.30466 18.6152 3.34485 16.6554C1.38505 14.6956 1.38505 11.5175 3.34485 9.55774L5.51966 7.38392ZM9.55774 3.34485C11.5175 1.38505 14.6956 1.38505 16.6554 3.34485C18.6152 5.30466 18.6152 8.4827 16.6554 10.4425L14.4806 12.6163C14.2365 12.8604 13.8409 12.8604 13.5968 12.6163C13.3529 12.3722 13.3528 11.9766 13.5968 11.7325L15.7716 9.55774C17.2429 8.08607 17.2431 5.70018 15.7716 4.22864C14.3001 2.75711 11.9142 2.75733 10.4425 4.22864L8.2677 6.40345C8.02368 6.64747 7.62801 6.64737 7.38392 6.40345C7.13984 6.15937 7.13984 5.76374 7.38392 5.51966L9.55774 3.34485ZM11.6417 7.47474C11.8858 7.23083 12.2815 7.23072 12.5255 7.47474C12.7695 7.71876 12.7694 8.11443 12.5255 8.35853L8.35853 12.5255C8.11443 12.7694 7.71876 12.7695 7.47474 12.5255C7.23071 12.2815 7.23082 11.8858 7.47474 11.6417L11.6417 7.47474Z" fill="#161616" />
                    </svg>

                    <span className="text-[20px]" >{row.original.attachmentsCount}</span>
                </div>
            ),
        },
        // {
        //   id: "select",
        //   header: ({ table }) => (
        //     <Checkbox
        //       checked={table.getIsAllPageRowsSelected()}
        //       onCheckedChange={(value) =>
        //         table.toggleAllPageRowsSelected(!!value)
        //       }
        //     />
        //   ),
        //   cell: ({ row }) => (
        //     <Checkbox
        //       checked={row.getIsSelected()}
        //       onCheckedChange={(value) => row.toggleSelected(!!value)}
        //     />
        //   ),
        // },
        {
            id: "actions",
            header: "",
            cell: () => (
                <button type="button" className="text-muted-foreground">
                    <MoreVertical className="h-4 w-4" />
                </button>
            ),
        },
    ];
}