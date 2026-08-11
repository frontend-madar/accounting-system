"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Minus, Plus, Loader2 } from "lucide-react";
import { CodeStepperInput } from "../CodeStepperInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
            {(value ?? 0).toLocaleString("en-US")}
        </span>
    );
}

function DeductionInput({
    value: initialValue,
    onChange,
    isLoading,
    step = 1,
}: {
    value: number;
    onChange?: (value: number) => void;
    isLoading?: boolean;
    step?: number;
}) {
    const [localValue, setLocalValue] = React.useState(initialValue);
    const [isDirty, setIsDirty] = React.useState(false);

    // Sync with prop changes (when data reloads after save)
    React.useEffect(() => {
        setLocalValue(initialValue);
        setIsDirty(false);
    }, [initialValue]);

    function handleIncrement() {
        const newValue = Math.max(0, localValue + step);
        setLocalValue(newValue);
        setIsDirty(true);
    }

    function handleDecrement() {
        const newValue = Math.max(0, localValue - step);
        setLocalValue(newValue);
        setIsDirty(true);
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newValue = Number(event.target.value) || 0;
        setLocalValue(Math.max(0, newValue));
        setIsDirty(true);
    }

    function handleSave() {
        if (isDirty && onChange) {
            onChange(localValue);
            setIsDirty(false);
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            handleSave();
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-11 items-center gap-1.5 rounded-2xl border border-[#D8D2F6] bg-[#FCFCFE] px-4 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-[13px]">جاري التحديث...</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <div className="inline-flex h-11 items-center gap-1 rounded-2xl border border-[#D8D2F6] bg-[#FCFCFE] pr-1.5 pl-1 shadow-sm transition-all duration-200 hover:border-[#B9B1EC] focus-within:border-[#40369F] focus-within:ring-2 focus-within:ring-[#40369F]/10">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-xl text-[#40369F] hover:bg-[#EFEBFB] hover:text-[#40369F]"
                    onClick={handleDecrement}
                    disabled={localValue <= 0}
                    aria-label="نقصان"
                >
                    <Minus className="h-3.5 w-3.5" />
                </Button>

                <Input
                    type="number"
                    min={0}
                    value={localValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="h-8 w-16 border-none bg-transparent p-0 text-center text-[15px] font-semibold text-[#232323] shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-xl text-[#40369F] hover:bg-[#EFEBFB] hover:text-[#40369F]"
                    onClick={handleIncrement}
                    aria-label="زيادة"
                >
                    <Plus className="h-3.5 w-3.5" />
                </Button>
            </div>
            
            {isDirty && (
                <Button
                    type="button"
                    size="sm"
                    onClick={handleSave}
                    className="h-10 rounded-xl bg-[#40369F] px-4 text-white hover:bg-[#2F2585] transition-colors"
                >
                    حفظ
                </Button>
            )}
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
                    isLoading={loadingDeductionId === row.original.id}
                />
            ),
        },
        {
            accessorKey: "netSalary",
            header: "صافي الرواتب",
            cell: ({ row }) => (
                <span className="font-semibold tabular-nums text-[#232323]">
                    {(row.original.netSalary ?? 0).toLocaleString("en-US")}
                </span>
            ),
        },
    ];
}