"use client";

import * as React from "react";
import { useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, X } from "lucide-react";

import {
    dailyEntryFormSchema,
    DailyEntryFormValues,
} from "@/validations/DailyEntry";
import { FormSection } from "../invoice/FormSection";
import { InvoiceTextField } from "../invoice/TextField";
import { SelectField } from "../invoice/SelectField";
import MainButton from "../shared/MainButton";
import SecondaryButton from "../shared/SecondaryButton";
import { DateField } from "../Datefield";

import { useClients } from "@/hooks/use-client";
import { useEmployees } from "@/hooks/use-employee";
import { useCreateDailyEntry } from "@/hooks/use-daily-entry";
import { useCurrencyStore } from "@/store/currency.store";
import { useSyncCurrencies } from "@/hooks/useSyncCurrencies";
import type { CreateDailyEntryPayload } from "@/types/daily-entry.types";
import { useExpensePaymentMethods } from "@/hooks/useExpenses";

export function CreateDailyEntryForm() {
    useSyncCurrencies();
    const currencyOptions = useCurrencyStore((s) => s.currencyOptions);

    const { data: clientsRes } = useClients({ limit: 100 });
    const { data: employeesRes } = useEmployees({ limit: 100 });
    const { mutate: createDailyEntry, isPending } = useCreateDailyEntry();

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

    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<DailyEntryFormValues>({
        resolver: zodResolver(dailyEntryFormSchema),
        defaultValues: {
            clientId: "",
            employeeId: "",
            checkIn: "",
            checkOut: "",
            destination: "",
            currency: "",
            totalCost: "",
            paidAmount: "",
            paymentDate: "",
            paymentMethod: "",
            bookingLines: [{ bookingPlace: "", serviceType: "", bookingPrice: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "bookingLines",
    });

    const { data: paymentMethodsRes } = useExpensePaymentMethods();

    const watchTotalCost = watch("totalCost");
    const watchPaidAmount = watch("paidAmount");
    const watchCurrency = watch("currency");

    const calculatedRemaining = useMemo(() => {
        const total = parseFloat(watchTotalCost || "0");
        const paid = parseFloat(watchPaidAmount || "0");
        if (isNaN(total)) return "";
        const rem = Math.max(0, total - (isNaN(paid) ? 0 : paid));
        return `${rem.toLocaleString()} ${watchCurrency || ""}`;
    }, [watchTotalCost, watchPaidAmount, watchCurrency]);

    const paymentMethodOptions = useMemo(() => {
        const list = paymentMethodsRes?.data || [];
        return list.map((pm) => ({ label: pm.name, value: pm.name }));
    }, [paymentMethodsRes]);

    function onSubmit(values: DailyEntryFormValues) {
        const selectedClient = clientList.find((c) => c.id === values.clientId);
        const selectedEmployee = employeeList.find((e) => e.id === values.employeeId);

        if (!selectedClient || !selectedEmployee) return;

        const payload: CreateDailyEntryPayload = {
            clientName: selectedClient.name,
            employeeName: selectedEmployee.fullName,
            checkIn: values.checkIn,
            checkOut: values.checkOut,
            currency: values.currency,
            destination: values.destination,
            totalCost: parseFloat(values.totalCost) || 0,
            paidAmount: parseFloat(values.paidAmount || "0") || 0,
            paymentDate: values.paymentDate || "",
            paymentMethod: values.paymentMethod || "",
            bookingLines: values.bookingLines.map((line) => ({
                bookingPlace: line.bookingPlace,
                serviceType: line.serviceType,
                bookingPrice: parseFloat(line.bookingPrice) || 0,
            })),
        };

        createDailyEntry(payload);
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-2xl ctm-shadow bg-white p-2 md:p-6"
        >
            <h1 className="text-[20px] md:text-[34px] font-bold text-[#171A1F] text-center md:text-right">
                إضافة قيد يومي جديد
            </h1>
            <p className="-mt-6 text-[15px] md:text-[18px] text-[#171A1F] text-center md:text-right">
                تسجيل حجوزات العميل الجديدة ومتابعة تفاصيل الدفع الخاصة بها.
            </p>

            <FormSection title="بيانات العميل والموظف" gridClassName="md:!grid-cols-3">
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

                <InvoiceTextField
                    label="الوجهة"
                    placeholder="القاهرة"
                    error={errors.destination?.message}
                    {...register("destination")}
                />
            </FormSection>

            <FormSection title="تفاصيل الإقامة" gridClassName="md:!grid-cols-3">
                <Controller
                    control={control}
                    name="checkIn"
                    render={({ field }) => (
                        <DateField
                            label="Check in"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.checkIn?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="checkOut"
                    render={({ field }) => (
                        <DateField
                            label="Check out"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.checkOut?.message}
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
            </FormSection>

            <FormSection title="الحجوزات">
                <div className="col-span-4 text-[#0F1219] text-[22px] font-bold"> الحجوزات </div>

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
                            label="مكان الحجز"
                            placeholder="اكبر"
                            error={errors.bookingLines?.[index]?.bookingPlace?.message}
                            {...register(`bookingLines.${index}.bookingPlace`)}
                        />

                        <InvoiceTextField
                            label="نوع الحجز"
                            placeholder="طيران دولي"
                            error={errors.bookingLines?.[index]?.serviceType?.message}
                            {...register(`bookingLines.${index}.serviceType`)}
                        />

                        <InvoiceTextField
                            label="سعر الحجز"
                            placeholder="3000"
                            type="number"
                            error={errors.bookingLines?.[index]?.bookingPrice?.message}
                            {...register(`bookingLines.${index}.bookingPrice`)}
                        />
                    </div>
                ))}

                <MainButton
                    type="button"
                    text="اضافة حجز جديد"
                    icon={<Plus className="h-4 w-4" />}
                    onClick={() =>
                        append({ bookingPlace: "", serviceType: "", bookingPrice: "" })
                    }
                />
            </FormSection>

            <FormSection title="تفاصيل الدفع">
                <InvoiceTextField
                    label="اجمالي التكلفة"
                    placeholder="5000"
                    type="number"
                    error={errors.totalCost?.message}
                    {...register("totalCost")}
                />

                <InvoiceTextField
                    label="المبلغ المسدد"
                    placeholder="3000"
                    type="number"
                    error={errors.paidAmount?.message}
                    {...register("paidAmount")}
                />

                <Controller
                    control={control}
                    name="paymentDate"
                    render={({ field }) => (
                        <DateField
                            label="تاريخ الدفع"
                            value={field.value || ""}
                            onChange={field.onChange}
                            error={errors.paymentDate?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <SelectField
                            label="وسيلة الدفع"
                            placeholder="اختر وسيلة الدفع"
                            value={field.value || ""}
                            onChange={field.onChange}
                            options={paymentMethodOptions}
                            error={errors.paymentMethod?.message}
                        />
                    )}
                />

                <div className="space-y-1.5">
                    <span className="text-[14px] font-semibold text-[#232323] md:text-[17px]">
                        المبلغ المتبقي
                    </span>
                    <div className="flex h-[47px] w-full select-none hover:border-[#837CC9] px-4 shadow-sm items-center rounded-xl border border-[#C8C2FC] transition-colors duration-200 bg-white text-[15px] font-medium text-[#232323] mt-1.5">
                        {calculatedRemaining}
                    </div>
                </div>
            </FormSection>

            <div className="flex items-center gap-3 pt-5">
                <MainButton
                    text={isPending ? "جاري الحفظ..." : "حفظ"}
                    icon={<Save className="h-4 w-4" />}
                    disabled={isPending}
                />
                <SecondaryButton
                    text="إلغاء"
                    icon={<X className="h-4 w-4" />}
                    href="/dashboard/daily-entries"
                />
            </div>
        </form>
    );
}