"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Plus, ArrowUpDown, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getEmployeeColumns } from "./EmployeesColumns";
import { Employee } from "@/types/types";
import { DataTable } from "../DataTable";
import { DataTablePagination } from "../Pagination";
import MainButton from "../MainButton";
import SecondaryButton from "../SecondaryButton";


const PAGE_SIZE = 5;

interface EmployeesTableSectionProps {
  title?: string;
  addButtonLabel?: string;
  onAddClick?: () => void;
  onRefresh?: () => void;
  data: Employee[];
  totalRecords?: number;
  className?: string;
}

export function EmployeesTableSection({
  title = "سجل الموظفين",
  addButtonLabel = "اضافة موظف",
  onAddClick,
  onRefresh,
  data,
  totalRecords,
  className,
}: EmployeesTableSectionProps) {
  const [page, setPage] = useState(1);

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  }, [data, page]);

  const columns = useMemo(() => getEmployeeColumns(), []);

  return (
    <section
      className={`rounded-2xl bg-white ctm-shadow p-5 ${className ?? ""}`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
        <h2 className="text-[18px] font-semibold text-[#232323]">{title}</h2>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <SecondaryButton text={""} icon={<RefreshCw className="h-4 w-4" />} className="!w-[187px] sm:!w-12" />
          <SecondaryButton text={""} icon={<ArrowUpDown className="h-4 w-4" />} className="!w-[187px] sm:!w-12" />
          <MainButton text={addButtonLabel} icon={<Plus className="h-4 w-4" />} className="!w-[187px]" href="employees/create" />
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