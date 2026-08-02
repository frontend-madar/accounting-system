"use client";

import * as React from "react";
import { useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Printer, X } from "lucide-react";

import {
    INCLUDES_OPTIONS,
    invoiceFormSchema,
    InvoiceFormValues,
    NOTE_OPTIONS,
    SERVICE_OPTIONS,
    STATUS_OPTIONS,
} from "@/validations/Invoice";
import { FormSection } from "./FormSection";
import { InvoiceTextField } from "./TextField";
import { SelectField } from "./SelectField";
import { MultiSelectField } from "./MultiSelectField";
import { DateField } from "../Datefield";
import MainButton from "../shared/MainButton";

import { useClients } from "@/hooks/use-client";
import { useEmployees } from "@/hooks/use-employee";
import { useCreateInvoice } from "@/hooks/use-invoice";
import type { CreateInvoicePayload } from "@/types/invoice.types";
import { useSyncCurrencies } from "@/hooks/useSyncCurrencies";
import { useCurrencyStore } from "@/store/currency.store";

interface CreateInvoiceFormProps {
    onSaveDraft?: (values: Partial<InvoiceFormValues>) => void;
}

export function CreateInvoiceForm({
    onSaveDraft,
}: CreateInvoiceFormProps) {
    const { data: clientsRes } = useClients({ limit: 100 });
    const { data: employeesRes } = useEmployees({ limit: 100 });
    const { mutate: createInvoice, isPending } = useCreateInvoice();

    const clientOptions = useMemo(() => {
        const list = clientsRes?.data?.data || [];
        return list.map((c) => ({ label: c.name, value: c.id }));
    }, [clientsRes]);

    const employeeOptions = useMemo(() => {
        const list = employeesRes?.data?.data || [];
        return list.map((e) => ({ label: e.fullName, value: e.id }));
    }, [employeesRes]);

    useSyncCurrencies();
    const currencyOptions = useCurrencyStore((s) => s.currencyOptions);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceFormSchema),
        defaultValues: {
            clientId: "",
            invoiceNumber: "",
            employeeId: "",
            phoneNumber: "",
            service: "",
            includes: [],
            currency: "",
            totalPrice: 0,
            status: "باقي الدفع",
            notes: "",
            payments: [{ paidAmount: "", paymentDate: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "payments",
    });

    function onSubmit(values: InvoiceFormValues) {
        const payments = (values.payments || [])
            .filter((p) => p.paidAmount && p.paymentDate)
            .map((p) => ({
                paidAmount: parseFloat(p.paidAmount),
                paymentDate: p.paymentDate,
            }));

        const payload: CreateInvoicePayload = {
            invoiceNumber: values.invoiceNumber,
            currency: values.currency,
            clientId: values.clientId,
            employeeId: values.employeeId,
            service: values.service,
            includes: values.includes,
            totalPrice: values.totalPrice,
            status: values.status,
            payments: payments.length > 0 ? payments : undefined,
        };

        createInvoice(payload);
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-2xl  ctm-shadow bg-white p-2 md:p-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2" >
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
                                label="اسم الموظف "
                                placeholder="اختر الموظف "
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

            <FormSection title="تفاصيل السعر">
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

                <div className="col-span-4 text-[#0F1219] text-[22px] font-bold"> الدفعات </div>

                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-md p-4 rounded-md bg-white mb-5 relative"
                    >
                        {fields.length > 1 && (
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="absolute left-3 top-3 text-muted-foreground hover:text-red-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}

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
                />
            </FormSection>

            <div className="flex flex-col md:flex-row md:items-center gap-3 border-t border-border pt-5">
                <MainButton
                    text={isPending ? "جاري الحفظ..." : "حفظ وطباعة الفاتورة"}
                    icon={<Printer className="h-4 w-4" />}
                    disabled={isPending}
                />
            </div>
        </form>
    );
}