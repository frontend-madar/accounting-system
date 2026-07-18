"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { ArrowUpDown, RefreshCw } from "lucide-react";

import { getExpenseColumns } from "./ExpensesColumns";
import { ExpenseRecord } from "@/types/types";
import { DataTable } from "../DataTable";
import { DataTablePagination } from "../Pagination";


const PAGE_SIZE = 5;

interface ExpensesTableSectionProps {
  title?: string;
  onRefresh?: () => void;
  data: ExpenseRecord[];
  totalRecords?: number;
  className?: string;
}

export function ExpensesTableSection({
  title = "سجل المصروفات",
  onRefresh,
  data,
  totalRecords,
  className,
}: ExpensesTableSectionProps) {
  const [page, setPage] = useState(1);

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  }, [data, page]);

  const columns = useMemo(() => getExpenseColumns(), []);

  return (
    <section
      className={`rounded-2xl bg-white ctm-shadow p-5 ${className ?? ""}`}
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[18px] font-semibold text-[#232323]">{title}</h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            aria-label="تحديث"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E4E2E9]"
          >
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </button>

          <button
            type="button"
            aria-label="ترتيب"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E4E2E9]"
          >
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <DataTable columns={columns} data={pageRows} />
      </div>

      <DataTablePagination
        className="mt-4"
        page={page}
        pageSize={PAGE_SIZE}
        totalRecords={totalRecords ?? data.length}
        onPageChange={setPage}
      />
    </section>
  );
}