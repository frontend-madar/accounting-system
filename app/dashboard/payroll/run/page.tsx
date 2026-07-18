"use client";
import MainButton from "@/components/dashboard/MainButton";
import { PayrollEmployeeSelectionSection } from "@/components/dashboard/payroll/Payrollemployeeselectionsection";
import { PayrollInfo } from "@/components/dashboard/payroll/PayrollInfo";
import { Topbar } from "@/components/dashboard/Topbar"
import { Employee } from "@/types/types";
import { Plus } from "lucide-react";


const employees: Employee[] = [
    {
        id: "1043-1",
        jobNumber: "EMP-1043",
        name: "عبدالرحمن سالم",
        department: "المبيعات",
        baseSalary: 5466,
        hireDate: "",
        employeeNumber: "",
        jobTitle: "",
        salary: 0,
        attachmentsCount: 0,
    },
    {
        id: "1043-2",
        jobNumber: "EMP-1043",
        name: "ماهر عماد",
        department: "المبيعات",
        baseSalary: 5466,
        hireDate: "",
        employeeNumber: "",
        jobTitle: "",
        salary: 0,
        attachmentsCount: 0,
    },
    {
        id: "1043-3",
        jobNumber: "EMP-1043",
        name: "سلمى ايمن",
        department: "المبيعات",
        baseSalary: 5466,
        hireDate: "",
        employeeNumber: "",
        jobTitle: "",
        salary: 0,
        attachmentsCount: 0,
    },
];

const departments = [
    { label: "المبيعات", value: "المبيعات" },
    { label: "التسويق", value: "التسويق" },
    { label: "الموارد البشرية", value: "الموارد البشرية" },
];

export default function RunPayrollPage() {
    return (
        <div className="px-4 space-y-4">
            <Topbar title='تشغيل مسير رواتب' />
            <PayrollInfo />
            
            <PayrollEmployeeSelectionSection
                data={employees}
                departments={departments}
                onSelectionChange={(ids) => console.log("selected employee ids:", ids)}
            />


            <div className="bg-white p-4 rounded-2xl ctm-shadow flex justify-between" >
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
                    icon={<Plus className="h-4 w-4" />}
                />
            </div>
        </div>
    );
}