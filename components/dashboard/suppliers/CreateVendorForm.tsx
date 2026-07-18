"use client";

import { useEffect, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { FormSection } from "../invoice/FormSection";
import { InvoiceTextField } from "../invoice/TextField";
import { SelectField } from "../invoice/SelectField";
import MainButton from "../MainButton";
import {
    CURRENCY_OPTIONS,
    VENDOR_SERVICE_TYPE_OPTIONS,
    vendorFormSchema,
    VendorFormValues,
} from "@/validations/Vendorsettlement";
import SecondaryButton from "../SecondaryButton";

interface CreateVendorFormProps {
    onSaveDraft?: (values: Partial<VendorFormValues>) => void;
    onSaveVendor?: (values: VendorFormValues) => void;
}

export function CreateVendorForm({
    onSaveDraft,
    onSaveVendor,
}: CreateVendorFormProps) {
    const {
        control,
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<VendorFormValues>({
        resolver: zodResolver(vendorFormSchema),
        defaultValues: {
            currency: "EGP",
            clientName: "",
            clientNumber: "",
            vendorName: "",
            serviceType: "",
            vendorPhone: "",
            travelDate: "",
            servicePrice: "",
            paidAmount: "",
            remainingAmount: "",
            notes: "",
        },
    });

    const attachmentRef = useRef<File | null>(null);

    const servicePrice = useWatch({ control, name: "servicePrice" });
    const paidAmount = useWatch({ control, name: "paidAmount" });

    useEffect(() => {
        const price = Number(servicePrice);
        const paid = Number(paidAmount);

        if (!Number.isNaN(price) && !Number.isNaN(paid)) {
            const remaining = price - paid;
            setValue("remainingAmount", remaining >= 0 ? String(remaining) : "0", {
                shouldValidate: true,
            });
        }
    }, [servicePrice, paidAmount, setValue]);

    function handleAttachmentSelect(file: File) {
        attachmentRef.current = file;
        // TODO: upload logic here, e.g. call your API or set form state
    }

    function handleSaveDraft() {
        // Drafts are saved as-is, without requiring full validation.
        onSaveDraft?.(getValues());
    }

    function onSubmit(values: VendorFormValues) {
        onSaveVendor?.(values);
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-2xl bg-white p-6 ctm-shadow"
        >
            <div>
                <h2 className="text-[24px] font-bold text-[#0F1219]">
                    إضافة مورد
                </h2>
                <p className="mt-1 font-medium text-[16px] text-[#0F1219]">
                    إضافة بيانات مورد جديد.
                </p>
            </div>

            <FormSection title=" بيانات المورد والعميل  " className="col-span-2" gridClassName="!grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3">
                <InvoiceTextField
                    label="اسم العميل"
                    placeholder="ادخل اسم العميل"
                    error={errors.clientName?.message}
                    {...register("clientName")}
                />
                <InvoiceTextField
                    label="رقم العميل"
                    placeholder="ادخل رقم العميل"
                    inputMode="numeric"
                    error={errors.clientNumber?.message}
                    {...register("clientNumber")}
                />
                <InvoiceTextField
                    label="اسم المورد"
                    placeholder="ادخل اسم المورد"
                    error={errors.vendorName?.message}
                    {...register("vendorName")}
                />
            </FormSection>

            <FormSection title=" بيانات الخدمة  " gridClassName="!grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3">
                <Controller
                    control={control}
                    name="serviceType"
                    render={({ field }) => (
                        <SelectField
                            label="نوع الخدمة"
                            placeholder="اختر نوع الخدمة"
                            value={field.value}
                            onChange={field.onChange}
                            options={VENDOR_SERVICE_TYPE_OPTIONS}
                            error={errors.serviceType?.message}
                        />
                    )}
                />
                <InvoiceTextField
                    label="رقم الهاتف"
                    placeholder="ادخل رقم الهاتف"
                    inputMode="tel"
                    error={errors.vendorPhone?.message}
                    {...register("vendorPhone")}
                />
                <InvoiceTextField
                    label="تاريخ السفر"
                    placeholder="اختر تاريخ السفر"
                    type="date"
                    error={errors.travelDate?.message}
                    {...register("travelDate")}
                />
            </FormSection>

            <FormSection title="بيانات الدفع">
                <Controller
                    control={control}
                    name="currency"
                    render={({ field }) => (
                        <SelectField
                            label=" العملة "
                            placeholder="اختر العملة"
                            value={field.value}
                            onChange={field.onChange}
                            options={CURRENCY_OPTIONS}
                            error={errors.currency?.message}
                        />
                    )}
                />
                <InvoiceTextField
                    label="  سعر الخدمة    "
                    placeholder="ادخل سعر الخدمة"
                    inputMode="numeric"
                    error={errors.servicePrice?.message}
                    {...register("servicePrice")}
                />
                <InvoiceTextField
                    label="    المدفوع     "
                    placeholder="ادخل المبلغ المدفوع"
                    inputMode="numeric"
                    error={errors.paidAmount?.message}
                    {...register("paidAmount")}
                />
                <InvoiceTextField
                    label="    المتبقي    "
                    placeholder="0"
                    inputMode="numeric"
                    readOnly
                    error={errors.remainingAmount?.message}
                    {...register("remainingAmount")}
                />
            </FormSection>

            <div className="flex items-center  gap-3 border-t border-border pt-5">
                <MainButton
                    text=" حفظ المورد  "
                    icon={<Save className="h-4 w-4" />}
                />
                <SecondaryButton
                    text="إلغاء"
                    icon={< X className="h-4 w-4" />}
                    className="!w-[110px]"
                />
            </div>
        </form>
    );
}