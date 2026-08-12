"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { DataTable } from "../DataTable";
import { DataTablePagination } from "../Pagination";
import { getEmployeeReportColumns } from "./EmployeeReportsColumns";
import MainButton from "../shared/MainButton";
import { ExportDropdown } from "../shared/ExportDropdown";
import SearchInput from "../SearchInput";
import {
  useEmployeeReports,
  useDeleteEmployeeReport,
  useExportEmployeeReportsPdf,
  useExportEmployeeReportsExcel,
  useExportEmployeeReportsEmail,
} from "@/hooks/use-employee-report";
import { useDebounce } from "@/hooks/use-debounce";
import type { EmployeeReport } from "@/types/employee-report.types";
import { ConfirmDeleteDialog } from "../shared/ConfirmDeleteDialog";
import { UpdateEmployeeReportForm } from "./UpdateEmployeeReportForm";

const PAGE_SIZE = 10;

interface EmployeeReportsTableSectionProps {
  className?: string;
}

export function EmployeeReportsTableSection({
  className,
}: EmployeeReportsTableSectionProps) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  const [reportIdToEdit, setReportIdToEdit] = useState<string | null>(null);
  const [reportToDelete, setReportToDelete] = useState<EmployeeReport | null>(null);

  const { data: reportsRes, isLoading } = useEmployeeReports({
    page,
    limit: PAGE_SIZE,
    search: debouncedQuery || undefined,
  });
  const { mutate: deleteReport, isPending: isDeleting } = useDeleteEmployeeReport();
  const { mutate: exportPdf, isPending: isExportingPdf } = useExportEmployeeReportsPdf();
  const { mutate: exportExcel, isPending: isExportingExcel } = useExportEmployeeReportsExcel();
  const { mutate: exportEmail, isPending: isExportingEmail } = useExportEmployeeReportsEmail();

  const rows = reportsRes?.data.data ?? [];
  const totalRecords = reportsRes?.data.totalPages ?? 0;
  const totalTarget = reportsRes?.data.totalTarget ?? 0;
  const totalClients = reportsRes?.data.totalClients ?? 0;

  function handleSearchChange(value: string) {
    setQuery(value);
    setPage(1);
  }

  function handleExportPdf() {
    exportPdf({ search: debouncedQuery || undefined });
  }

  function handleExportExcel() {
    exportExcel({ search: debouncedQuery || undefined });
  }

  function handleExportEmail(email: string) {
    exportEmail({ to: email });
  }

  function confirmDelete() {
    if (!reportToDelete) return;
    deleteReport(reportToDelete.id, {
      onSuccess: () => setReportToDelete(null),
    });
  }

  const columns = useMemo(
    () =>
      getEmployeeReportColumns({
        onEdit: (report) => setReportIdToEdit(report.id),
        onDelete: (report) => setReportToDelete(report),
      }),
    []
  );

  return (
    <div className={className}>
      <section className="rounded-2xl bg-white ctm-shadow p-5">
        <div className="flex flex-col md:flex-row  justify-between">


            <div className="flex items-center gap-2">
              <h2 className="sm:text-[24px] text-[18px] font-semibold text-[#0F1219]">
                قائمة التقارير
              </h2>
              <span className="rounded-full bg-[#E6F6F4] px-3 py-1 text-[13px] font-medium text-[#1BA915]">
                {totalRecords} تقرير
              </span>
            </div>


          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto gap-2">
              <ExportDropdown
                label="تصدير"
                className="sm:!w-[111px] w-full"
                isExportingPdf={isExportingPdf}
                isExportingExcel={isExportingExcel}
                isExportingEmail={isExportingEmail}
                onExportPdf={handleExportPdf}
                onExportExcel={handleExportExcel}
                onExportEmail={handleExportEmail}
              />

              <div className="w-full" >
                <SearchInput
                  query={query}
                  setQuery={handleSearchChange}
                  placeholder="ابحث عن موظف أو عميل..."
                />
              </div>
            </div>
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

      <ConfirmDeleteDialog
        open={!!reportToDelete}
        onOpenChange={(open) => !open && setReportToDelete(null)}
        isLoading={isDeleting}
        title="تأكيد الحذف"
        description={`هل أنت متأكد من حذف تقرير الموظف ${reportToDelete?.employeeName}؟ لا يمكن التراجع عن هذا الإجراء.`}
        onConfirm={confirmDelete}
      />

      <UpdateEmployeeReportForm
        reportId={reportIdToEdit}
        open={!!reportIdToEdit}
        onOpenChange={(open) => !open && setReportIdToEdit(null)}
      />
    </div>
  );
}