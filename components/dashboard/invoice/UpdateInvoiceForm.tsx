"use client";

import * as React from "react";
import { useEffect, useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, X } from "lucide-react";

import {
    INCLUDES_OPTIONS,
    invoiceFormSchema,
    InvoiceFormValues,
    SERVICE_OPTIONS,
    STATUS_OPTIONS,
} from "@/validations/Invoice";
import { FormSection } from "./FormSection";
import { InvoiceTextField } from "./TextField";
import { SelectField } from "./SelectField";
import { MultiSelectField } from "./MultiSelectField";
import { DateField } from "../Datefield";
import MainButton from "../shared/MainButton";
import SecondaryButton from "../shared/SecondaryButton";
import { Skeleton } from "@/components/ui/skeleton";

import { useClients } from "@/hooks/use-client";
import { useEmployees } from "@/hooks/use-employee";
import { useInvoice, useUpdateInvoice } from "@/hooks/use-invoice";
import type { UpdateInvoicePayload } from "@/types/invoice.types";
import { useSyncCurrencies } from "@/hooks/useSyncCurrencies";
import { useCurrencyStore } from "@/store/currency.store";

interface UpdateInvoiceFormProps {
    invoiceId: string;
}

function UpdateInvoiceFormSkeleton() {
    return (
        <div className="space-y-8 rounded-2xl ctm-shadow bg-white p-2 md:p-6">
            <Skeleton className="mx-auto h-8 w-52 md:mx-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2 space-y-3">
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
                    <Skeleton className="h-5 w-24" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-11 w-full rounded-md" />
                    </div>
                </div>
            </div>

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
                <Skeleton className="h-5 w-24" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-11 w-full rounded-md" />
                        </div>
                    ))}
                </div>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-24 w-full rounded-md" />
                <Skeleton className="h-11 w-full rounded-md" />
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-3 border-t border-border pt-5">
                <Skeleton className="h-11 w-[150px] rounded-md" />
                <Skeleton className="h-11 w-[110px] rounded-md" />
            </div>
        </div>
    );
}

