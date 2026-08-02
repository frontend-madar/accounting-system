"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { useMemo } from "react";
import { FormSection } from "../invoice/FormSection";
import { InvoiceTextField } from "../invoice/TextField";
import { SelectField } from "../invoice/SelectField";
import { MultiSelectField } from "../invoice/MultiSelectField";
import {
    supplierFormSchema,
    SupplierFormValues,
    SUPPLIER_CURRENCY_OPTIONS,
    SUPPLIER_SERVICE_TYPE_OPTIONS,
} from "@/validations/supplier-schema";
import { useCreateSupplier } from "@/hooks/use-supplier";
import { useGetClients } from "@/hooks/use-client";
import MainButton from "../shared/MainButton";
import SecondaryButton from "../shared/SecondaryButton";
import { useSyncCurrencies } from "@/hooks/useSyncCurrencies";
import { useCurrencyStore } from "@/store/currency.store";
import { DateField } from "../Datefield";

const EMPTY_VALUES: SupplierFormValues = {
    supplierName: "",
    supplierPhone: "",
    clientName: "",
    serviceTypes: [],
    travelDate: "",
    returnDate: "",
    currency: "SAR",
    servicePrice: "",
    amountPaid: "",
};

export function CreateSupplierForm() {
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SupplierFormValues>({
        resolver: zodResolver(supplierFormSchema),
        defaultValues: EMPTY_VALUES,
    });

    const { mutate: createSupplier, isPending } = useCreateSupplier();

    const {
        data: clients,
        isLoading: isClientsLoading,
        isError: isClientsError,
    } = useGetClients();

    const clientOptions = useMemo(
        () => clients.map((client) => ({ label: client.name, value: client.name })),
        [clients]
    );

    useSyncCurrencies();
    const currencyOptions = useCurrencyStore((s) => s.currencyOptions);

    function onSubmit(values: SupplierFormValues) {
        createSupplier({
            supplierName: values.supplierName,
            supplierPhone: values.supplierPhone,
            clientName: values.clientName,
            serviceTypes: values.serviceTypes,
            travelDate: new Date(values.travelDate).toISOString(),
            returnDate: new Date(values.returnDate).toISOString(),
            currency: values.currency,
            servicePrice: Number(values.servicePrice),
            amountPaid: Number(values.amountPaid),
        });
    }

    function handleCancel() {
        reset(EMPTY_VALUES);
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-2xl bg-white p-6 ctm-shadow"
        >
            <div>
                <h2 className="text-[24px] font-bold text-[#0F1219]">إضافة مورد</h2>
                <p className="mt-1 font-medium text-[16px] text-[#0F1219]">
                    إضافة بيانات مورد جديد.
                </p>
            </div>

            <FormSection title="بيانات المورد والعميل" gridClassName="!grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3">
                <InvoiceTextField
                    label="اسم المورد"
                    placeholder="ادخل اسم المورد"
                    error={errors.supplierName?.message}
                    {...register("supplierName")}
                />
                <InvoiceTextField
                    label="رقم هاتف المورد"
                    placeholder="ادخل رقم هاتف المورد"
                    inputMode="tel"
                    error={errors.supplierPhone?.message}
                    {...register("supplierPhone")}
                />
                <Controller
                    control={control}
                    name="clientName"
                    render={({ field }) => (
                        <SelectField
                            label="اسم العميل"
                            placeholder={
                                isClientsLoading
                                    ? "جاري تحميل العملاء..."
                                    : isClientsError
                                        ? "تعذر تحميل العملاء"
                                        : "اختر اسم العميل"
                            }
                            value={field.value}
                            onChange={field.onChange}
                            options={clientOptions}
                            error={errors.clientName?.message}
                        />
                    )}
                />
            </FormSection>

            <FormSection title="بيانات الخدمة" gridClassName="!grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3">
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
                <Controller
                    control={control}
                    name="returnDate"
                    render={({ field }) => (
                        <DateField
                            label="تاريخ العودة"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.returnDate?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="serviceTypes"
                    render={({ field }) => (
                        <MultiSelectField
                            label="نوع الخدمة"
                            placeholder="اختر نوع الخدمة"
                            value={field.value}
                            onChange={field.onChange}
                            options={SUPPLIER_SERVICE_TYPE_OPTIONS}
                            error={errors.serviceTypes?.message}
                        />
                    )}
                />
            </FormSection>

            <FormSection title="بيانات الدفع" gridClassName="!grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3">
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
                    label="سعر الخدمة"
                    placeholder="ادخل سعر الخدمة"
                    inputMode="numeric"
                    error={errors.servicePrice?.message}
                    {...register("servicePrice")}
                />
                <InvoiceTextField
                    label="المدفوع"
                    placeholder="ادخل المبلغ المدفوع"
                    inputMode="numeric"
                    error={errors.amountPaid?.message}
                    {...register("amountPaid")}
                />
            </FormSection>

            <div className="flex items-center gap-3 border-t border-border pt-5">
                <MainButton text="حفظ المورد" icon={<Save className="h-4 w-4" />} disabled={isPending} />
                <SecondaryButton
                    type="button"
                    text="إلغاء"
                    icon={<X className="h-4 w-4" />}
                    className="!w-[110px]"
                    onClick={handleCancel}
                />
            </div>
        </form>
    );
}