"use client";

import * as React from "react";
import { useMemo, useCallback } from "react";
import { ArrowUpDown, RefreshCw } from "lucide-react";

import { getExpenseColumns } from "./ExpensesColumns";
import { ExpenseRecord } from "@/types/expense.types";
import { DataTable } from "../DataTable";
import { DataTablePagination } from "../Pagination";
import { useDeleteExpense } from "@/hooks/useExpenses";

interface ExpensesTableSectionProps {
  title?: string;
  onRefresh?: () => void;
  onSortToggle?: () => void;
  onDeleteRow?: (row: ExpenseRecord) => void;
  onEditRow?: (row: ExpenseRecord) => void;
  data: ExpenseRecord[];
  page: number;
  pageSize: number;
  totalRecords: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}

export function ExpensesTableSection({
  title = "سجل المصروفات",
  onRefresh,
  onSortToggle,
  onDeleteRow,
  onEditRow,
  data,
  page,
  pageSize,
  totalRecords,
  isLoading,
  onPageChange,
  className,
}: ExpensesTableSectionProps) {
  const deleteExpense = useDeleteExpense();

  const handleDelete = useCallback(
    (row: ExpenseRecord) => {
      deleteExpense.mutate(row.id, {
        onSuccess: () => {
          onDeleteRow?.(row);
        },
      });
    },
    [deleteExpense, onDeleteRow]
  );

  const columns = useMemo(
    () => getExpenseColumns({ onDelete: handleDelete, onEdit: onEditRow }),
    [handleDelete, onEditRow]
  );

  return (
    <section className={`rounded-2xl bg-white ctm-shadow p-5 ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[18px] font-semibold text-[#232323]">{title}</h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            aria-label="تحديث"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E4E2E9]"
          >
            <RefreshCw className={`h-4 w-4 text-muted-foreground ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={onSortToggle}
            aria-label="ترتيب"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E4E2E9]"
          >
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <DataTable columns={columns} data={data} />
      </div>

      <DataTablePagination
        className="mt-4"
        page={page}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
      />
    </section>
  );
}