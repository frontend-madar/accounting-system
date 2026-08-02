"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { CreditAccount, getCreditAccountColumns } from "./CreditAccountsColumns";
import { DataTable } from "../DataTable";
import { DataTablePagination } from "../Pagination";
import MainButton from "../shared/MainButton";
import FillterButton from "../FillterButton";
import SearchInput from "../SearchInput";
import EmptyState from "../shared/EmptyState";
import { UpdateCreditAccountForm } from "./UpdateCreditAccountForm";
import {
  useDeferredAccounts,
  useDeleteDeferredAccount,
} from "@/hooks/use-deferred-account";
import { useDebounce } from "@/hooks/use-debounce";
import type { DeferredAccountItem } from "@/types/deferred-account.types";
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
import { ConfirmDeleteDialog } from "../shared/ConfirmDeleteDialog";

const PAGE_SIZE = 10;
const STATUS_OPTIONS = ["الكل", "مكتملة", "كنسل", "باقي الدفع"];

interface CreditAccountsTableSectionProps {
  addButtonLabel?: string;
  onAddClick?: () => void;
  className?: string;
}

export function CreditAccountsTableSection({
  addButtonLabel = "إضافة عميل",
  onAddClick,
  className,
}: CreditAccountsTableSectionProps) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");

  const debouncedQuery = useDebounce(query, 400);

  const statusParam = statusFilter === "الكل" ? undefined : statusFilter;

  const { data: apiResponse, isLoading } = useDeferredAccounts({
    page,
    limit: PAGE_SIZE,
    search: debouncedQuery.trim() || undefined,
    status: statusParam,
  });

  const tableData = apiResponse?.data?.data ?? [];
  const totalCount = apiResponse?.data?.total ?? 0;

  const hasActiveFilters = !!query.trim() || statusFilter !== "الكل";
  const showEmptyState = !isLoading && totalCount === 0 && !hasActiveFilters;

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  const [editingAccount, setEditingAccount] = useState<DeferredAccountItem | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<DeferredAccountItem | null>(null);

  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteDeferredAccount();

  const columns = useMemo(
    () =>
      getCreditAccountColumns({
        onEdit: (account) => setEditingAccount(account as unknown as DeferredAccountItem),
        onDelete: (account) => setDeletingAccount(account as unknown as DeferredAccountItem),
      }),
    []
  );

  return (
    <section className={className}>
      {showEmptyState ? (
        <EmptyState
          title="لا يوجد حسابات آجلة حتى الآن"
          description="إضافة بيانات عميل جديد لتسجيل معاملاته المالية ومتابعة أرصدته المستحقة."
          buttonText={addButtonLabel}
          href="/dashboard/credit-accounts/create"
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <SearchInput query={query} setQuery={setQuery} setPage={setPage} />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <FillterButton
                options={STATUS_OPTIONS}
                selectedFilter={statusFilter}
                onFilterChange={handleStatusFilterChange}
              />
              <MainButton
                text={addButtonLabel}
                href="/dashboard/credit-accounts/create"
                icon={<Plus className="h-4 w-4" />}
              />
            </div>
          </div>

          <div className="mt-4 overflow-hidden">
            <DataTable columns={columns} data={tableData} isLoading={isLoading} />
          </div>

          <DataTablePagination
            className="mt-4"
            page={page}
            pageSize={PAGE_SIZE}
            totalRecords={totalCount}
            onPageChange={setPage}
          />
        </>
      )}

      <UpdateCreditAccountForm
        account={editingAccount}
        open={!!editingAccount}
        onOpenChange={(open) => !open && setEditingAccount(null)}
      />

      <ConfirmDeleteDialog
        open={!!deletingAccount}
        onOpenChange={(open) => !open && setDeletingAccount(null)}
        isLoading={isDeleting}
        title="حذف الحساب الآجل"
        description="هل أنت متأكد من حذف هذا الحساب؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={() => {
          if (deletingAccount) {
            deleteAccount(deletingAccount.id, {
              onSuccess: () => setDeletingAccount(null),
            });
          }
        }}
      />
    </section>
  );
}