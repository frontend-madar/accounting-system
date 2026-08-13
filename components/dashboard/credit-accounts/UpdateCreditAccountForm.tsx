"use client";

import * as React from "react";
import { useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Save, Plus } from "lucide-react";

import {
    creditAccountFormSchema,
    CreditAccountFormValues,
    STATUS_OPTIONS,
} from "@/validations/CreditAccount";
import { FormSection } from "../invoice/FormSection";
import { InvoiceTextField } from "../invoice/TextField";
import { SelectField } from "../invoice/SelectField";
import MainButton from "../shared/MainButton";
import SecondaryButton from "../shared/SecondaryButton";
import { DateField } from "../Datefield";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useClients } from "@/hooks/use-client";
import { useEmployees } from "@/hooks/use-employee";
import { useExpensePaymentMethods } from "@/hooks/useExpenses";
import { useUpdateDeferredAccount, useDeferredAccount } from "@/hooks/use-deferred-account";
import { useInvoices } from "@/hooks/use-invoice";
import type { UpdateDeferredAccountPayload } from "@/types/deferred-account.types";
import { useSyncCurrencies } from "@/hooks/useSyncCurrencies";
import { useCurrencyStore } from "@/store/currency.store";

interface UpdateCreditAccountFormProps {
    accountId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function UpdateCreditAccountFormSkeleton() {
    return (
        <div className="space-y-8 pt-2">
            <div className="space-y-3">
                <Skeleton className="h-5 w-28" />
                <div className="grid md:grid-cols-2 gap-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-11 w-full rounded-md" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <div className="grid md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-11 w-full rounded-md" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-24 w-full rounded-md" />
                <Skeleton className="h-11 w-full rounded-md" />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
                <Skeleton className="h-11 w-[110px] rounded-md" />
                <Skeleton className="h-11 w-[150px] rounded-md" />
            </div>
        </div>
    );
}

export function UpdateCreditAccountForm({
    accountId,
    open,
    onOpenChange,
}: UpdateCreditAccountFormProps) {
    const { data: account, isLoading: isAccountLoading } = useDeferredAccount(
        open ? accountId : null
    );

    const { data: clientsRes } = useClients({ limit: 100 });
    const { data: employeesRes } = useEmployees({ limit: 100 });
    const { data: paymentMethodsRes } = useExpensePaymentMethods();
    const { data: invoicesRes } = useInvoices({ limit: 100 });
    const { mutate: updateDeferredAccount, isPending } = useUpdateDeferredAccount();

    const clientOptions = useMemo(() => {
        const list = clientsRes?.data?.data || [];
        return list.map((c) => ({ label: c.name, value: c.id }));
    }, [clientsRes]);

    const employeeOptions = useMemo(() => {
        const list = employeesRes?.data?.data || [];
        return list.map((e) => ({ label: e.fullName, value: e.id }));
    }, [employeesRes]);

    const paymentMethodOptions = useMemo(() => {
        const list = paymentMethodsRes?.data || [];
        return list.map((pm) => ({ label: pm.name, value: pm.name }));
    }, [paymentMethodsRes]);

    const invoiceNumberOptions = useMemo(() => {
        const list = invoicesRes?.data?.data || [];
        return list.map((inv) => ({ label: inv.invoiceNumber, value: inv.invoiceNumber }));
    }, [invoicesRes]);

    useSyncCurrencies();
    const currencyOptions = useCurrencyStore((s) => s.currencyOptions);

    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<CreditAccountFormValues>({
        resolver: zodResolver(creditAccountFormSchema),
        values: account
            ? {
                clientId: account.clientId,
                employeeId: account.employeeId,
                travelDate: account.travelDate,
                invoiceNumber: account.invoiceNumber,
                currency: account.currency,
                totalAmount: String(account.totalAmount),
                status: account.status,
                payments: account.payments?.map((p) => ({
                    amount: String(p.amount),
                    paymentDate: p.paymentDate,
                    paymentMethod: p.paymentMethod,
                })) || [],
            }
            : undefined,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "payments",
    });

    const watchTotalAmount = watch("totalAmount");
    const watchCurrency = watch("currency");
    const watchPayments = watch("payments");

    const totalPaid = useMemo(() => {
        return (watchPayments || []).reduce(
            (sum, p) => sum + (parseFloat(p?.amount || "0") || 0),
            0
        );
    }, [watchPayments]);

    const calculatedRemaining = useMemo(() => {
        const total = parseFloat(watchTotalAmount || "0");
        if (isNaN(total)) return "";
        const rem = Math.max(0, total - totalPaid);
        return `${rem.toLocaleString()} ${watchCurrency || ""}`;
    }, [watchTotalAmount, watchCurrency, totalPaid]);

    function onSubmit(values: CreditAccountFormValues) {
        if (!account || !accountId) return;

        const originalPayments = account.payments || [];

        const payload: UpdateDeferredAccountPayload = {
            clientId: values.clientId,
            employeeId: values.employeeId,
            travelDate: values.travelDate,
            invoiceNumber: values.invoiceNumber,
            currency: values.currency,
            totalAmount: parseFloat(values.totalAmount),
            status: values.status,
            payments: (values.payments || [])
                .filter((p) => p.amount && p.paymentMethod && p.paymentDate)
                .map((p, index) => ({
                    id: originalPayments[index]?.id,
                    amount: parseFloat(p.amount),
                    paymentMethod: p.paymentMethod,
                    paymentDate: p.paymentDate,
                })),
        };

        updateDeferredAccount(
            { accountId, payload },
            { onSuccess: () => onOpenChange(false) }
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[90vw] max-w-[90vw] !max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mt-8">
                    <DialogTitle>تعديل الحساب الآجل</DialogTitle>
                </DialogHeader>

                {isAccountLoading || !account ? (
                    <UpdateCreditAccountFormSkeleton />
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-2">
                        <FormSection title="بيانات العميل" gridClassName="items-end">
                            <Controller
                                control={control}
                                name="clientId" 
                                render={({ field }) => (
                                    <SelectField
                                        label="اسم العميل"
                                        placeholder="اختر العميل"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={clientOptions}
                                        error={errors.clientId?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="travelDate"
                                render={({ field }) => (
                                    <DateField
                                        label="تاريخ السفر"
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={errors.travelDate?.message}
                                    />
                                )}
                            />
                        </FormSection>

                        <FormSection title="بيانات المعاملة" gridClassName="md:!grid-cols-3">
                            <Controller
                                control={control}
                                name="employeeId"
                                render={({ field }) => (
                                    <SelectField
                                        label="اسم الموظف المسؤول"
                                        placeholder="اختر الموظف المسؤول"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={employeeOptions}
                                        error={errors.employeeId?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="invoiceNumber"
                                render={({ field }) => (
                                    <SelectField
                                        label="رقم الفاتورة"
                                        placeholder="اختر رقم الفاتورة"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={invoiceNumberOptions}
                                        error={errors.invoiceNumber?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="currency"
                                render={({ field }) => (
                                    <SelectField
                                        label="العملة"
                                        placeholder="اختر العملة"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={currencyOptions}
                                        error={errors.currency?.message}
                                    />
                                )}
                            />

                            <InvoiceTextField
                                label="المبلغ الكلي"
                                placeholder="80000"
                                type="number"
                                error={errors.totalAmount?.message}
                                {...register("totalAmount")}
                            />

                            <InvoiceTextField
                                label="المدفوع"
                                placeholder="0"
                                defaultValue={totalPaid.toLocaleString()}
                            />

                            <InvoiceTextField
                                label="المتبقي"
                                placeholder="0"
                                defaultValue={calculatedRemaining}
                            />

                            <Controller
                                control={control}
                                name="status"
                                render={({ field }) => (
                                    <SelectField
                                        label="الحالة"
                                        placeholder="اختر الحالة"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={STATUS_OPTIONS}
                                        error={errors.status?.message}
                                    />
                                )}
                            />
                        </FormSection>

                        <FormSection title="الدفعات">
                            <div className="col-span-4 space-y-3">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-1 md:grid-cols-3 gap-4 shadow-md p-4 rounded-md bg-white relative"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="absolute left-3 top-3 text-muted-foreground hover:text-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>

                                        <InvoiceTextField
                                            label="تم دفع"
                                            placeholder="3000"
                                            type="number"
                                            error={errors.payments?.[index]?.amount?.message}
                                            {...register(`payments.${index}.amount`)}
                                        />

                                        <Controller
                                            control={control}
                                            name={`payments.${index}.paymentDate`}
                                            render={({ field }) => (
                                                <DateField
                                                    label="تاريخ الدفع"
                                                    value={field.value || ""}
                                                    onChange={field.onChange}
                                                    error={errors.payments?.[index]?.paymentDate?.message}
                                                />
                                            )}
                                        />

                                        <Controller
                                            control={control}
                                            name={`payments.${index}.paymentMethod`}
                                            render={({ field }) => (
                                                <SelectField
                                                    label="طريقة الدفع"
                                                    placeholder="اختر طريقة الدفع"
                                                    value={field.value || ""}
                                                    onChange={field.onChange}
                                                    options={paymentMethodOptions}
                                                    error={errors.payments?.[index]?.paymentMethod?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                ))}

                                <MainButton
                                    type="button"
                                    text="اضافة دفعة جديدة"
                                    icon={<Plus className="h-4 w-4" />}
                                    onClick={() =>
                                        append({ amount: "", paymentDate: "", paymentMethod: "" })
                                    }
                                />
                            </div>
                        </FormSection>

                        <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
                            <SecondaryButton
                                type="button"
                                text="إلغاء"
                                icon={<X className="h-4 w-4" />}
                                onClick={() => onOpenChange(false)}
                            />
                            <MainButton
                                text={isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
                                icon={<Save className="h-4 w-4" />}
                                disabled={isPending}
                            />
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}