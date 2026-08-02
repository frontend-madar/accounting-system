"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { InvoicesList } from "@/components/dashboard/invoice/InvoicesList";
import { InvoicesToolbar } from "@/components/dashboard/invoice/InvoicesToolbar";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTablePagination } from "@/components/dashboard/Pagination";
import { ConfirmDeleteDialog } from "@/components/dashboard/shared/ConfirmDeleteDialog";
import {
  useInvoices,
  useDeleteInvoice,
  useDownloadInvoicePdf,
} from "@/hooks/use-invoice";
import { useDebounce } from "@/hooks/use-debounce";
import type { InvoiceItem } from "@/types/invoice.types";

const PAGE_SIZE = 10;

export default function InvoicesPage() {
    const router = useRouter();

    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("الكل");
    const [deletingInvoice, setDeletingInvoice] = useState<InvoiceItem | null>(null);

    const debouncedQuery = useDebounce(query, 400);
    const statusParam = statusFilter === "الكل" ? undefined : statusFilter;

    const { data: apiResponse, isLoading } = useInvoices({
        page,
        limit: PAGE_SIZE,
        search: debouncedQuery.trim() || undefined,
        status: statusParam,
    });

    const invoices = apiResponse?.data?.data ?? [];
    const totalCount = apiResponse?.data?.total ?? 0;

    const { mutate: deleteInvoice, isPending: isDeleting } = useDeleteInvoice();
    const { mutate: downloadPdf } = useDownloadInvoicePdf();

    const handleFilterChange = (value: string) => {
        setStatusFilter(value);
        setPage(1);
    };

    return (
        <div className="space-y-4 px-4">
            <Topbar title=" الفواتير" search={false} />
            <div className="bg-white p-4 space-y-4 ctm-shadow rounded-3xl">
                <InvoicesToolbar
                    query={query}
                    setQuery={setQuery}
                    setPage={setPage}
                    statusFilter={statusFilter}
                    onFilterChange={handleFilterChange}
                    onCreateInvoice={() => router.push("/dashboard/invoices/create")}
                    onOpenDrafts={() => console.log("open drafts")}
                />

                <InvoicesList
                    invoices={invoices}
                    isLoading={isLoading}
                    onSelectInvoice={(invoice) =>
                        router.push(`/dashboard/invoices/${invoice.id}`)
                    }
                    getActions={(invoice) => [
                        {
                            label: "عرض التفاصيل",
                            onSelect: () =>
                                router.push(`/dashboard/invoices/${invoice.id}/edit`),
                        },
                        {
                            label: "تعديل",
                            onSelect: () =>
                                router.push(`/dashboard/invoices/${invoice.id}`),
                        },
                        {
                            label: "طباعة",
                            onSelect: () =>
                                downloadPdf({
                                    invoiceId: invoice.id,
                                    invoiceNumber: invoice.invoiceNumber,
                                }),
                        },
                        {
                            label: "حذف",
                            destructive: true,
                            onSelect: () => setDeletingInvoice(invoice),
                        },
                    ]}
                />

                <DataTablePagination
                    className="mt-2"
                    page={page}
                    pageSize={PAGE_SIZE}
                    totalRecords={totalCount}
                    onPageChange={setPage}
                />
            </div>

            <ConfirmDeleteDialog
                open={!!deletingInvoice}
                onOpenChange={(open) => !open && setDeletingInvoice(null)}
                isLoading={isDeleting}
                title="حذف الفاتورة"
                description="هل أنت متأكد من حذف هذه الفاتورة؟ لا يمكن التراجع عن هذا الإجراء."
                onConfirm={() => {
                    if (deletingInvoice) {
                        deleteInvoice(deletingInvoice.id, {
                            onSuccess: () => setDeletingInvoice(null),
                        });
                    }
                }}
            />
        </div>
    );
}