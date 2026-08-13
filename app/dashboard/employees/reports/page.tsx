"use client";

import { Topbar } from "@/components/dashboard/Topbar";
import { EmployeeReportIcon, EmployeeTargetIcon } from "@/icons";
import { useEmployeeReports } from "@/hooks/use-employee-report";
import { EmployeeReportsTableSection } from "@/components/dashboard/employee-report/EmployeeReportsTableSection";
import { useMemo, useState } from "react";
import { SelectField } from "@/components/dashboard/invoice/SelectField";
import { useEmployees } from "@/hooks/use-employee";
import { useExpensePeriods } from "@/hooks/useExpenses";

export default function EmployeeReportsPage() {
  const { data: reportsRes } = useEmployeeReports({
    page: 1,
    limit: 9,
  });

  const totalTarget = reportsRes?.data.totalTarget ?? 0;

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const { data: employeesRes } = useEmployees({ limit: 100 });
  const employeeList = useMemo(() => employeesRes?.data?.data || [], [employeesRes]);
  const { data: periodsRes } = useExpensePeriods();

  const employeeOptions = useMemo(
    () => employeeList.map((e) => ({ label: e.fullName, value: e.id })),
    [employeeList]
  );

  const periodOptions = useMemo(
    () => (periodsRes?.data ?? []).map((p) => ({ label: p.label, value: p.value })),
    [periodsRes]
  );

  return (
    <div className="space-y-5 px-4">
      <Topbar title="التقارير" />

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5' >

        <div className='rounded-2xl ctm-shadow bg-white p-5 lg:col-span-2' >
          <div className='flex gap-2 items-center mb-5' >
            <EmployeeReportIcon />
            <h3 className=" text-[22px] text-[#0F1219] font-medium ">     اداء الموظفيين   </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4 "  >
            <div>
              <SelectField
                label="اسم الموظف المسؤول"
                placeholder="اختر الموظف المسؤول"
                options={employeeOptions}
                value={selectedEmployeeId}
                onChange={setSelectedEmployeeId}
              />
            </div>
            <SelectField
              label="الفترة"
              placeholder="آخر 30 يوم"
              options={periodOptions}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
            />
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