import * as React from "react";
import { UserRound } from "lucide-react";

import { cn } from "@/lib/utils";
import type { InvoiceItem } from "@/types/invoice.types";
import { RowAction, RowActionsMenu } from "./RowActionsMenu";
import { InitialsAvatar } from "./InitialsAvatar";
import { InfoColumn } from "./InfoColumn";

interface InvoiceCardProps {
    invoice: InvoiceItem;
    actions?: RowAction[];
    onClick?: () => void;
    className?: string;
}

function formatDate(dateStr?: string): string {
    if (!dateStr) return "-";
    return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
}

export function InvoiceCard({
    invoice,
    actions = [],
    onClick,
    className,
}: InvoiceCardProps) {
    return (
        <div
            className={cn(
                " rounded-2xl border border-[#E8E5F6] bg-white shadow-sm transition-colors",
                "hover:border-[#D7D2F5]",
                className
            )}
        >
            {/* Header */}
            <div
                className=" flex flex-col gap-3 border-b border-[#ECEAF8] bg-[#F7F6FD] px-5 py-4 rounded-t-2xl sm:flex-row sm:items-center sm:justify-between "
            >
                <div className="flex items-center gap-3">
                    <span
                        className=" flex h-10 w-10 items-center justify-center rounded-full border border-[#DDD8F5] bg-white text-[#40369F]"
                    >
                        <UserRound className="h-5 w-5" />
                    </span>

                    <div>
                        <p className="text-[13px] text-[#7B7E83]">
                            الموظف
                        </p>

                        <p className="text-[17px] font-semibold text-[#101011]">
                            {invoice.employeeName}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-[13px] text-[#7B7E83]">
                        رقم الفاتورة
                    </p>

                    <p className="text-[17px] font-semibold text-[#40369F]">
                        #{invoice.invoiceNumber}
                    </p>
                </div>
            </div>

            {/* Body */}
            <div
                role={onClick ? "button" : undefined}
                tabIndex={onClick ? 0 : undefined}
                onClick={onClick}
                onKeyDown={(event) => {
                    if (
                        onClick &&
                        (event.key === "Enter" || event.key === " ")
                    ) {
                        event.preventDefault();
                        onClick();
                    }
                }}
                className={cn(
                    `
                    px-5
                    py-5

                    transition-colors

                    `,
                    onClick &&
                        "cursor-pointer hover:bg-[#FCFCFE]"
                )}
            >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    {/* Client */}
                    <div className="flex items-center gap-4">
                        <InitialsAvatar name={invoice.clientName} />

                        <div>
                            <p className="text-[20px] font-bold text-[#101011]">
                                {invoice.clientName}
                            </p>

                            {/* <p className="mt-1 text-[14px] text-[#7B7E83]">
                                العميل #{invoice.clientId}
                            </p> */}
                        </div>
                    </div>

                    {/* Information */}
                    <div className="grid flex-1 grid-cols-2 gap-6 lg:grid-cols-3 lg:px-8">
                        <InfoColumn
                            label="تاريخ الإنشاء"
                            value={formatDate(invoice.createdAt)}
                        />

                        <InfoColumn
                            label="المبلغ المتبقي"
                            value={invoice.remainingAmount.toLocaleString()}
                        />

                        <InfoColumn
                            label="الحالة"
                            value={invoice.status}
                        />
                    </div>

                    {/* Actions */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex justify-end"
                    >
                        <div
                            className="
                                rounded-xl
                                border
                                border-[#ECEAF8]
                                bg-[#FAFAFD]
                                p-1
                            "
                        >
                            <RowActionsMenu
                                actions={actions}
                                className="shrink-0"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}