"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { DailyEntriesTable } from "./DailyEntriesTable";
import { DailyEntry } from "@/types/types";
import { DataTablePagination } from "./Pagination";
import SearchInput from "./SearchInput";
import FillterButton from "./FillterButton";
import MainButton from "./MainButton";


const PAGE_SIZE = 6;

interface DailyEntriesSectionProps {
  data: DailyEntry[];
  totalRecords?: number;
  className?: string;
}

export function DailyEntriesSection({
  data,
  totalRecords,
  className,
}: DailyEntriesSectionProps) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState(data);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.trim();
    return rows.filter(
      (row) => row.customer.includes(q) || row.employee.includes(q)
    );
  }, [rows, query]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  function handleEditableCodeChange(entryId: string, value: number) {
    setRows((prev) =>
      prev.map((row) =>
        row.id === entryId ? { ...row, editableCode: value } : row
      )
    );
  }

  return (
    <section className={className}>
      <div className="flex items-center justify-between gap-4">

        <SearchInput query={query} setQuery={setQuery} setPage={setPage} />
        <div className="flex items-center gap-4" >
          <FillterButton />
          <MainButton text="إضافة عميل" icon={<Plus className="h-4 w-4" />} />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <DailyEntriesTable
          data={pageRows}
          onEditableCodeChange={handleEditableCodeChange}
        />
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