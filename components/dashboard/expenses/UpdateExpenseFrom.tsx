"use client";

import { useRef, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";

import { FormSection } from "../invoice/FormSection";
import { InvoiceTextField } from "../invoice/TextField";
import { SelectField } from "../invoice/SelectField";
import MainButton from "../shared/MainButton";
import SecondaryButton from "../shared/SecondaryButton";
import { Skeleton } from "@/components/ui/skeleton";

import { AmountField } from "./AmountField";
import { SingleAttachmentDropzone } from "./SingleAttachmentDropzone";
import { expenseFormSchema, ExpenseFormValues } from "@/validations/ExpenseSettlement";
import { useCreateExpense, useUpdateExpense, useExpense } from "@/hooks/useExpenses";
import { useSyncExpenseOptions } from "@/hooks/useSyncExpenseOptions";
import type { ExpenseCurrency } from "@/types/expense.types";
import { DateField } from "../Datefield";
import { useExpenseOptionsStore } from "@/store/expense.store";
import { NotesCard } from "../shared/NotesCard";

// Fixed currency list from the API contract.
const CURRENCY_OPTIONS = [
    { label: "SAR", value: "SAR" },
    { label: "EGP", value: "EGP" },
    { label: "AED", value: "AED" },
    { label: "USD", value: "USD" },
    { label: "EUR", value: "EUR" },
    { label: "GBP", value: "GBP" },
];

// The two statuses the API accepts.
const DRAFT_STATUS = "مسودة";
const PAID_STATUS = "مدفوع";

interface ExpenseFormProps {
    mode: "create" | "update";
    expenseId?: string | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

function ExpenseFormSkeleton() {
    return (
        <div className="space-y-8 rounded-2xl bg-white p-6 ctm-shadow">
            <div className="space-y-2">
                <Skeleton className="h-7 w-56" />
                <Skeleton className="h-5 w-80" />
            </div>

            <div className="grid lg:grid-cols-3 items-start gap-4">
                <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-5 w-32" />
                    <div className="grid md:grid-cols-2 gap-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-11 w-full rounded-md" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-full w-full">
                    <Skeleton className="h-[220px] w-full rounded-2xl" />
                </div>
            </div>

            <div className="border-t border-b py-10 space-y-4">
                <Skeleton className="h-5 w-28" />
                <div className="grid md:grid-cols-2 gap-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-11 w-full rounded-md" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-[120px] w-full rounded-md" />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-end gap-3 pt-5">
                <Skeleton className="h-11 w-[150px] rounded-md" />
                <Skeleton className="h-11 w-[140px] rounded-md" />
            </div>
        </div>
    );
}

export function ExpenseForm({ mode, expenseId, onSuccess, onCancel }: ExpenseFormProps) {
    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
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
    const [existingAttachmentUrl, setExistingAttachmentUrl] = useState<string | null>(null);
    const [existingFileName, setExistingFileName] = useState<string | null>(null);

    const createExpense = useCreateExpense();
    const updateExpense = useUpdateExpense();
    const { data: expenseData, isLoading: isLoadingExpense } = useExpense(
        mode === "update" ? expenseId || null : null
    );

    // Keeps the shared Zustand store in sync with the latest fetched data.
    useSyncExpenseOptions();

    const categoryOptions = useExpenseOptionsStore((s) => s.categoryOptions);
    const paymentMethodOptions = useExpenseOptionsStore((s) => s.paymentMethodOptions);
    const accountOptions = useExpenseOptionsStore((s) => s.accountOptions);

    // Load expense data into form when editing
    useEffect(() => {
        if (mode === "update" && expenseData) {
            const expense = expenseData.data;
            setValue("amount", expense.amount.toString());
            setValue("currency", expense.currency);
            setValue("expenseDate", expense.expenseDate);
            setValue("category", expense.category);
            setValue("paymentMethod", expense.paymentMethod?.id || "");
            setValue("account", expense.account?.id || "");
            setValue("vendorPhone", expense.payeePhone || "");
            setValue("notes", expense.notes || "");
            
            // Set existing attachment info
            if (expense.documentUrl) {
                setExistingAttachmentUrl(expense.documentUrl);
                // Extract filename from URL if available
                const fileName = expense.documentUrl.split("/").pop() || "المرفق";
                setExistingFileName(fileName);
            }
        }
    }, [mode, expenseData, setValue]);

    // Handle attachment selection (supports File | null)
    function handleAttachmentSelect(file: File | null) {
        attachmentRef.current = file;
        if (file) {
            // New file selected, clear existing attachment
            setExistingAttachmentUrl(null);
            setExistingFileName(null);
        } else {
            // File removed
            attachmentRef.current = null;
        }
    }

    function submitExpense(values: ExpenseFormValues, status: string) {
        const payload = {
            amount: Number(values.amount),
            currency: values.currency as ExpenseCurrency,
            expenseDate: values.expenseDate?.slice(0, 10),
            category: values.category,
            paymentMethodId: values.paymentMethod,
            accountId: values.account,
            status,
            payeePhone: values.vendorPhone || undefined,
            notes: values.notes || undefined,
            document: attachmentRef.current || undefined,
        };

        if (mode === "create") {
            createExpense.mutate(payload, {
                onSuccess: () => {
                    reset();
                    attachmentRef.current = null;
                    setExistingAttachmentUrl(null);
                    setExistingFileName(null);
                    onSuccess?.();
                },
            });
        } else if (mode === "update" && expenseId) {
            updateExpense.mutate(
                { id: expenseId, payload },
                {
                    onSuccess: () => {
                        reset();
                        attachmentRef.current = null;
                        setExistingAttachmentUrl(null);
                        setExistingFileName(null);
                        onSuccess?.();
                    },
                }
            );
        }
    }

    // "حفظ المصروف" → status: مدفوع
    const onSubmitPaid = handleSubmit((values) => submitExpense(values, PAID_STATUS));

    // "حفظ كمسودة" → status: مسودة.
    const onSubmitDraft = handleSubmit((values) => submitExpense(values, DRAFT_STATUS));

    const isPending = createExpense.isPending || updateExpense.isPending;
    const isLoading = mode === "update" && isLoadingExpense;

    if (isLoading) {
        return <ExpenseFormSkeleton />;
    }

    return (
        <form className="space-y-8 rounded-2xl bg-white p-6 ctm-shadow">
            <div>
                <h2 className="text-[24px] font-bold text-[#0F1219]">
                    {mode === "create" ? "إضافة مصروف جديد" : "تعديل المصروف"}
                </h2>
                <p className="mt-1 font-medium text-[16px] text-[#0F1219]">
                    {mode === "create"
                        ? "تسجيل مصروف جديد وإرفاق المستندات المرتبطة به."
                        : `تعديل بيانات المصروف رقم ${expenseData?.data?.code || ""}`}
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

                <div className="h-full w-full col">
                    <SingleAttachmentDropzone 
                        onFileSelect={handleAttachmentSelect}
                        initialFileUrl={existingAttachmentUrl || undefined}
                        initialFileName={existingFileName || undefined}
                    />
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

            <div className="flex flex-col md:flex-row items-center justify-end gap-3 pt-5">
                <MainButton
                    type="button"
                    onClick={onSubmitPaid}
                    text={isPending ? "جارٍ الحفظ..." : mode === "create" ? "حفظ المصروف" : "تحديث المصروف"}
                    icon={<Save className="h-4 w-4" />}
                    disabled={isPending}
                />
                <SecondaryButton
                    type="button"
                    onClick={onSubmitDraft}
                    text="حفظ كمسودة"
                    icon={<X className="h-4 w-4" />}
                    disabled={isPending}
                />
                {mode === "update" && onCancel && (
                    <SecondaryButton
                        type="button"
                        onClick={onCancel}
                        text="إلغاء"
                        disabled={isPending}
                    />
                )}
            </div>
        </form>
    );
}