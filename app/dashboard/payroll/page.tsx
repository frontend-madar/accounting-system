"use client";

import { PayrollTableSection } from "@/components/dashboard/payroll/Payrolltablesection";
import { Topbar } from "@/components/dashboard/Topbar";

export default function PayrollPage() {
    return (
        <div className="px-4 space-y-4">
            <Topbar title='الرواتب' />
            <PayrollTableSection />
        </div>
    );
}