import * as React from "react";
import { UserRound } from "lucide-react";


import { cn } from "@/lib/utils";
import { InvoiceListItem } from "@/data/data";
import { RowAction, RowActionsMenu } from "./RowActionsMenu";
import { InitialsAvatar } from "./InitialsAvatar";
import { InfoColumn } from "./InfoColumn";

interface InvoiceCardProps {
    invoice: InvoiceListItem;
    actions?: RowAction[];
    onClick?: () => void;
    className?: string;
}

export function InvoiceCard({ invoice, actions = [], onClick, className }: InvoiceCardProps) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-border bg-white overflow-hidden",
                className
            )}
        >
            {/* header */}
            <div className="flex items-center justify-between bg-[#EFEDF8] px-4 py-2.5">
                <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-muted-foreground ring-1 ring-border">
                        {invoice.employeeAvatarSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={invoice.employeeAvatarSrc}
                                alt={invoice.employeeName}
                                className="h-full w-full rounded-full object-cover"
                            />
                        ) : (
                            <UserRound className="h-4 w-4" />
                        )}
                    </span>
                    <p className="text-[16px]  ">
                        <span className="text-[#676A6E]">الموظف: </span>
                        <span className="font-medium text-[#101011]">{invoice.employeeName}</span>
                    </p>
                </div>

                <p className="text-[16px] text-[#585B5F]">
                    رقم الفاتورة: {invoice.invoiceNumber}
                </p>
            </div>

            {/* body */}
            <div
                role={onClick ? "button" : undefined}
                tabIndex={onClick ? 0 : undefined}
                onClick={onClick}
                onKeyDown={(event) => {
                    if (onClick && (event.key === "Enter" || event.key === " ")) {
                        event.preventDefault();
                        onClick();
                    }
                }}
                className={cn(
                    "flex w-full flex-wrap items-center justify-between gap-4 px-4 py-3 text-right transition-colors",
                    onClick && "cursor-pointer hover:bg-muted/30"
                )}
            >
                <div className="flex items-center gap-3">
                    <InitialsAvatar name={invoice.clientName} />
                    <div>
                        <p className="text-[20px] font-semibold text-[#101011]">
                            {invoice.clientName}
                        </p>
                        <p className="text-[16px] text-[#1B1B1BCC]">#{invoice.clientId}</p>
                    </div>
                </div>

                <InfoColumn label="انشأت" value={invoice.createdDate} />
                <InfoColumn label="باقي" value={invoice.remaining} />
                <InfoColumn label="الحالة" value={invoice.status} />

                <div onClick={(event) => event.stopPropagation()}>
                    <RowActionsMenu actions={actions} className="shrink-0" />
                </div>
            </div>
        </div>
    );
}