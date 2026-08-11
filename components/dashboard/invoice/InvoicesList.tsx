
import { cn } from "@/lib/utils";
import type { InvoiceItem } from "@/types/invoice.types";
import { RowAction } from "./RowActionsMenu";
import { InvoiceCard } from "./InvoiceCard";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "../shared/EmptyState";

interface InvoicesListProps {
    invoices: InvoiceItem[];
    getActions?: (invoice: InvoiceItem) => RowAction[];
    onSelectInvoice?: (invoice: InvoiceItem) => void;
    className?: string;
    isLoading?: boolean;
    addButtonLabel?: string;
}

function InvoiceCardSkeleton() {
    return (
        <div className="rounded-2xl border border-[#E8E5F6] bg-white shadow-sm">
            {/* Header */}
            <div className="flex flex-col gap-3 border-b border-[#ECEAF8] bg-[#F7F6FD] px-5 py-4 rounded-t-2xl sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                </div>
                <div className="space-y-2 sm:text-right">
                    <Skeleton className="h-3 w-16 sm:mr-auto" />
                    <Skeleton className="h-4 w-20 sm:mr-auto" />
                </div>
            </div>

            {/* Body */}
            <div className="px-5 py-5">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-11 w-11 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>

                    <div className="grid flex-1 grid-cols-2 gap-6 lg:grid-cols-3 lg:px-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end">
                        <Skeleton className="h-8 w-8 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function InvoicesList({
    invoices,
    getActions,
    onSelectInvoice,
    className,
    isLoading,
    addButtonLabel = "إنشاء فاتورة",
}: InvoicesListProps) {
    if (isLoading) {
        return (
            <div className={cn("space-y-3", className)}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <InvoiceCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (invoices.length === 0) {
        return (
            <EmptyState
                title="لا يوجد فواتير حتى الآن"
                description="إنشاء فاتورة جديدة لتسجيل معاملة العميل ومتابعة مستحقاته."
                buttonText={addButtonLabel}
                href="/dashboard/invoices/create"
            />
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