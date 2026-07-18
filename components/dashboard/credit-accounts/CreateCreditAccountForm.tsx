"use client";

import * as React from "react";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Plus, Printer, Save, X } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import {
    creditAccountFormSchema,
    CreditAccountFormValues,
    CUSTOMER_OPTIONS,
    EMPLOYEE_OPTIONS,
    CURRENCY_OPTIONS,
    PAYMENT_DATE_OPTIONS,
    PAYMENT_METHOD_OPTIONS,
    STATUS_OPTIONS,
} from "@/validations/CreditAccount";
import { FormSection } from "../invoice/FormSection";
import { InvoiceTextField } from "../invoice/TextField";
import { SelectField } from "../invoice/SelectField";


interface CreateCreditAccountFormProps {
    invoiceNumber?: string;
    onSaveDraft?: (values: Partial<CreditAccountFormValues>) => void;
    onSaveAndPrint?: (values: CreditAccountFormValues) => void;
}

export function CreateCreditAccountForm({
    onSaveDraft,
}: CreateCreditAccountFormProps) {
    const {
        control,
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<CreditAccountFormValues>({
        resolver: zodResolver(creditAccountFormSchema),
        defaultValues: {
            clientName: "",
            employeeName: "",
            invoiceNumber: "",
            paymentDate: "",
            currency: "",
            totalAmount: "",
            paidAmount: "",
            remainingAmount: "",
            paymentMethod: "",
            status: "",
        },
    });



    function handleSaveDraft() {
        // Drafts are saved as-is, without requiring full validation.
        onSaveDraft?.(getValues());
    }

    function onSubmit(values: CreditAccountFormValues) {
        console.log(values);
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-2xl  ctm-shadow bg-white p-6"
        >

            <h1 className="text-[20px] md:text-[34px] font-bold text-[#171A1F] text-center md:text-right">  إضافة حساب جديد  </h1>
            <p className="-mt-6 text-[15px] md:text-[18px] text-[##171A1F] text-center md:text-right">
                إضافة بيانات عميل جديد لتسجيل معاملاته المالية ومتابعة أرصدته المستحقة.
            </p>

            <FormSection title="بيانات العميل" gridClassName="items-end">
                <Controller
                    control={control}
                    name="clientName"
                    render={({ field }) => (
                        <SelectField
                            label="اسم العميل"
                            placeholder="اختر العميل"
                            value={field.value}
                            onChange={field.onChange}
                            options={CUSTOMER_OPTIONS}
                            error={errors.clientName?.message}
                        />
                    )}
                />


                <Button className="border border-[#837CC9] text-[#40369F] bg-white text-[18px] h-[50px] w-[167px] hover:text-[white] hover:bg-[#40369F]">
                    اضافة حساب جديد
                </Button>


            </FormSection>

            <FormSection title="   ">


                <Controller
                    control={control}
                    name="employeeName"
                    render={({ field }) => (
                        <SelectField
                            label="اسم الموظف المسؤول"
                            placeholder="اختر الموظف المسؤول"
                            value={field.value}
                            onChange={field.onChange}
                            options={EMPLOYEE_OPTIONS}
                            error={errors.employeeName?.message}
                        />
                    )}
                />

                <InvoiceTextField
                    label="رقم الفاتورة"
                    placeholder=" INV-2026-1025 "
                    error={errors.invoiceNumber?.message}

                    {...register("invoiceNumber")}
                />

                <Controller
                    control={control}
                    name="paymentDate"
                    render={({ field }) => (
                        <SelectField
                            label="تاريخ الدفع"
                            placeholder="اختر تاريخ الدفع"
                            value={field.value}
                            onChange={field.onChange}
                            options={PAYMENT_DATE_OPTIONS}
                            error={errors.paymentDate?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="currency"
                    render={({ field }) => (
                        <SelectField
                            label="العملة"
                            placeholder="EGP جنيه مصري"
                            value={field.value}
                            onChange={field.onChange}
                            options={CURRENCY_OPTIONS}
                            error={errors.currency?.message}
                        />
                    )}
                />

                <InvoiceTextField
                    label="المبلغ الكلي"
                    placeholder="EGP 15,000"
                    error={errors.totalAmount?.message}
                    {...register("totalAmount")}
                />

                <InvoiceTextField
                    label="المدفوع"
                    placeholder="  EGP 15,000  "
                    error={errors.paidAmount?.message}

                    {...register("paidAmount")}
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
                            options={PAYMENT_METHOD_OPTIONS}
                            error={errors.paymentMethod?.message}
                        />
                    )}
                />

                <InvoiceTextField
                    label=" المتبقي "
                    value={'EGP 5,000'}
                    error={errors.remainingAmount?.message}
                    {...register("remainingAmount")}
                    disabled
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



            <div className="flex items-center gap-3 pt-5">
                <Button type="submit" className="gap-2 w-[246px] text-[18px] h-[47px] rounded-lg bg-[#463BAF] hover:bg-[#332a80]">
                    <Plus className="h-4 w-4" />
                    حفظ العميل
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="gap-2 rounded-lg w-[110px] h-[47px] text-[18px]"
                >
                    <X className="h-4 w-4" />
                    إلغاء
                </Button>
            </div>
        </form>
    );
}