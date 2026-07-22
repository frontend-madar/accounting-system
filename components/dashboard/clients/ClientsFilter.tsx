"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";

import {
    clientFilterSchema,
    ClientFilterValues,
    CLIENT_CURRENCY_OPTIONS,
} from "@/validations/client-schema";
import { FormSection } from "../invoice/FormSection";
import { InvoiceTextField } from "../invoice/TextField";
import { SelectField } from "../invoice/SelectField";
import { FieldLabel } from "../invoice/FieldLabel";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MainButton from "../MainButton";
import SecondaryButton from "../SecondaryButton";
import type { GetClientsParams } from "@/types/client.types";

interface ClientsFilterProps {
    onFilterChange: (filters: GetClientsParams) => void;
}

export function ClientsFilter({ onFilterChange }: ClientsFilterProps) {
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ClientFilterValues>({
        resolver: zodResolver(clientFilterSchema),
        defaultValues: {
            clientType: "",
            name: "",
            mobile: "",
            email: "",
            country: "",
            city: "",
            currency: "",
        },
    });

    function onSubmit(values: ClientFilterValues) {
        const filters: GetClientsParams = {};
        if (values.clientType) filters.clientType = values.clientType as "individual" | "business";
        if (values.name) filters.name = values.name;
        if (values.mobile) filters.mobile = values.mobile;
        if (values.email) filters.email = values.email;
        if (values.country) filters.country = values.country;
        if (values.city) filters.city = values.city;
        if (values.currency) filters.currency = values.currency;

        onFilterChange(filters);
    }

    function handleReset() {
        reset();
        onFilterChange({});
    }

    return (
        <form
            className="rounded-2xl ctm-shadow bg-white p-5 space-y-5"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.5576 1.25C13.7479 1.24999 15.4683 1.25012 16.8115 1.43066C18.1882 1.61575 19.2805 2.00313 20.1387 2.86133C20.9969 3.71953 21.3842 4.81182 21.5693 6.18848C21.7499 7.53174 21.75 9.25212 21.75 11.4424V11.5576C21.75 13.7479 21.7499 15.4683 21.5693 16.8115C21.3842 18.1882 20.9969 19.2805 20.1387 20.1387C19.2805 20.9969 18.1882 21.3842 16.8115 21.5693C15.4683 21.7499 13.7479 21.75 11.5576 21.75H11.4424C9.25212 21.75 7.53174 21.7499 6.18848 21.5693C4.81182 21.3842 3.71953 20.9969 2.86133 20.1387C2.00313 19.2805 1.61575 18.1882 1.43066 16.8115C1.25012 15.4683 1.24999 13.7479 1.25 11.5576V11.4424C1.24999 9.25212 1.25012 7.53174 1.43066 6.18848C1.61575 4.81182 2.00313 3.71953 2.86133 2.86133C3.71953 2.00313 4.81182 1.61575 6.18848 1.43066C7.53174 1.25012 9.25212 1.24999 11.4424 1.25H11.5576ZM11.5 2.75C9.23962 2.75 7.61959 2.75137 6.38769 2.91699C5.17747 3.07972 4.45489 3.38885 3.92187 3.92187C3.38885 4.45489 3.07972 5.17747 2.91699 6.38769C2.75137 7.61959 2.75 9.23962 2.75 11.5C2.75 13.7604 2.75137 15.3804 2.91699 16.6123C3.07972 17.8225 3.38885 18.5451 3.92187 19.0781C4.45489 19.6111 5.17747 19.9203 6.38769 20.083C7.61959 20.2486 9.23962 20.25 11.5 20.25C13.7604 20.25 15.3804 20.2486 16.6123 20.083C17.8225 19.9203 18.5451 19.6111 19.0781 19.0781C19.6111 18.5451 19.9203 17.8225 20.083 16.6123C20.2486 15.3804 20.25 13.7604 20.25 11.5C20.25 9.23962 20.2486 7.61959 20.083 6.38769C19.9203 5.17747 19.6111 4.45489 19.0781 3.92187C18.5451 3.38885 17.8225 3.07972 16.6123 2.91699C15.3804 2.75137 13.7604 2.75 11.5 2.75ZM13.5 14.25C13.9142 14.25 14.25 14.5858 14.25 15C14.25 15.4142 13.9142 15.75 13.5 15.75H9.5C9.08579 15.75 8.75 15.4142 8.75 15C8.75 14.5858 9.08579 14.25 9.5 14.25H13.5ZM14.5 10.75C14.9142 10.75 15.25 11.0858 15.25 11.5C15.25 11.9142 14.9142 12.25 14.5 12.25L8.5 12.25C8.08579 12.25 7.75 11.9142 7.75 11.5C7.75 11.0858 8.08579 10.75 8.5 10.75L14.5 10.75ZM15.5 7.25C15.9142 7.25 16.25 7.58579 16.25 8C16.25 8.41421 15.9142 8.75 15.5 8.75H7.5C7.08579 8.75 6.75 8.41421 6.75 8C6.75 7.58579 7.08579 7.25 7.5 7.25H15.5Z" fill="#161616" />
                </svg>
                <p className="text-[#0F1219] text-[22px] font-bold"> تصفية العملاء </p>
            </div>

            <div>
                <FieldLabel htmlFor="clientType" dropdown={false}>
                    <span className="text-[#232323] text-[14px] md:text-[18px] mb-2">نوع العميل</span>
                </FieldLabel>
                <Controller
                    control={control}
                    name="clientType"
                    render={({ field }) => (
                        <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex items-center gap-4"
                        >
                            <label className="flex items-center gap-2 cursor-pointer">
                                <RadioGroupItem
                                    value=""
                                    id="filter_all"
                                    className="w-5 h-5 border-[#BEBCC1] data-[state=checked]:border-[#463BAF] [&_svg]:w-4 [&_svg]:h-4 [&_svg]:fill-[#463BAF] [&_svg]:stroke-none"
                                />
                                <span className="text-[#232323] text-[16px]">الكل</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <RadioGroupItem
                                    value="individual"
                                    id="filter_individual"
                                    className="w-5 h-5 border-[#BEBCC1] data-[state=checked]:border-[#463BAF] [&_svg]:w-4 [&_svg]:h-4 [&_svg]:fill-[#463BAF] [&_svg]:stroke-none"
                                />
                                <span className="text-[#232323] text-[16px]">فردي</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <RadioGroupItem
                                    value="business"
                                    id="filter_business"
                                    className="w-5 h-5 border-[#BEBCC1] data-[state=checked]:border-[#463BAF] [&_svg]:w-4 [&_svg]:h-4 [&_svg]:fill-[#463BAF] [&_svg]:stroke-none"
                                />
                                <span className="text-[#232323] text-[16px]">تجاري</span>
                            </label>
                        </RadioGroup>
                    )}
                />
            </div>

            <FormSection title="" gridClassName="!grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3">
                <InvoiceTextField
                    label="اسم العميل"
                    placeholder="ابحث بالاسم"
                    error={errors.name?.message}
                    {...register("name")}
                />
                <InvoiceTextField
                    label="رقم الجوال"
                    placeholder="ابحث برقم الجوال"
                    inputMode="tel"
                    error={errors.mobile?.message}
                    {...register("mobile")}
                />
                <InvoiceTextField
                    label="البريد الإلكتروني"
                    placeholder="ابحث بالبريد الإلكتروني"
                    inputMode="email"
                    error={errors.email?.message}
                    {...register("email")}
                />
                <InvoiceTextField
                    label="الدولة"
                    placeholder="ابحث بالدولة"
                    error={errors.country?.message}
                    {...register("country")}
                />
                <InvoiceTextField
                    label="المدينة"
                    placeholder="ابحث بالمدينة"
                    error={errors.city?.message}
                    {...register("city")}
                />
                <Controller
                    control={control}
                    name="currency"
                    render={({ field }) => (
                        <SelectField
                            label="العملة"
                            placeholder="جميع العملات"
                            value={field.value as string}
                            onChange={field.onChange}
                            options={CLIENT_CURRENCY_OPTIONS}
                            error={errors.currency?.message}
                        />
                    )}
                />
            </FormSection>

            <div className="flex flex-col md:flex-row gap-3 justify-end">
                <SecondaryButton
                    type="button"
                    onClick={handleReset}
                    text="إعادة تعيين"
                    icon={null}
                    className="!w-full md:!w-[165px]"
                />
                <MainButton
                    type="submit"
                    text="تطبيق"
                    icon={<Check className="w-5 h-5" />}
                    className="!w-full md:!w-[130px]"
                />
            </div>
        </form>
    );
}