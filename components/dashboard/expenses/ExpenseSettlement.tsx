"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";

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
                    icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M4.86305 2.03215C5.00638 1.68055 5.40761 1.51172 5.75921 1.65506L8.50921 2.77615C8.85055 2.91531 9.0214 3.2989 8.89651 3.64571L7.97985 6.19128C7.8512 6.54852 7.45732 6.73383 7.10008 6.60519C6.74284 6.47655 6.55753 6.08266 6.68617 5.72542L7.12959 4.49406C4.42035 5.64443 2.52051 8.33015 2.52051 11.4584C2.52051 11.8886 2.55636 12.3099 2.6251 12.7196C2.68792 13.0941 2.43529 13.4486 2.06083 13.5114C1.68636 13.5742 1.33187 13.3216 1.26905 12.9471C1.18775 12.4625 1.14551 11.9651 1.14551 11.4584C1.14551 7.87464 3.25427 4.78462 6.29823 3.35967L5.24014 2.92832C4.88854 2.78498 4.71971 2.38375 4.86305 2.03215ZM10.78 3.20867C10.8428 2.83421 11.1973 2.58157 11.5718 2.6444C15.7993 3.35364 19.0205 7.02914 19.0205 11.4584C19.0205 12.1184 18.9489 12.7621 18.8128 13.3819L19.7792 12.7235C20.093 12.5097 20.5207 12.5908 20.7345 12.9046C20.9483 13.2184 20.8672 13.6461 20.5534 13.8599L17.8625 15.6932C17.7003 15.8037 17.4985 15.8396 17.308 15.7918C17.1176 15.744 16.9567 15.617 16.8659 15.4429L15.4318 12.6929C15.2562 12.3562 15.3868 11.941 15.7234 11.7654C16.0601 11.5899 16.4754 11.7205 16.6509 12.0571L17.3795 13.4543C17.5529 12.8188 17.6455 12.1497 17.6455 11.4584C17.6455 7.71182 14.9204 4.60041 11.3443 4.00044C10.9698 3.93762 10.7172 3.58313 10.78 3.20867ZM2.53476 16.0417C2.53476 15.662 2.84257 15.3542 3.22226 15.3542H6.41634C6.79604 15.3542 7.10384 15.662 7.10384 16.0417C7.10384 16.4214 6.79604 16.7292 6.41634 16.7292H4.65984C6.03452 18.1434 7.95639 19.0209 10.083 19.0209C12.0203 19.0209 13.7861 18.2933 15.1245 17.0954C15.4074 16.8421 15.8421 16.8662 16.0953 17.1491C16.3485 17.4321 16.3244 17.8667 16.0415 18.1199C14.4608 19.5347 12.3716 20.3959 10.083 20.3959C7.68827 20.3959 5.51375 19.4537 3.90976 17.9212V19.25C3.90976 19.6297 3.60196 19.9375 3.22226 19.9375C2.84257 19.9375 2.53476 19.6297 2.53476 19.25L2.53476 16.0417Z" fill="#161616" />
                    </svg>}
                    className="!w-[150px]"
                />
                <MainButton type="submit" text="تطبيق" icon={<Check className="w-5 h-5" />} className="!w-[130px]" />
            </div>
        </form>
    );
};

export default ExpenseSettlement;