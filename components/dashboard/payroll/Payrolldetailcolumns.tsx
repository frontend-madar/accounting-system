"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
// Adjust this path if CodeStepperInput lives elsewhere in your components tree
// (it's used the same way in DailyEntriesTable.tsx for the "باكود العميل" column).
import { CodeStepperInput } from "../CodeStepperInput";

export interface PayrollDetailEmployee {
    id: string;
    name: string;
    role: string;
    avatarUrl?: string;
}

export interface PayrollDetail {
    id: string;
    employee: PayrollDetailEmployee;
    basicSalary: number;
    allowances: number;
    bonuses: number;
    overtime: number;
    deductions: number;
    netSalary: number;
}

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
            {name.trim().charAt(0)}
        </span>
    );
}

function CurrencyCell({ value }: { value: number }) {
    return (
        <span className="font-medium tabular-nums text-[#232323]">
            <span className="ml-1 text-[12px] font-normal text-muted-foreground">
                EGP
            </span>
            {value.toLocaleString("en-US")}
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
        <span className="inline-flex items-center gap-1 rounded-lg border border-[#463BAF] bg-white px-3 py-1.5">
            <span className="text-[12px] text-muted-foreground">EGP</span>
            <input
                type="number"
                value={value}
                onChange={(event) => onChange?.(Number(event.target.value))}
                className="w-16 bg-transparent text-[14px] font-medium tabular-nums text-[#232323] outline-none"
            />
        </span>
    );
}

interface GetPayrollDetailColumnsOptions {
    onBonusChange?: (payrollId: string, value: number) => void;
    onDeductionChange?: (payrollId: string, value: number) => void;
}

/**
 * Returns the column definitions for the detailed payroll table.
 * Kept as a function (rather than a static array) so callbacks like
 * `onBonusChange` / `onDeductionChange` can close over component state.
 */
export function getPayrollDetailColumns({
    onBonusChange,
    onDeductionChange,
}: GetPayrollDetailColumnsOptions = {}): ColumnDef<PayrollDetail>[] {
    return [
        {
            accessorKey: "employee",
            header: "الموظف",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <EmployeeAvatar
                        name={row.original.employee.name}
                        index={row.index}
                    />
                    <div className="text-right">
                        <p className="text-[14px] font-medium text-[#232323]">
                            {row.original.employee.name}
                        </p>
                        <p className="text-[13px] text-muted-foreground">
                            {row.original.employee.role}
                        </p>
                    </div>
                </div>
            ),
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
                    {row.original.netSalary.toLocaleString("en-US")}
                </span>
            ),
        },
    ];
}