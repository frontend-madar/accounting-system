// components/dashboard/clients/ClientsTableSection.tsx
"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

import { getClientColumns } from "./ClientsColumns";
import { ClientsFilter } from "./ClientsFilter";
import { DataTable } from "../DataTable";
import { DataTablePagination } from "../Pagination";
import MainButton from "../MainButton";
import SecondaryButton from "../SecondaryButton";
import { useClients, useDeleteClient } from "@/hooks/use-client";
import { ClientData, GetClientsParams } from "@/types/client.types";
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
import { UpdateClientForm } from "./UpdateClientForm";

const PAGE_SIZE = 5;

interface ClientsTableSectionProps {
  title?: string;
  addButtonLabel?: string;
  className?: string;
}

export function ClientsTableSection({
  title = "سجل العملاء",
  addButtonLabel = "اضافة عميل",
  className,
}: ClientsTableSectionProps) {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<GetClientsParams>({});
  const [clientToDelete, setClientToDelete] = useState<ClientData | null>(null);

  const { data: clientsRes, isLoading, refetch } = useClients({
    page,
    limit: PAGE_SIZE,
    ...filters,
  });
  const { mutate: deleteClient, isPending: isDeleting } = useDeleteClient();

  const rows = clientsRes?.data.data ?? [];
  const totalRecords = clientsRes?.data.total ?? 0;
  const [clientToEdit, setClientToEdit] = useState<ClientData | null>(null);

  function handleRefresh() {
    setPage(1);
    refetch();
  }

  function handleFilterChange(newFilters: GetClientsParams) {
    setFilters(newFilters);
    // New filter criteria should always start back at page 1.
    setPage(1);
  }

  function confirmDelete() {
    if (!clientToDelete) return;
    deleteClient(clientToDelete.id, {
      onSuccess: () => setClientToDelete(null),
    });
  }

  const columns = useMemo(
    () =>
      getClientColumns({
        onEdit: (client) => {
          console.log("Editing client:", client);
          setClientToEdit(client);
        },
        onDelete: (client) => setClientToDelete(client),
      }),
    []
  );
  return (
    <section className={className ?? ""}>
      <ClientsFilter onFilterChange={handleFilterChange} />

      <div className="rounded-2xl bg-white ctm-shadow p-4 mt-4">
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
          <h2 className="text-[18px] font-semibold text-[#232323]">{title}</h2>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <SecondaryButton
              text={""}
              icon={<RefreshCw className="h-4 w-4" />}
              className="!w-[187px] sm:!w-12"
              onClick={handleRefresh}
            />
            <MainButton text={addButtonLabel} icon={<Plus className="h-4 w-4" />} className="!w-[187px]" href="clients/create" />
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
      </div>

      <AlertDialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف العميل {clientToDelete?.name}؟ لا يمكن التراجع عن هذا الإجراء.
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

      <UpdateClientForm
        client={clientToEdit}
        open={!!clientToEdit}
        onOpenChange={(open) => !open && setClientToEdit(null)}
      />
    </section>
  );
}