export function UpdateInvoiceForm({ invoiceId }: UpdateInvoiceFormProps) {
    const { data: invoiceRes, isLoading: isInvoiceLoading } = useInvoice(invoiceId);
    const { data: clientsRes } = useClients({ limit: 100 });
    const { data: employeesRes } = useEmployees({ limit: 100 });
    const { mutate: updateInvoice, isPending } = useUpdateInvoice();

    const invoice = invoiceRes?.data;

    const clientList = useMemo(() => clientsRes?.data?.data || [], [clientsRes]);
    const employeeList = useMemo(() => employeesRes?.data?.data || [], [employeesRes]);

    const clientOptions = useMemo(
        () => clientList.map((c) => ({ label: c.name, value: c.id })),
        [clientList]
    );

    const employeeOptions = useMemo(
        () => employeeList.map((e) => ({ label: e.fullName, value: e.id })),
        [employeeList]
    );

    useSyncCurrencies();
    const currencyOptions = useCurrencyStore((s) => s.currencyOptions);

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, dirtyFields },
    } = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceFormSchema),
        defaultValues: {
            clientId: "",
            invoiceNumber: "",
            employeeId: "",
            service: "",
            includes: [],
            currency: "",
            totalPrice: 0,
            status: "باقي الدفع",
            notes: "",
            payments: [],
        },
    });

    // Resolve invoice.clientId/employeeId directly — invoice detail already
    // returns real ids (unlike daily-entries, which only stores names).
    useEffect(() => {
        if (!invoice) return;

        reset({
            clientId: invoice.clientId,
            employeeId: invoice.employeeId,
            invoiceNumber: invoice.invoiceNumber,
            service: invoice.service,
            includes: invoice.includes,
            currency: invoice.currency,
            totalPrice: invoice.totalPrice,
            status: invoice.status,
            notes: "",
            payments: [],
        });
    }, [invoice, reset]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "payments",
    });

    function onSubmit(values: InvoiceFormValues) {
        const payload: UpdateInvoicePayload = {};

        if (dirtyFields.clientId) payload.clientId = values.clientId;
        if (dirtyFields.employeeId) payload.employeeId = values.employeeId;
        if (dirtyFields.invoiceNumber) payload.invoiceNumber = values.invoiceNumber;
        if (dirtyFields.service) payload.service = values.service;
        if (dirtyFields.includes) payload.includes = values.includes;
        if (dirtyFields.currency) payload.currency = values.currency;
        if (dirtyFields.totalPrice) payload.totalPrice = values.totalPrice;
        if (dirtyFields.status) payload.status = values.status;

        const newPayments = (values.payments || [])
            .filter((p) => p.paidAmount && p.paymentDate)
            .map((p) => ({
                paidAmount: parseFloat(p.paidAmount),
                paymentDate: p.paymentDate,
            }));

        if (newPayments.length > 0) {
            payload.payments = newPayments;
        }

        if (Object.keys(payload).length === 0) return;

        updateInvoice({ id: invoiceId, payload });
    }

    if (isInvoiceLoading || !invoice) {
        return <UpdateInvoiceFormSkeleton />;
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-2xl ctm-shadow bg-white p-2 md:p-6"
        >
            <h1 className="text-[20px] md:text-[34px] font-bold text-[#171A1F] text-center md:text-right">
                تعديل الفاتورة
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2">
                    <FormSection title="بيانات العميل" gridClassName="md:!grid-cols-2">
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
                        <InvoiceTextField
                            label="رقم الفاتورة"
                            placeholder="ادخل رقم الفاتورة"
                            error={errors.invoiceNumber?.message}
                            {...register("invoiceNumber")}
                        />
                    </FormSection>
                </div>

                <FormSection title="بيانات الموظف" gridClassName="!grid-cols-1">
                    <Controller
                        control={control}
                        name="employeeId"
                        render={({ field }) => (
                            <SelectField
                                label="اسم الموظف"
                                placeholder="اختر الموظف"
                                value={field.value}
                                onChange={field.onChange}
                                options={employeeOptions}
                                error={errors.employeeId?.message}
                            />
                        )}
                    />
                </FormSection>
            </div>

            <FormSection title="تفاصيل الخدمة">
                <Controller
                    control={control}
                    name="service"
                    render={({ field }) => (
                        <SelectField
                            label="الخدمة"
                            placeholder="اختر الخدمة"
                            value={field.value}
                            onChange={field.onChange}
                            options={SERVICE_OPTIONS}
                            error={errors.service?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="includes"
                    render={({ field }) => (
                        <MultiSelectField
                            label="يشمل"
                            placeholder="ما يشمله البرنامج"
                            value={field.value}
                            onChange={field.onChange}
                            options={INCLUDES_OPTIONS}
                            error={errors.includes?.message}
                        />
                    )}
                />
            </FormSection>

            <FormSection title="تفاصيل السعر"  >
                <div className="col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4"  >
                    <InvoiceTextField
                    label="السعر الاجمالي"
                    type="number"
                    inputMode="decimal"
                    error={errors.totalPrice?.message}
                    {...register("totalPrice", { valueAsNumber: true })}
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
                </div>

                <div className="col-span-4 text-[#0F1219] text-[22px] font-bold"> الدفعات </div>

                {fields.length === 0 && (
                    <p className="col-span-4 text-muted-foreground text-[14px]">
                        لا توجد دفعات مسجلة — يمكنك إضافة دفعة جديدة أدناه.
                    </p>
                )}

                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-md p-4 rounded-md bg-white mb-5 relative"
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
                            type="number"
                            inputMode="decimal"
                            error={errors.payments?.[index]?.paidAmount?.message}
                            {...register(`payments.${index}.paidAmount`)}
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
                    </div>
                ))}

                <MainButton
                    type="button"
                    text="اضافة دفعة جديدة"
                    icon={<Plus className="h-4 w-4" />}
                    onClick={() => append({ paidAmount: "", paymentDate: "" })}
                    className="col-span-4"
                />
            </FormSection>

            <div className="flex flex-col md:flex-row md:items-center gap-3 border-t border-border pt-5">
                <MainButton
                    text={isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
                    icon={<Save className="h-4 w-4" />}
                    disabled={isPending}
                />
                <SecondaryButton
                    text="إلغاء"
                    icon={<X className="h-4 w-4" />}
                    href={`/dashboard/invoices/${invoiceId}`}
                />
            </div>
        </form>
    );
}