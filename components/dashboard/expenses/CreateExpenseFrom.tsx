"use client";

import * as React from "react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";



import { FormSection } from "../invoice/FormSection";
import { InvoiceTextField } from "../invoice/TextField";
import { SelectField } from "../invoice/SelectField";
import { FieldLabel } from "../invoice/FieldLabel";
import MainButton from "../MainButton";

import { AmountField } from "./AmountField";
import { DateTimeField } from "./DateTimeField";
import { SingleAttachmentDropzone } from "./SingleAttachmentDropzone";
import { ACCOUNT_OPTIONS, EXPENSE_CATEGORY_OPTIONS, expenseFormSchema, ExpenseFormValues } from "@/validations/ExpenseSettlement";
import { CURRENCY_OPTIONS, PAYMENT_METHOD_OPTIONS } from "@/validations/CreditAccount";
import { Card } from "@/components/ui/card";

interface CreateExpenseFormProps {
    onSaveDraft?: (values: Partial<ExpenseFormValues>) => void;
    onSaveExpense?: (values: ExpenseFormValues) => void;
}

export function CreateExpenseForm({
    onSaveDraft,
    onSaveExpense,
}: CreateExpenseFormProps) {
    const {
        control,
        register,
        handleSubmit,
        getValues,
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

    function handleAttachmentSelect(file: File) {
        attachmentRef.current = file;
        // TODO: upload logic here, e.g. call your API or set form state
    }

    function handleSaveDraft() {
        // Drafts are saved as-is, without requiring full validation.
        onSaveDraft?.(getValues());
    }

    function onSubmit(values: ExpenseFormValues) {
        onSaveExpense?.(values);
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-2xl bg-white p-6 ctm-shadow"
        >
            <div>
                <h2 className="text-[24px] font-bold text-[#0F1219]">
                    إضافة مصروف جديد
                </h2>
                <p className="mt-1 font-medium text-[16px] text-[#0F1219]">
                    تسجيل مصروف جديد وإرفاق المستندات المرتبطة به.
                </p>
            </div>


            <Card className="border py-10 px-5 border-[#0000001C] bg-[#eeeeee60]" >
                <Controller
                    control={control}
                    name="amount"
                    render={({ field: amountField }) => (
                        <Controller
                            control={control}
                            name="currency"
                            render={({ field: currencyField }) => (
                                <AmountField
                                    label="المبلغ"
                                    required
                                    currency={currencyField.value}
                                    onCurrencyChange={currencyField.onChange}
                                    currencyOptions={CURRENCY_OPTIONS}
                                    amount={amountField.value}
                                    onAmountChange={amountField.onChange}
                                    error={errors.amount?.message}
                                    className="flex items-center gap-4"
                                />
                            )}
                        />
                    )}
                />
            </Card>

            <div className="grid grid-cols-3 items-center gap-4 "  >
                <FormSection title="معلومات المصروف" className="col-span-2" gridClassName="!grid-cols-2">
                    <Controller
                        control={control}
                        name="category"
                        render={({ field }) => (
                            <SelectField
                                label="فئة المصروف"
                                placeholder="اختر فئة المصروف"
                                value={field.value}
                                onChange={field.onChange}
                                options={EXPENSE_CATEGORY_OPTIONS}
                                error={errors.category?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="expenseDate"
                        render={({ field }) => (
                            <DateTimeField
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
                                options={PAYMENT_METHOD_OPTIONS}
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
                                options={ACCOUNT_OPTIONS}
                                error={errors.account?.message}
                            />
                        )}
                    />
                </FormSection>


                <SingleAttachmentDropzone
                    onFileSelect={handleAttachmentSelect}
                    className="h-full"
                />
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

            <Card className="px-5 border  bg-[#eeeeee60]" >
                <FieldLabel htmlFor="notes" dropdown={false}>
                    <span className="mb-2 text-[18px] text-[#232323]">ملاحظات</span>
                </FieldLabel>
                <Textarea
                    id="notes"
                    className="h-[132px] border border-[#C0C0C0] text-[15px] md:text-[16px]"
                    placeholder="اضف وصف..."
                    {...register("notes")}
                />
            </Card>

            <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
                <MainButton
                    text="حفظ المصروف"
                    icon={<Save className="h-4 w-4" />}
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="h-[47px] w-[130px] gap-2 rounded-lg text-[16px]"
                >
                    <X className="h-4 w-4" />
                    حفظ كمسودة
                </Button>
            </div>
        </form>
    );
}