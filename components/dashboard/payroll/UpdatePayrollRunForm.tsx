"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { DateField } from "../Datefield";
import MainButton from "../shared/MainButton";
import SecondaryButton from "../shared/SecondaryButton";
import { usePayrollRunById, useUpdatePayrollRun } from "@/hooks/use-payroll";
import { PayrollEmployeeSelectionSection } from "./Payrollemployeeselectionsection";

interface UpdatePayrollRunFormProps {
    payrollRunId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/** Converts an ISO date string to the yyyy-MM-dd shape date inputs expect. */
function toDateInputValue(iso?: string): string {
    return iso ? iso.slice(0, 10) : "";
}

function UpdatePayrollRunFormSkeleton() {
    return (
        <div className="space-y-8 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-11 w-full rounded-xl" />
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-16 w-full rounded-2xl" />
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-lg" />
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
                <Skeleton className="h-11 w-[130px] rounded-xl" />
                <Skeleton className="h-11 w-[150px] rounded-xl" />
            </div>
        </div>
    );
}

export function UpdatePayrollRunForm({
    payrollRunId,
    open,
    onOpenChange,
}: UpdatePayrollRunFormProps) {
    const { data: runRes, isLoading: isRunLoading } = usePayrollRunById(
        open ? payrollRunId ?? undefined : undefined
    );
    const run = runRes?.data;

    const { mutate: updatePayrollRun, isPending } = useUpdatePayrollRun();

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Populate local state once the run loads.
    useEffect(() => {
        if (!run) return;
        setStartDate(toDateInputValue(run.startDate));
        setEndDate(toDateInputValue(run.endDate));
        setSelectedIds((run.details ?? []).map((d) => d.employee.id));
    }, [run]);

    function handleSubmit() {
        if (!payrollRunId) return;

        updatePayrollRun(
            {
                id: payrollRunId,
                payload: {
                    startDate: startDate ? new Date(startDate).toISOString() : undefined,
                    endDate: endDate ? new Date(endDate).toISOString() : undefined,
                    employeeIds: selectedIds,
                },
            },
            { onSuccess: () => onOpenChange(false) }
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[90vw] max-w-[90vw] !max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mt-8">
                    <DialogTitle>تعديل مسير الرواتب</DialogTitle>
                </DialogHeader>

                {isRunLoading || !run ? (
                    <UpdatePayrollRunFormSkeleton />
                ) : (
                    <div className="space-y-8 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DateField
                                label="تاريخ البداية"
                                value={startDate}
                                onChange={setStartDate}
                            />
                            <DateField
                                label="تاريخ النهاية"
                                value={endDate}
                                onChange={setEndDate}
                            />
                        </div>

                        <PayrollEmployeeSelectionSection
                            title="الموظفون المشمولون"
                            subtitle="عدّل قائمة الموظفين المشمولين في هذا المسير."
                            initialSelectedIds={selectedIds}
                            onSelectionChange={setSelectedIds}
                            className="!shadow-none !p-0"
                        />

                        <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
                            <SecondaryButton
                                type="button"
                                text="إلغاء"
                                icon={null}
                                onClick={() => onOpenChange(false)}
                                className="!w-[130px]"
                            />
                            <MainButton
                                type="button"
                                text={isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
                                icon={<Save className="h-4 w-4" />}
                                className="!w-[150px]"
                                disabled={isPending}
                                onClick={handleSubmit}
                            />
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}