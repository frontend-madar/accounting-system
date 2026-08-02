// components/dashboard/vendors/UpdateSupplierForm.tsx
"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";

import { FormSection } from "../invoice/FormSection";
import { InvoiceTextField } from "../invoice/TextField";
import { SelectField } from "../invoice/SelectField";
import { MultiSelectField } from "../invoice/MultiSelectField"; 
import MainButton from "../shared/MainButton";
import SecondaryButton from "../shared/SecondaryButton";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useSupplier, useUpdateSupplier } from "@/hooks/use-supplier";
import { useGetClients } from "@/hooks/use-client";
import {
    supplierFormSchema,
    SupplierFormValues,
    SUPPLIER_CURRENCY_OPTIONS,
    SUPPLIER_SERVICE_TYPE_OPTIONS,
} from "@/validations/supplier-schema";
import type { UpdateSupplierPayload } from "@/types/supplier.types";
import { useSyncCurrencies } from "@/hooks/useSyncCurrencies";
import { useCurrencyStore } from "@/store/currency.store";

interface UpdateSupplierFormProps {
    supplierId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/** Converts an ISO date string to the yyyy-MM-dd shape <input type="date"> expects. */
function toDateInputValue(iso: string): string {
    return iso ? iso.slice(0, 10) : "";
}

function UpdateSupplierFormSkeleton() {
    return (
        <div className="space-y-8 pt-2">
            <div>
                <Skeleton className="h-5 w-40 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-11 w-full rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <Skeleton className="h-5 w-32 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-11 w-full rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <Skeleton className="h-5 w-28 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-11 w-full rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
                <Skeleton className="h-11 w-[130px] rounded-xl" />
                <Skeleton className="h-11 w-[150px] rounded-xl" />
            </div>
        </div>
    );
}

export function UpdateSupplierForm({ supplierId, open, onOpenChange }: UpdateSupplierFormProps) {
    const { data: supplierRes, isLoading: isSupplierLoading } = useSupplier(open ? supplierId : null);
    const supplier = supplierRes?.data;

    const { mutate: updateSupplier, isPending } = useUpdateSupplier();

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

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, dirtyFields },
    } = useForm<SupplierFormValues>({
        resolver: zodResolver(supplierFormSchema),
        values: supplier
            ? {
                supplierName: supplier.supplierName,
                supplierPhone: supplier.supplierPhone,
                clientName: supplier.clientName,
                serviceTypes: supplier.serviceTypes,
                travelDate: toDateInputValue(supplier.travelDate),
                returnDate: toDateInputValue(supplier.returnDate),
                currency: supplier.currency,
                servicePrice: String(supplier.servicePrice),
                amountPaid: String(supplier.amountPaid),
            }
            : undefined,
    });

    function onSubmit(values: SupplierFormValues) {
        if (!supplier) return;

        // Only send fields the user actually touched.
        const payload: UpdateSupplierPayload = {};

        if (dirtyFields.supplierName) payload.supplierName = values.supplierName;
        if (dirtyFields.supplierPhone) payload.supplierPhone = values.supplierPhone;
        if (dirtyFields.clientName) payload.clientName = values.clientName;
        if (dirtyFields.serviceTypes) payload.serviceTypes = values.serviceTypes;
        if (dirtyFields.travelDate) payload.travelDate = new Date(values.travelDate).toISOString();
        if (dirtyFields.returnDate) payload.returnDate = new Date(values.returnDate).toISOString();
        if (dirtyFields.currency) payload.currency = values.currency;
        if (dirtyFields.servicePrice) payload.servicePrice = Number(values.servicePrice);
        if (dirtyFields.amountPaid) payload.amountPaid = Number(values.amountPaid);

        if (Object.keys(payload).length === 0) {
            onOpenChange(false);
            return;
        }

        updateSupplier(
            { id: supplier.id, payload },
            {
                onSuccess: () => onOpenChange(false),
            }
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[90vw] max-w-[90vw] !max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mt-8">
                    <DialogTitle>تعديل بيانات المورد</DialogTitle>
                </DialogHeader>

                {isSupplierLoading ? (
                    <UpdateSupplierFormSkeleton />
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-2">
                        <FormSection title="بيانات المورد والعميل" gridClassName="!grid-cols-3">
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

                        <FormSection title="بيانات الخدمة" gridClassName="!grid-cols-3">
                            <InvoiceTextField
                                label="تاريخ السفر"
                                type="date"
                                error={errors.travelDate?.message}
                                {...register("travelDate")}
                            />
                            <InvoiceTextField
                                label="تاريخ العودة"
                                type="date"
                                error={errors.returnDate?.message}
                                {...register("returnDate")}
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

                        <FormSection title="بيانات الدفع" gridClassName="!grid-cols-3">
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

                        <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
                            <SecondaryButton
                                type="button"
                                text="إلغاء"
                                icon={null}
                                onClick={() => onOpenChange(false)}
                                className="!w-[130px]"
                            />
                            <MainButton
                                text="حفظ التعديلات"
                                icon={null}
                                className="!w-[150px]"
                                disabled={isPending}
                            />
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}