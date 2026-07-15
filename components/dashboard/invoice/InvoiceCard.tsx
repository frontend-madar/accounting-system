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
                "rounded-2xl border border-border bg-white",
                className
            )}
        >
            {/* header */}
            <div className="flex flex-col gap-2 rounded-t-2xl bg-[#EFEDF8] px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
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
                    "flex w-full flex-col gap-4 px-4 py-3 text-right transition-colors sm:flex-row sm:flex-wrap sm:items-center sm:justify-between",
                    onClick && "cursor-pointer hover:bg-muted/30"
                )}
            >
                <div className="flex items-center gap-3">
                    <InitialsAvatar name={invoice.clientName} />
                    <div>
                        <p className="md:text-[20px] font-semibold text-[#101011]">
                            {invoice.clientName}
                        </p>
                        <p className="text-[16px] text-[#1B1B1BCC]">#{invoice.clientId}</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:contents">
                    <InfoColumn label="انشأت" value={invoice.createdDate} />
                    <InfoColumn label="باقي" value={invoice.remaining} />
                    <InfoColumn label="الحالة" value={invoice.status} />
                </div>

                <div
                    onClick={(event) => event.stopPropagation()}
                    className="flex justify-end sm:block"
                >
                    <RowActionsMenu actions={actions} className="shrink-0" />
                </div>
            </div>
        </div>
    );
}