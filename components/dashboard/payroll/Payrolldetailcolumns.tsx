"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CodeStepperInput } from "../CodeStepperInput";
import { PayrollDetailItem } from "@/types/payroll.types";

const AVATAR_PALETTE = [
    { bg: "#FBE4EC", text: "#C24C74" },
    { bg: "#DDF3EF", text: "#1E9E8C" },
];

function EmployeeAvatar({ name, index }: { name: string; index: number }) {
    const { bg, text } = AVATAR_PALETTE[index % AVATAR_PALETTE.length];

    return (
        <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold"
            style={{ backgroundColor: bg, color: text }}
        >
            {(name || "").trim().charAt(0)}
        </span>
    );
}

function CurrencyCell({ value }: { value: number }) {
    return (
        <span className="font-medium tabular-nums text-[#232323]">
            <span className="ml-1 text-[12px] font-normal text-muted-foreground">
                EGP
            </span>
            {(value ?? 0).toLocaleString("en-US")}
        </span>
    );
}

function DeductionInput({
    value,
    onChange,
}: {
    value: number;
    onChange?: (value: number) => void;
}) {
    return (
        <div className="group inline-flex h-11 items-center gap-3 rounded-2xl border border-[#D8D2F6] bg-[#FCFCFE] px-4 shadow-sm transition-all duration-200 hover:border-[#B9B1EC] focus-within:border-[#40369F] focus-within:ring-2 focus-within:ring-[#40369F]/10">
            <span className="text-[13px] font-medium text-[#8B90A0]">
                EGP
            </span>

            <input
                type="number"
                value={value}
                onChange={(event) => onChange?.(Number(event.target.value))}
                className="w-20 bg-transparent text-right text-[15px] font-semibold text-[#232323] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
        </div>
    );
}

interface GetPayrollDetailColumnsOptions {
    onBonusChange?: (payrollDetailId: string, value: number) => void;
    onDeductionChange?: (payrollDetailId: string, value: number) => void;
    loadingBonusId?: string | null;
    loadingDeductionId?: string | null;
}

/**
 * Returns the column definitions for the detailed payroll table.
 */
export function getPayrollDetailColumns({
    onBonusChange,
    onDeductionChange,
    loadingBonusId,
    loadingDeductionId,
}: GetPayrollDetailColumnsOptions = {}): ColumnDef<PayrollDetailItem>[] {
    return [
        {
            accessorKey: "employee",
            header: "الموظف",
            cell: ({ row }) => {
                const emp = row.original.employee;
                const name = emp?.fullName ?? "موظف";
                const role = emp?.jobTitle ?? emp?.department ?? "";
                return (
                    <div className="flex items-center gap-2">
                        <EmployeeAvatar name={name} index={row.index} />
                        <div className="text-right">
                            <p className="text-[14px] font-medium text-[#232323]">
                                {name}
                            </p>
                            <p className="text-[13px] text-muted-foreground">
                                {role}
                            </p>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "basicSalary",
            header: "الأساسي",
            cell: ({ row }) => <CurrencyCell value={row.original.basicSalary} />,
        },
        {
            accessorKey: "allowances",
            header: "البدلات",
            cell: ({ row }) => <CurrencyCell value={row.original.allowances} />,
        },
        {
            accessorKey: "bonuses",
            header: "المكافآت",
            cell: ({ row }) => (
                <CodeStepperInput
                    value={row.original.bonuses}
                    onChange={(value) => onBonusChange?.(row.original.id, value)}
                    isLoading={loadingBonusId === row.original.id}
                    currency="EGP"
                />
            ),
        },
        {
            accessorKey: "overtime",
            header: "العمل الإضافي",
            cell: ({ row }) => <CurrencyCell value={row.original.overtime} />,
        },
        {
            accessorKey: "deductions",
            header: "الخصومات",
            cell: ({ row }) => (
                <DeductionInput
                    value={row.original.deductions}
                    onChange={(value) => onDeductionChange?.(row.original.id, value)}
                />
            ),
        },
        {
            accessorKey: "netSalary",
            header: "صافي الرواتب",
            cell: ({ row }) => (
                <span className="font-semibold tabular-nums text-[#232323]">
                    <span className="ml-1 text-[12px] font-normal text-muted-foreground">
                        EGP
                    </span>
                    {(row.original.netSalary ?? 0).toLocaleString("en-US")}
                </span>
            ),
        },
    ];
}