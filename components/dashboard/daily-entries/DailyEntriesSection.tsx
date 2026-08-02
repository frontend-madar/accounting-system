"use client";

import * as React from "react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { DailyEntriesTable } from "./DailyEntriesTable";
 
import { useDailyEntries, useDeleteDailyEntry } from "@/hooks/use-daily-entry";
import { useDebounce } from "@/hooks/use-debounce";
import type { DailyEntryItem } from "@/types/daily-entry.types";
import FilterButton from "../FillterButton";
import SearchInput from "../SearchInput";
import MainButton from "../shared/MainButton";
import { DataTablePagination } from "../Pagination";
import { ConfirmDeleteDialog } from "../shared/ConfirmDeleteDialog";

const PAGE_SIZE = 6;

interface DailyEntriesSectionProps {
  className?: string;
}

export function DailyEntriesSection({ className }: DailyEntriesSectionProps) {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  const [deletingEntry, setDeletingEntry] = useState<DailyEntryItem | null>(null);

  const { data: apiResponse, isLoading } = useDailyEntries({
    page,
    limit: PAGE_SIZE,
    search: debouncedQuery.trim() || undefined,
  });

  const rows = apiResponse?.data?.data ?? [];
  const totalCount = apiResponse?.data?.total ?? 0;

  const { mutate: deleteEntry, isPending: isDeleting } = useDeleteDailyEntry();

  return (
    <section className={className}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <SearchInput query={query} setQuery={setQuery} setPage={setPage} />
        </div>
        <div className="flex items-center gap-4">
          <MainButton
            text="إضافة عميل"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => router.push("/dashboard/daily-entries/create")}
          />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <DailyEntriesTable
          data={rows}
          isLoading={isLoading}
          onEdit={(entry) => router.push(`/dashboard/daily-entries/${entry.id}/edit`)}
          onDelete={(entry) => setDeletingEntry(entry)}
        />
      </div>

      <DataTablePagination
        className="mt-4"
        page={page}
        pageSize={PAGE_SIZE}
        totalRecords={totalCount}
        onPageChange={setPage}
      />

      <ConfirmDeleteDialog
        open={!!deletingEntry}
        onOpenChange={(open) => !open && setDeletingEntry(null)}
        isLoading={isDeleting}
        title="حذف القيد اليومي"
        description="هل أنت متأكد من حذف هذا القيد؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={() => {
          if (deletingEntry) {
            deleteEntry(deletingEntry.id, {
              onSuccess: () => setDeletingEntry(null),
            });
          }
        }}
      />
    </section>
  );
}