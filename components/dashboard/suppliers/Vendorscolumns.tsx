"use client";

import * as React from "react";
import { User } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { ServiceType, Vendor } from "@/types/types";

const SERVICE_TYPE_STYLES: Record<ServiceType, string> = {
    "انتقالات": "bg-[#E8EEFD] text-[#3D6BEA]",
    "استقبال كوش": "bg-[#F1EAFB] text-[#8A4FD6]",
    "جولات": "bg-[#FBF3D9] text-[#C79A1E]",
    "استقبال": "bg-[#FCEADF] text-[#E07A34]",
    "فنادق": "bg-[#EFE7FB] text-[#7A4FCF]",
};

function CurrencyCell({ amount }: { amount: number }) {
    return (
        <span className="font-medium text-[#101011] text-[18px]">
            <span className="text-[#1E2128] text-[13px] ml-1">EGP</span>
            {amount.toLocaleString()}
        </span>
    );
}

function ServiceTypeBadge({ type }: { type: ServiceType }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-medium ${SERVICE_TYPE_STYLES[type]}`}
        >
            {type}
        </span>
    );
}

export function getVendorColumns(): ColumnDef<Vendor>[] {
    return [
        {
            accessorKey: "vendorName",
            header: "اسم المورد",
            cell: ({ row }) => (
                <span className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEEBFB] text-[#101011] text-xs font-medium">
                        {row.original.vendorName?.charAt(0).toUpperCase()}
                    </span>

                    {row.original.vendorName}
                </span>
            ),
        },
        {
            accessorKey: "clientName",
            header: "اسم العميل",
        },
        {
            accessorKey: "clientNumber",
            header: "رقم العميل",
        },
        {
            accessorKey: "returnDate",
            header: "تاريخ العودة",
        },
        {
            accessorKey: "travelDate",
            header: "تاريخ السفر",
        },
        {
            accessorKey: "serviceType",
            header: "نوع الخدمة",
            cell: ({ row }) => <ServiceTypeBadge type={row.original.serviceType} />,
        },
        {
            accessorKey: "servicePrice",
            header: "سعر الخدمة",
            cell: ({ row }) => <CurrencyCell amount={row.original.servicePrice} />,
        },
        {
            accessorKey: "paidAmount",
            header: "المدفوع",
            cell: ({ row }) => <CurrencyCell amount={row.original.paidAmount} />,
        },
        {
            accessorKey: "remainingAmount",
            header: "المتبقي",
            cell: ({ row }) => <CurrencyCell amount={row.original.remainingAmount} />,
        },
    ];
}