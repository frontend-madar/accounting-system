"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PayrollEmployeeSelectionSection } from "@/components/dashboard/payroll/Payrollemployeeselectionsection";
import { PayrollInfo } from "@/components/dashboard/payroll/PayrollInfo";
import MainButton from "@/components/dashboard/shared/MainButton";
import { Topbar } from "@/components/dashboard/Topbar";
import { useCreatePayrollRun } from "@/hooks/use-payroll";
import { Play } from "lucide-react";

/** Helpers to derive start/end dates from month + year */
function getMonthDateRange(month: string, year: string) {
    const m = Number(month);
    const y = Number(year);
    const startDate = `${y}-${String(m).padStart(2, "0")}-01`;
    const lastDay = new Date(y, m, 0).getDate();
    const endDate = `${y}-${String(m).padStart(2, "0")}-${lastDay}`;
    return { startDate, endDate };
}

export default function RunPayrollPage() {
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [payrollValues, setPayrollValues] = useState<{
        month: string;
        year: string;
        startDate?: string;
        endDate?: string;
        branch: string;
        department: string;
    }>({
        month: "7",
        year: "2026",
        startDate: "2026-07-01",
        endDate: "2026-07-31",
        branch: "all",
        department: "all",
    });

    const { mutate: createPayrollRun, isPending } = useCreatePayrollRun();

    function handleCalculate() {
        if (selectedIds.length === 0) return;

        const fallback = getMonthDateRange(
            payrollValues.month,
            payrollValues.year
        );
        const startDate = payrollValues.startDate || fallback.startDate;
        const endDate = payrollValues.endDate || fallback.endDate;

        createPayrollRun(
            {
                year: Number(payrollValues.year),
                month: Number(payrollValues.month),
                startDate,
                endDate,
                employeeIds: selectedIds,
            },
            {
                onSuccess: (res) => {
                    // Navigate to the details page for the newly created run
                    router.push(
                        `/dashboard/payroll/payroll-details?id=${res.data.id}`
                    );
                },
            }
        );
    }

    return (
        <div className="px-4 space-y-4">
            <Topbar title='تشغيل مسير رواتب' />

            <PayrollInfo
                onChange={(values) => setPayrollValues(values)}
            />

            <PayrollEmployeeSelectionSection
                onSelectionChange={setSelectedIds}
            />

            <div className="bg-white p-4 rounded-2xl ctm-shadow flex flex-col md:flex-row justify-between" >
                <div>
                    <h2 className="text-[24px] font-bold text-[#0F1219] mb-4">
                        احتساب الرواتب
                    </h2>
                    <p className="mt-1 font-medium text-[16px] text-[#0F1219]">
                        احتسب الرواتب لمراجعة النتائج قبل الاعتماد.
                    </p>
                </div>

                <MainButton
                    text="احتساب الرواتب"
                    icon={<Play className="h-4 w-4" />}
                    loading={isPending}
                    onClick={handleCalculate}
                    disabled={selectedIds.length === 0}
                />
            </div>
        </div>
    );
}