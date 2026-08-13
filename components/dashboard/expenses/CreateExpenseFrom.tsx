"use client";

import * as React from "react";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";

import { FormSection } from "../invoice/FormSection";
import { InvoiceTextField } from "../invoice/TextField";
import { SelectField } from "../invoice/SelectField";
import { FieldLabel } from "../invoice/FieldLabel";
import MainButton from "../shared/MainButton";
import SecondaryButton from "../shared/SecondaryButton";

import { AmountField } from "./AmountField";
import { SingleAttachmentDropzone } from "./SingleAttachmentDropzone";
import { expenseFormSchema, ExpenseFormValues } from "@/validations/ExpenseSettlement";
import { useCreateExpense } from "@/hooks/useExpenses";
import { useSyncExpenseOptions } from "@/hooks/useSyncExpenseOptions";
import type { ExpenseCurrency } from "@/types/expense.types";
import { DateField } from "../Datefield";
import { useExpenseOptionsStore } from "@/store/expense.store";
import { NotesCard } from "../shared/NotesCard";
import { CreatableSelectField } from "../shared/CreatableSelectField";
import { useSyncCurrencies } from "@/hooks/useSyncCurrencies";
import { useCurrencyStore } from "@/store/currency.store";

// The two statuses the API accepts. Not user-facing — decided by which
// button (draft vs submit) the user clicks.
const DRAFT_STATUS = "مسودة";
const PAID_STATUS = "مدفوع";

interface CreateExpenseFormProps {
    onSuccess?: () => void;
}

export function CreateExpenseForm({ onSuccess }: CreateExpenseFormProps) {
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseFormSchema),
        defaultValues: {
            currency: "EGP",
            amount: "",
            expenseDate: "",
            category: "",
            paymentMethod: "",
            account: "",
            vendorName: "",
            vendorPhone: "",
            notes: "",
        },
    });

    const attachmentRef = useRef<File | null>(null);

    const createExpense = useCreateExpense();

    // Keeps the shared Zustand store in sync with the latest fetched data.
    // Safe to call from multiple mounted components — react-query dedupes
    // the underlying network requests by query key.
    useSyncExpenseOptions();

    const categoryOptions = useExpenseOptionsStore((s) => s.categoryOptions);
    const paymentMethodOptions = useExpenseOptionsStore((s) => s.paymentMethodOptions);
    const accountOptions = useExpenseOptionsStore((s) => s.accountOptions);

    useSyncCurrencies();
    const currencyOptions = useCurrencyStore((s) => s.currencyOptions);

    function handleAttachmentSelect(file: File | null) {
        attachmentRef.current = file;
    }

    function submitExpense(values: ExpenseFormValues, status: string) {
        console.log(values)
        createExpense.mutate(
            {
                amount: Number(values.amount),
                currency: values.currency as ExpenseCurrency,
                expenseDate: values.expenseDate?.slice(0, 10),
                category: values.category,
                paymentMethodId: values.paymentMethod,
                accountId: values.account,
                status,
                payeePhone: values.vendorPhone || undefined,
                notes: values.notes || undefined,
                document: attachmentRef.current,
            },
            {
                onSuccess: () => {
                    reset();
                    attachmentRef.current = null;
                    onSuccess?.();
                },
            }
        );
    }

    // "حفظ المصروف" → status: مدفوع
    const onSubmitPaid = handleSubmit((values) => submitExpense(values, PAID_STATUS));

    // "حفظ كمسودة" → status: مسودة.
    // Still goes through handleSubmit so required fields are validated,
    // just tags the result as a draft instead.
    const onSubmitDraft = handleSubmit((values) => submitExpense(values, DRAFT_STATUS));

    return (
        // No onSubmit / native submit reliance — both buttons trigger
        // handleSubmit directly via onClick, since MainButton/SecondaryButton
        // may not forward `type="submit"` down to a real <button> element.
        <form className="space-y-8 rounded-2xl bg-white p-6 ctm-shadow">
            <div>
                <h2 className="text-[24px] font-bold text-[#0F1219]">إضافة مصروف جديد</h2>
                <p className="mt-1 font-medium text-[16px] text-[#0F1219]">
                    تسجيل مصروف جديد وإرفاق المستندات المرتبطة به.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 items-center gap-4">
                <FormSection title="معلومات المصروف" className="lg:col-span-2" gridClassName="md:!grid-cols-2">
                    <Controller
                        control={control}
                        name="currency"
                        render={({ field: currencyField }) => (
                            <Controller
                                control={control}
                                name="amount"
                                render={({ field: amountField }) => (
                                    <AmountField
                                        label="المبلغ"
                                        currency={currencyField.value}
                                        onCurrencyChange={currencyField.onChange}
                                        currencyOptions={currencyOptions}
                                        amount={amountField.value}
                                        onAmountChange={amountField.onChange}
                                        error={errors.amount?.message || errors.currency?.message}
                                    />
                                )}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="category"
                        render={({ field }) => (
                            <CreatableSelectField
                                label="فئة المصروف"
                                placeholder="اختر فئة المصروف أو اكتب فئة جديدة"
                                value={field.value}
                                onChange={field.onChange}
                                options={categoryOptions}
                                error={errors.category?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="expenseDate"
                        render={({ field }) => (
                            <DateField
                                label="تاريخ المصروف"
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.expenseDate?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="paymentMethod"
                        render={({ field }) => (
                            <SelectField
                                label="طريقة الدفع"
                                placeholder="اختر طريقة الدفع"
                                value={field.value}
                                onChange={field.onChange}
                                options={paymentMethodOptions}
                                error={errors.paymentMethod?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="account"
                        render={({ field }) => (
                            <SelectField
                                label="الحساب (الخزنة)"
                                placeholder="اختر الحساب"
                                value={field.value}
                                onChange={field.onChange}
                                options={accountOptions}
                                error={errors.account?.message}
                            />
                        )}
                    />
                </FormSection>

                <div className="h-full w-full col" >
                    <SingleAttachmentDropzone onFileSelect={handleAttachmentSelect} />
                </div>
            </div>

            <FormSection title="بيانات المورد" className="border-t border-b py-10">
                <InvoiceTextField
                    label="اسم المورد"
                    placeholder="ادخل اسم المورد"
                    error={errors.vendorName?.message}
                    {...register("vendorName")}
                />
                <InvoiceTextField
                    label="رقم الهاتف"
                    placeholder="ادخل رقم الهاتف"
                    inputMode="tel"
                    error={errors.vendorPhone?.message}
                    {...register("vendorPhone")}
                />
            </FormSection>

            <NotesCard
                title="ملاحظات"
                description="يمكنك إضافة أي ملاحظات أو تفاصيل إضافية هنا."
                placeholder="اكتب ملاحظاتك هنا..."
                error={errors.notes?.message}
                {...register("notes")}
            />

            <div className="flex flex-col md:flex-row items-center justify-start gap-3 pt-5">
                <MainButton
                    type="button"
                    onClick={onSubmitPaid}
                    text={createExpense.isPending ? "جارٍ الحفظ..." : "حفظ المصروف"}
                    icon={<Save className="h-4 w-4" />}
                    disabled={createExpense.isPending}
                />
                <SecondaryButton
                    type="button"
                    onClick={onSubmitDraft}
                    text="حفظ كمسودة"
                    icon={<X className="h-4 w-4" />}
                    disabled={createExpense.isPending}
                />
            </div>
        </form>
    );
}