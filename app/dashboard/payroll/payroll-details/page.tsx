"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MainButton from "@/components/dashboard/shared/MainButton";
import { PayrollDetailTableSection } from "@/components/dashboard/payroll/Payrolldetailtablesection";
import { Topbar } from "@/components/dashboard/Topbar";
import { ExportDropdown } from "@/components/dashboard/shared/ExportDropdown";
import { usePayrollRunById, useUpdatePayrollRunStatus } from "@/hooks/use-payroll";
import { PayrollStatusBadge } from "@/components/dashboard/payroll/Payrollstatusbadge";
import {
  useExportPayrollRunPdf,
  useExportPayrollRunExcel,
  useExportPayrollRunEmail,
} from "@/hooks/use-payroll";

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ar-EG", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function PayrollDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? undefined;

  const { data: runRes, isLoading } = usePayrollRunById(id);
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdatePayrollRunStatus();

  // Export hooks
  const { mutate: exportPdf, isPending: isExportingPdf } = useExportPayrollRunPdf();
  const { mutate: exportExcel, isPending: isExportingExcel } = useExportPayrollRunExcel();
  const { mutate: exportEmail, isPending: isExportingEmail } = useExportPayrollRunEmail();

  const run = runRes?.data;
  const periodText = run
    ? `فترة ${formatDate(run.startDate)} – ${formatDate(run.endDate)} · ${(run.details?.length ?? 0)} موظف`
    : "";

  const handleApprove = () => {
    if (!id) return;
    updateStatus({ id, payload: { status: "معتمدة" } });
  };

  // Export handlers
  const handleExportPdf = () => {
    if (id) exportPdf(id);
  };

  const handleExportExcel = () => {
    if (id) exportExcel(id);
  };

  const handleExportEmail = (email: string) => {
    if (id) exportEmail({ id, to: email });
  };

  return (
    <div className="px-4 space-y-4">
      <Topbar title="تفاصيل مسير الرواتب" />
      <div className="flex flex-col gap-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-[24px] font-bold text-[#0F1219]">
                تفاصيل مسير الرواتب {run?.runNumber ? `#${run.runNumber}` : ""}
              </h2>
              {run?.status && <PayrollStatusBadge value={run.status} />}
            </div>
            <p className="mt-1 font-medium text-[16px] text-[#676A6E]">
              {isLoading ? "جاري تحميل البيانات..." : periodText}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            <ExportDropdown
              label="تصدير"
              className="md:!w-[110px] !w-[100%]"
              isExportingPdf={isExportingPdf}
              isExportingExcel={isExportingExcel}
              isExportingEmail={isExportingEmail}
              onExportPdf={handleExportPdf}
              onExportExcel={handleExportExcel}
              onExportEmail={handleExportEmail}
            />
            {run?.status !== "معتمدة" && (
              <MainButton
                text="اعتماد الرواتب"
                loading={isUpdatingStatus}
                onClick={handleApprove}
                disabled={!id || isUpdatingStatus}
                className="md:!w-[246px] !w-[100%]"
              />
            )}
          </div>
        </div>
      </div>
      <PayrollDetailTableSection payrollRunId={id} />
    </div>
  );
}

export default function PayrollDetailsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">جاري التحميل...</div>}>
      <PayrollDetailsContent />
    </Suspense>
  );
}