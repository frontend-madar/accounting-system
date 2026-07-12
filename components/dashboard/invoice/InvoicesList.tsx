import * as React from "react";


import { cn } from "@/lib/utils";
import { InvoiceListItem } from "@/data/data";
import { RowAction } from "./RowActionsMenu";
import { InvoiceCard } from "./InvoiceCard";

interface InvoicesListProps {
    invoices: InvoiceListItem[];
    getActions?: (invoice: InvoiceListItem) => RowAction[];
    onSelectInvoice?: (invoice: InvoiceListItem) => void;
    emptyState?: React.ReactNode;
    className?: string;
}

export function InvoicesList({
    invoices,
    getActions,
    onSelectInvoice,
    emptyState,
    className,
}: InvoicesListProps) {
    if (invoices.length === 0) {
        return (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-border text-muted-foreground">
                {emptyState ?? "لا توجد فواتير لعرضها"}
            </div>
        );
    }

    return (
        <div className={cn("space-y-3", className)}>
            {invoices.map((invoice) => (
                <InvoiceCard
                    key={invoice.id}
                    invoice={invoice}
                    actions={getActions?.(invoice)}
                    onClick={() => onSelectInvoice?.(invoice)}
                />
            ))}
        </div>
    );
}