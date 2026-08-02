"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Plus, Download, Loader2 } from "lucide-react";

import { DataTable } from "../DataTable";
import { DataTablePagination } from "../Pagination";
import { getVendorColumns } from "./Vendorscolumns";
import { UpdateSupplierForm } from "./UpdateSupplierForm";
import MainButton from "../shared/MainButton";
import SecondaryButton from "../shared/SecondaryButton";
import SearchInput from "../SearchInput";
import { useSuppliers, useDeleteSupplier, useExportSuppliersPdf } from "@/hooks/use-supplier";
import { useDebounce } from "@/hooks/use-debounce";
import type { SupplierData } from "@/types/supplier.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PAGE_SIZE = 9;

interface VendorsTableSectionProps {
  title?: string;
  subtitle?: string;
  listTitle?: string;
  addButtonLabel?: string;
  exportButtonLabel?: string;
  searchPlaceholder?: string;
  className?: string;
}

export function VendorsTableSection({
  title = "الموردون",
  subtitle = "إدارة بيانات الموردين ومتابعة الخدمات والمدفوعات الخاصة بهم.",
  listTitle = "قائمة الموردين",
  addButtonLabel = "إضافة مورد",
  exportButtonLabel = "تصدير",
  searchPlaceholder = "ابحث عن مورد...",
  className,
}: VendorsTableSectionProps) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  const [supplierIdToEdit, setSupplierIdToEdit] = useState<string | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<SupplierData | null>(null);

  const { data: suppliersRes, isLoading } = useSuppliers({
    page,
    limit: PAGE_SIZE,
    search: debouncedQuery || undefined,
  });
  const { mutate: deleteSupplier, isPending: isDeleting } = useDeleteSupplier();
  const { mutate: exportPdf, isPending: isExporting } = useExportSuppliersPdf();

  const rows = suppliersRes?.data.data ?? [];
  const totalRecords = suppliersRes?.data.total ?? 0;

  function handleSearchChange(value: string) {
    setQuery(value);
    setPage(1);
  }

  function handleExport() {
    // Export honors the current search filter, matching what the user is looking at.
    exportPdf({ search: debouncedQuery || undefined });
  }

  function confirmDelete() {
    if (!supplierToDelete) return;
    deleteSupplier(supplierToDelete.id, {
      onSuccess: () => setSupplierToDelete(null),
    });
  }

  const columns = useMemo(
    () =>
      getVendorColumns({
        onEdit: (supplier) => setSupplierIdToEdit(supplier.id),
        onDelete: (supplier) => setSupplierToDelete(supplier),
      }),
    []
  );

  return (
    <div className={className}>
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-bold text-[#0F1219]">{listTitle}</h2>
          <p className="mt-1 font-medium text-[16px] text-[#0F1219]">{subtitle}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto gap-2">
          <SecondaryButton
            text={exportButtonLabel}
            icon={
              isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )
            }
            className="sm:!w-[111px] w-full"
            onClick={handleExport}
            disabled={isExporting}
          />
          <MainButton
            text={addButtonLabel}
            icon={<Plus className="h-4 w-4" />}
            className="sm:!w-[155px] w-full"
            href="suppliers/create"
          />
        </div>
      </div>

      <section className="mt-4 rounded-2xl bg-white ctm-shadow p-5">
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex-row flex sm:flex-col">
            <h2 className="sm:text-[24px] text-[18px] font-semibold text-[#0F1219]">
              {listTitle}
            </h2>
            <span className="rounded-full bg-[#E6F6F4] px-3 py-1 text-[13px] font-medium text-[#1BA915]">
              {totalRecords} مورد
            </span>
          </div>
          <div>
            <SearchInput
              query={query}
              setQuery={handleSearchChange}
              placeholder={searchPlaceholder}
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <DataTable columns={columns} data={rows} isLoading={isLoading} />
        </div>

        <DataTablePagination
          className="mt-4"
          page={page}
          pageSize={PAGE_SIZE}
          totalRecords={totalRecords}
          onPageChange={setPage}
        />
      </section>

      <AlertDialog
        open={!!supplierToDelete}
        onOpenChange={(open) => !open && setSupplierToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف المورد {supplierToDelete?.supplierName}؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UpdateSupplierForm
        supplierId={supplierIdToEdit}
        open={!!supplierIdToEdit}
        onOpenChange={(open) => !open && setSupplierIdToEdit(null)}
      />
    </div>
  );
}