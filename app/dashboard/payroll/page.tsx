"use client";

import { Payroll } from "@/components/dashboard/payroll/Payrollcolumns";
import { PayrollTableSection } from "@/components/dashboard/payroll/Payrolltablesection";
import { Topbar } from "@/components/dashboard/Topbar";
import { payrollData } from "@/data/data";





export default function PayrollPage() {
    return (
        <div className="px-4 space-y-4">
            <Topbar title='الرواتب' />
            <PayrollTableSection
                data={payrollData}
                totalRecords={148}
                onAddClick={() => console.log("تشغيل مسير رواتب جديد")}
                onView={(id) => console.log("عرض", id)}
                onOpenActions={(id) => console.log("خيارات", id)}
            />
        </div>
    );
}