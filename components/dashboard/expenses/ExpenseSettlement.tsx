"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { toast } from "sonner";

import {
    expenseSettlementSchema,
    ExpenseSettlementValues,
    STATUS_OPTIONS,
} from "@/validations/ExpenseSettlement";
import { SelectField } from "../invoice/SelectField";
import { InvoiceTextField } from "../invoice/TextField";
import { FormSection } from "../invoice/FormSection";
import MainButton from "../shared/MainButton";
import SecondaryButton from "../shared/SecondaryButton";
import { useExpenseCategories, useExpensePeriods } from "@/hooks/useExpenses";
import { RefreshIcon } from "@/icons";

interface ExpenseSettlementProps {
    initialValues?: Partial<ExpenseSettlementValues>;
    onApply?: (values: ExpenseSettlementValues) => void;
    onReset?: () => void;
    isLoading?: boolean;
}

const EMPTY_VALUES: ExpenseSettlementValues = {
    expenseCode: "",
    period: "",
    expenseCategory: "",
    status: "",
};

function ExpenseSettlementSkeleton() {
    return (
        <div className="rounded-2xl ctm-shadow bg-white p-5 space-y-5">
            <div className="flex items-center gap-3">
                <div className="h-6 w-6 animate-pulse rounded bg-slate-200" />
                <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-3.5 w-16 animate-pulse rounded bg-slate-200" />
                        <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100" />
                    </div>
                ))}
            </div>

            <div className="flex gap-3 justify-end">
                <div className="h-11 w-[150px] animate-pulse rounded-xl bg-slate-100" />
                <div className="h-11 w-[130px] animate-pulse rounded-xl bg-slate-200" />
            </div>
        </div>
    );
}

const ExpenseSettlement = ({ initialValues, onApply, onReset, isLoading }: ExpenseSettlementProps) => {
    const { control, register, handleSubmit, reset } = useForm<ExpenseSettlementValues>({
        resolver: zodResolver(expenseSettlementSchema),
        defaultValues: { ...EMPTY_VALUES, ...initialValues },
    });

    const { data: categoriesRes } = useExpenseCategories();
    const { data: periodsRes } = useExpensePeriods();

    const categoryOptions = React.useMemo(
        () => (categoriesRes?.data ?? []).map((c) => ({ label: c, value: c })),
        [categoriesRes]
    );

    const periodOptions = React.useMemo(
        () => (periodsRes?.data ?? []).map((p) => ({ label: p.label, value: p.value })),
        [periodsRes]
    );

    function onSubmit(values: ExpenseSettlementValues) {
        // At least one filter must be filled before we bother calling the API —
        // an all-empty submit is a no-op filter and shouldn't trigger a fetch.
        const hasAnyValue = Object.values(values).some((v) => v && v.trim() !== "");

        if (!hasAnyValue) {
            toast.info("يرجى تعبئة حقل واحد على الأقل للبحث");
            return;
        }

        onApply?.(values);
    }

    function handleReset() {
        reset(EMPTY_VALUES);
        onReset?.();
    }

    if (isLoading) {
        return <ExpenseSettlementSkeleton />;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl ctm-shadow bg-white p-5 space-y-5">


            <FormSection title="تصفية المصروفات">
                <InvoiceTextField
                    label="الكود"
                    placeholder="ابحث برقم المصروف"
                    {...register("expenseCode")}
                />

                <Controller
                    control={control}
                    name="period"
                    render={({ field }) => (
                        <SelectField
                            label="الفترة"
                            placeholder="آخر 30 يوم"
                            value={field.value}
                            onChange={field.onChange}
                            options={periodOptions}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="expenseCategory"
                    render={({ field }) => (
                        <SelectField
                            label="فئة المصروف"
                            placeholder="جميع الفئات"
                            value={field.value}
                            onChange={field.onChange}
                            options={categoryOptions}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                        <SelectField
                            label="الحالة"
                            placeholder="جميع الحالات"
                            value={field.value}
                            onChange={field.onChange}
                            options={STATUS_OPTIONS}
                        />
                    )}
                />
            </FormSection>

            <div className="flex gap-3 justify-end">
                <SecondaryButton
                    type="button"
                    onClick={handleReset}
                    text="إعادة تعيين"
                    icon={<RefreshIcon />}
                    className="!w-[150px]"
                />
                <MainButton type="submit" text="تطبيق" icon={<Check className="w-5 h-5" />} className="!w-[130px]" />
            </div>
        </form>
    );
};

export default ExpenseSettlement;