"use client";

import * as React from "react";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Printer, Save } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    CLIENT_OPTIONS,
    INCLUDES_OPTIONS,
    invoiceFormSchema,
    InvoiceFormValues,
    NOTE_OPTIONS,
    SERVICE_OPTIONS,
} from "@/validations/Invoice";
import { FormSection } from "./FormSection";
import { InvoiceTextField } from "./TextField";
import { SelectField } from "./SelectField";
import { MultiSelectField } from "./MultiSelectField";
import { QuantityStepper } from "./QuantityStepper";
import { FieldLabel } from "./FieldLabel";
import { DateField } from "../Datefield";

// Demo lookup — in a real app this would come from your clients API/table.
const CLIENT_DETAILS: Record<string, { name: string; phone: string }> = {
    "10242": { name: "محمد العنزي", phone: "966345276126" },
    "10243": { name: "سارة القحطاني", phone: "966501112233" },
    "10244": { name: "خالد الدوسري", phone: "966559998877" },
};

interface CreateInvoiceFormProps {
    invoiceNumber?: string;
    onSaveDraft?: (values: Partial<InvoiceFormValues>) => void;
    onSaveAndPrint?: (values: InvoiceFormValues) => void;
}

export function CreateInvoiceForm({
    invoiceNumber = "676534",
    onSaveDraft,
    onSaveAndPrint,
}: CreateInvoiceFormProps) {
    const {
        control,
        register,
        handleSubmit,
        setValue,
        watch,
        getValues,
        formState: { errors },
    } = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceFormSchema),
        defaultValues: {
            clientId: "",
            clientName: "",
            clientPhone: "",
            invoiceNumber,
            employeeName: "",
            employeePhone: "",
            service: "",
            includes: [],
            quantity: 1,
            paymentDate: "",
            totalPrice: 0,
            paidAmount: 0,
            notes: "",
        },
    });

    const totalPrice = watch("totalPrice");
    const paidAmount = watch("paidAmount");
    const remaining = useMemo(
        () => Math.max(0, (totalPrice || 0) - (paidAmount || 0)),
        [totalPrice, paidAmount]
    );

    function handleClientChange(clientId: string) {
        setValue("clientId", clientId, { shouldValidate: true });
        const details = CLIENT_DETAILS[clientId];
        if (details) {
            setValue("clientName", details.name, { shouldValidate: true });
            setValue("clientPhone", details.phone, { shouldValidate: true });
        }
    }

    function handleSaveDraft() {
        // Drafts are saved as-is, without requiring full validation.
        onSaveDraft?.(getValues());
    }

    function onSubmit(values: InvoiceFormValues) {
        onSaveAndPrint?.(values);
    }

    return (
        <form
            dir="rtl"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-2xl  ctm-shadow bg-white p-6"
        >
            <FormSection title="بيانات العميل">
                <InvoiceTextField
                    label="اسم العميل"
                    placeholder="ادخل اسم العميل"
                    error={errors.clientName?.message}
                    {...register("clientName")}
                />
                <InvoiceTextField
                    label="رقم الجوال"
                    placeholder="ادخل رقم الجوال"
                    inputMode="tel"
                    error={errors.clientPhone?.message}
                    {...register("clientPhone")}
                />
                <InvoiceTextField
                    label="رقم الفاتورة"
                    error={errors.invoiceNumber?.message}
                    {...register("invoiceNumber")}
                    readOnly
                />
                <Controller
                    control={control}
                    name="clientId"
                    render={({ field }) => (
                        <SelectField
                            label="رقم العميل"
                            placeholder="اختر العميل"
                            value={field.value}
                            onChange={handleClientChange}
                            options={CLIENT_OPTIONS}
                            error={errors.clientId?.message}
                        />
                    )}
                />
            </FormSection>

            <FormSection title="بيانات الموظف">
                <InvoiceTextField
                    label="اسم الموظف"
                    placeholder="ادخل اسم الموظف"
                    error={errors.employeeName?.message}
                    {...register("employeeName")}
                />
                <InvoiceTextField
                    label="رقم الهاتف"
                    placeholder="ادخل رقم الهاتف"
                    inputMode="tel"
                    error={errors.employeePhone?.message}
                    {...register("employeePhone")}
                />
            </FormSection>

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
                <Controller
                    control={control}
                    name="quantity"
                    render={({ field }) => (
                        <QuantityStepper
                            label="العدد"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.quantity?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="paymentDate"
                    render={({ field }) => (
                        <DateField
                            label="تاريخ الدفع"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.paymentDate?.message}
                        />
                    )}
                />
            </FormSection>

            <FormSection title="تفاصيل السعر" className=" ">
                <InvoiceTextField
                    label="السعر الاجمالي"
                    type="number"
                    inputMode="decimal"
                    error={errors.totalPrice?.message}
                    {...register("totalPrice", { valueAsNumber: true })}
                />
                <InvoiceTextField
                    label="تم دفع"
                    type="number"
                    inputMode="decimal"
                    error={errors.paidAmount?.message}
                    {...register("paidAmount", { valueAsNumber: true })}
                />
                <div className="space-y-1.5">
                    <FieldLabel> <span className="text-[#232323] text-[14px] md:text-[18px] mb-2">باقي</span> </FieldLabel>
                    <div className="flex h-11 ctm-inp  items-center rounded-lg border border-dashed border-input bg-muted/30 px-3 text-sm text-muted-foreground">
                        {remaining.toLocaleString("ar-SA")}
                    </div>
                </div>
                <Controller
                    control={control}
                    name="notes"
                    render={({ field }) => (
                        <SelectField
                            label="ملاحظات"
                            placeholder="اختر السبب"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            options={NOTE_OPTIONS}
                        />
                    )}
                />
            </FormSection>

            <div className="flex flex-col md:flex-row md:items-center gap-3 border-t border-border pt-5">
                <Button type="submit" className="gap-2 w-[246px] text-[18px] h-[47px] rounded-lg bg-[#463BAF] hover:bg-[#332a80]">
                    <Printer className="h-4 w-4" />
                    حفظ وطباعة الفاتورة
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="gap-2 rounded-lg w-[246px] h-[47px] text-[18px]"
                >
                    <Save className="h-4 w-4" />
                    حفظ كمسودة
                </Button>
            </div>
        </form>
    );
}