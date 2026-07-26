"use client";

import * as React from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import type { SupplierData, SupplierCurrency } from "@/types/supplier.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SERVICE_TYPE_STYLES: Record<string, string> = {
    "انتقالات": "bg-[#E8EEFD] text-[#3D6BEA]",
    "استقبال كوش": "bg-[#F1EAFB] text-[#8A4FD6]",
    "جولات": "bg-[#FBF3D9] text-[#C79A1E]",
    "استقبال": "bg-[#FCEADF] text-[#E07A34]",
    "فنادق": "bg-[#EFE7FB] text-[#7A4FCF]",
};

function formatDate(iso: string): string {
    return iso ? new Date(iso).toLocaleDateString("ar-EG") : "-";
}

function CurrencyCell({ amount, currency }: { amount: number; currency: SupplierCurrency }) {
    return (
        <span className="font-medium text-[#101011] text-[18px]">
            <span className="text-[#1E2128] text-[13px] ml-1">{currency}</span>
            {amount.toLocaleString()}
        </span>
    );
}

function ServiceTypeBadges({ types }: { types: string[] }) {
    return (
        <div className="flex flex-wrap items-center gap-1">
            {types.map((type) => (
                <span
                    key={type}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-medium ${
                        SERVICE_TYPE_STYLES[type] ?? "bg-[#F1F1F3] text-[#5C5F63]"
                    }`}
                >
                    {type}
                </span>
            ))}
        </div>
    );
}

interface GetVendorColumnsProps {
  onEdit?: (supplier: SupplierData) => void;
  onDelete?: (supplier: SupplierData) => void;
}

export function getVendorColumns({
  onEdit,
  onDelete,
}: GetVendorColumnsProps = {}): ColumnDef<SupplierData>[] {
    return [
        {
            accessorKey: "supplierName",
            header: "اسم المورد",
            cell: ({ row }) => (
                <span className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEEBFB] text-[#101011] text-xs font-medium">
                        {row.original.supplierName?.charAt(0).toUpperCase()}
                    </span>
                    {row.original.supplierName}
                </span>
            ),
        },
        {
            accessorKey: "clientName",
            header: "اسم العميل",
        },
        {
            accessorKey: "supplierPhone",
            header: "رقم المورد",
        },
        {
            accessorKey: "travelDate",
            header: "تاريخ السفر",
            cell: ({ row }) => formatDate(row.original.travelDate),
        },
        {
            accessorKey: "returnDate",
            header: "تاريخ العودة",
            cell: ({ row }) => formatDate(row.original.returnDate),
        },
        {
            accessorKey: "serviceTypes",
            header: "نوع الخدمة",
            cell: ({ row }) => <ServiceTypeBadges types={row.original.serviceTypes} />,
        },
        {
            accessorKey: "servicePrice",
            header: "سعر الخدمة",
            cell: ({ row }) => (
                <CurrencyCell amount={row.original.servicePrice} currency={row.original.currency} />
            ),
        },
        {
            accessorKey: "amountPaid",
            header: "المدفوع",
            cell: ({ row }) => (
                <CurrencyCell amount={row.original.amountPaid} currency={row.original.currency} />
            ),
        },
        {
            accessorKey: "remainingAmount",
            header: "المتبقي",
            cell: ({ row }) => (
                <CurrencyCell amount={row.original.remainingAmount} currency={row.original.currency} />
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