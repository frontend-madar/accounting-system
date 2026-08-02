"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MainButton from "@/components/dashboard/shared/MainButton";
import SecondaryButton from "@/components/dashboard/shared/SecondaryButton";
import { PayrollDetailTableSection } from "@/components/dashboard/payroll/Payrolldetailtablesection";
import { Topbar } from "@/components/dashboard/Topbar";
import { Download } from "lucide-react";
import { usePayrollRunById, useUpdatePayrollRunStatus } from "@/hooks/use-payroll";
import { PayrollStatusBadge } from "@/components/dashboard/payroll/Payrollstatusbadge";

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

  const run = runRes?.data;
  const periodText = run
    ? `فترة ${formatDate(run.startDate)} – ${formatDate(run.endDate)} · ${(run.details?.length ?? 0)} موظف`
    : "";

  const handleApprove = () => {
    if (!id) return;
    updateStatus({ id, payload: { status: "معتمدة" } });
  };

  return (
    <div className="px-4 space-y-4">
      <Topbar
        title=""
        path="قائمة المرتبات"
        nestedLink="تفاصيل مسير رواتب"
        nestedLinkPath="payroll-details"
        middleNestedLink="تشغيل مسير رواتب"
        middleNestedLinkPath="/dashboard/payroll"
      />
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
            <SecondaryButton
              text="تصدير"
              icon={<Download className="h-4 w-4" />}
              className="md:!w-[110px] !w-[100%]"
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
