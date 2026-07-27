"use client";

import * as React from "react";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

import { FormSection } from "../invoice/FormSection";
import { InvoiceTextField } from "../invoice/TextField";
import { SelectField } from "../invoice/SelectField";
import { FieldLabel } from "../invoice/FieldLabel";
import MainButton from "../shared/MainButton";
import SecondaryButton from "../shared/SecondaryButton";

import { AmountField } from "./AmountField";
import { DateTimeField } from "./DateTimeField";
import { SingleAttachmentDropzone } from "./SingleAttachmentDropzone";
import { expenseFormSchema, ExpenseFormValues } from "@/validations/ExpenseSettlement";
import {
    useExpenseAccounts,
    useExpenseCategories,
    useExpensePaymentMethods,
    useCreateExpense,
} from "@/hooks/useExpenses";
import type { ExpenseCurrency } from "@/types/expense.types";
import { DateField } from "../Datefield";

// Fixed currency list from the API contract.
const CURRENCY_OPTIONS = [
    { label: "SAR", value: "SAR" },
    { label: "EGP", value: "EGP" },
    { label: "AED", value: "AED" },
    { label: "USD", value: "USD" },
    { label: "EUR", value: "EUR" },
    { label: "GBP", value: "GBP" },
];

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

    const { data: categoriesRes } = useExpenseCategories();
    const { data: paymentMethodsRes } = useExpensePaymentMethods();
    const { data: accountsRes } = useExpenseAccounts();
    const createExpense = useCreateExpense();

    const categoryOptions = React.useMemo(
        () => (categoriesRes?.data ?? []).map((c) => ({ label: c, value: c })),
        [categoriesRes]
    );
    const paymentMethodOptions = React.useMemo(
        () => (paymentMethodsRes?.data ?? []).map((p) => ({ label: p.name, value: p.id })),
        [paymentMethodsRes]
    );
    const accountOptions = React.useMemo(
        () => (accountsRes?.data ?? []).map((a) => ({ label: a.name, value: a.id })),
        [accountsRes]
    );

    function handleAttachmentSelect(file: File) {
        attachmentRef.current = file;
    }

    // Shared submit logic — `status` is supplied by whichever button
    // triggered it, not read from the form itself.
    function submitExpense(values: ExpenseFormValues, status: string) {
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
                <FormSection title="معلومات المصروف" className="col-span-2" gridClassName="md:!grid-cols-2">
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
                                        currencyOptions={CURRENCY_OPTIONS}
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
                            <SelectField
                                label="فئة المصروف"
                                placeholder="اختر فئة المصروف"
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

                <SingleAttachmentDropzone onFileSelect={handleAttachmentSelect} />
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

            <Card className="overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-slate-50 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="border-slate-100 px-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-1.5 rounded-full bg-gradient-to-b from-[#463BAF] to-[#0e065e]" />
                        <div>
                            <FieldLabel htmlFor="notes" dropdown={false}>
                                <span className="text-xl font-bold text-slate-900">ملاحظات</span>
                            </FieldLabel>
                            <p className="mt-1 text-sm text-slate-500">
                                يمكنك إضافة أي ملاحظات أو تفاصيل إضافية هنا.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <Textarea
                        id="notes"
                        placeholder="اكتب ملاحظاتك هنا..."
                        className="min-h-[180px] resize-none rounded-2xl border-slate-200 bg-slate-50/50 px-4 py-3 text-base leading-7 placeholder:text-slate-400 transition-all duration-200 focus:border-[#102e4f] focus:bg-white focus:ring-4 focus:ring-[#102e4f]/10"
                        {...register("notes")}
                    />
                </div>
            </Card>

            <div className="flex flex-col md:flex-row items-center justify-end gap-3 pt-5">
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