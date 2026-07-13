"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Plus, Search, SlidersHorizontal, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getCreditAccountColumns,
  CreditAccount,
} from "./CreditAccountsColumns";
 
import { CreditAccountStatus } from "./CreditAccountStatusBadge";
import { DataTable } from "../DataTable";
import { DataTablePagination } from "../Pagination";
import MainButton from "../MainButton";
import FillterButton from "../FillterButton";
import SearchInput from "../SearchInput";

const PAGE_SIZE = 9;

interface CreditAccountsTableSectionProps {
  addButtonLabel?: string;
  onAddClick?: () => void;
  /** Full dataset — pagination below is client-side over this array. */
  data: CreditAccount[];
  /** Total record count, if it differs from `data.length` (server pagination). */
  totalRecords?: number;
  className?: string;
}

export function CreditAccountsTableSection({
  addButtonLabel = "إضافة عميل",
  onAddClick,
  data,
  totalRecords,
  className,
}: CreditAccountsTableSectionProps) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState(data);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.trim();
    return rows.filter(
      (row) => row.client.includes(q) || row.employee.includes(q)
    );
  }, [rows, query]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  function handleStatusChange(id: string, status: CreditAccountStatus) {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, status } : row))
    );
  }

  const columns = useMemo(
    () => getCreditAccountColumns({ onStatusChange: handleStatusChange }),
    []
  );

  return (
    <section className={className}>
      <div className="flex items-center justify-between gap-4">
      
        <MainButton  text={addButtonLabel} icon={<Plus className="h-4 w-4" />} />

        <div className="flex items-center gap-2">
         
          <FillterButton />

         <SearchInput query={query} setQuery={setQuery} setPage={setPage} />
        </div>
      </div>

      <div className="mt-4 overflow-hidden">
        <DataTable columns={columns} data={pageRows} />
      </div>

      <DataTablePagination
        className="mt-4"
        page={page}
        pageSize={PAGE_SIZE}
        totalRecords={totalRecords ?? filtered.length}
        onPageChange={setPage}
      />
    </section>
  );
}