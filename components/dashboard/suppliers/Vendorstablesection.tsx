"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Plus, Download, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "../DataTable";
import { DataTablePagination } from "../Pagination";
import { Vendor } from "@/types/types";
import { getVendorColumns } from "./Vendorscolumns";
import MainButton from "../MainButton";
import SecondaryButton from "../SecondaryButton";
import SearchInput from "../SearchInput";

const PAGE_SIZE = 9;

interface VendorsTableSectionProps {
  title?: string;
  subtitle?: string;
  listTitle?: string;
  addButtonLabel?: string;
  exportButtonLabel?: string;
  searchPlaceholder?: string;
  onAddClick?: () => void;
  onExportClick?: () => void;
  data: Vendor[];
  totalRecords?: number;
  className?: string;
}

export function VendorsTableSection({
  title = "الموردون",
  subtitle = "إدارة بيانات الموردين ومتابعة الخدمات والمدفوعات الخاصة بهم.",
  listTitle = "قائمة الموردين",
  addButtonLabel = "إضافة مورد",
  exportButtonLabel = "تصدير",
  searchPlaceholder = "ابحث عن مورد...",
  onAddClick,
  onExportClick,
  data,
  totalRecords,
  className,
}: VendorsTableSectionProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const query = search.trim().toLowerCase();
    return data.filter((vendor) =>
      [vendor.vendorName, vendor.clientName, vendor.clientNumber]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [data, search]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, page]);

  const columns = useMemo(() => getVendorColumns(), []);

  return (
    <div className={className}>
      <div className="flex items-start justify-between gap-4">

        <div>
          <h2 className="text-[24px] font-bold text-[#0F1219]">
            {listTitle}
          </h2>
          <p className="mt-1 font-medium text-[16px] text-[#0F1219]">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">

          <SecondaryButton text={exportButtonLabel} icon={<Download className="h-4 w-4" />} className="!w-[111px]" />
          <MainButton text={addButtonLabel} icon={<Plus className="h-4 w-4" />} className="!w-[155px]" href="suppliers/create" />

        </div>
      </div>

      <section className="mt-4 rounded-2xl bg-white shadow-[0px_3px_10.3px_0px_#0000001A] p-5">

        <div className="mt-4 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-[24px] font-semibold text-[#0F1219]">
              {listTitle}
            </h2>
            <span className="rounded-full bg-[#E6F6F4] px-3 py-1 text-[13px] font-medium text-[#1BA915]">
              {totalRecords ?? data.length} مورد
            </span>
          </div>
          <SearchInput />
        </div>

        <div className="mt-4 overflow-x-auto">
          <DataTable columns={columns} data={pageRows} />
        </div>

        <DataTablePagination
          className="mt-4"
          page={page}
          pageSize={PAGE_SIZE}
          totalRecords={totalRecords ?? filteredData.length}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}