"use client";

import { Topbar } from "@/components/dashboard/Topbar";
import { EmployeeReportIcon, EmployeeTargetIcon } from "@/icons";
import { useEmployeeReports } from "@/hooks/use-employee-report";
import { EmployeeReportsTableSection } from "@/components/dashboard/employee-report/EmployeeReportsTableSection";

export default function EmployeeReportsPage() {
  const { data: reportsRes } = useEmployeeReports({
    page: 1,
    limit: 9,
  });

  const totalTarget = reportsRes?.data.totalTarget ?? 0;
  const totalClients = reportsRes?.data.totalClients ?? 0;

  return (
    <div className="space-y-5 px-4">
      <Topbar title="التقارير" />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Employee Performance Card */}
        <div className="rounded-2xl ctm-shadow bg-white p-5 col-span-2">
          <div className="flex gap-2 items-center mb-5">
            <EmployeeReportIcon />
            <h3 className="text-[22px] text-[#0F1219] font-medium">
              أداء الموظفين
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-[14px] font-semibold text-[#232323] md:text-[17px] mb-2">
                إجمالي التارجت
              </p>
              <h2 className="text-[32px] font-bold text-[#40369F]">
                {totalTarget.toLocaleString()} ر.س
              </h2>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#232323] md:text-[17px] mb-2">
                إجمالي العملاء
              </p>
              <h2 className="text-[32px] font-bold text-[#40369F]">
                {totalClients}
              </h2>
            </div>
          </div>
        </div>

        {/* Target Card */}
        <div className="rounded-2xl ctm-shadow bg-white p-5 space-y-4">
          <div className="flex items-center gap-3">
            <EmployeeTargetIcon />
            <p className="text-[#101011CC] text-[18px] font-medium">
              إجمالي التارجت المحقق
            </p>
          </div>
          <h2 className="text-[#101011] font-bold text-[38px]">
            {totalTarget.toLocaleString()}
          </h2>
          <p className="text-[#676A6E] text-[14px]">ر.س</p>
        </div>
      </div>

      {/* Table Section */}
      <EmployeeReportsTableSection />
    </div>
  );
}