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
import MainButton from "../shared/MainButton";
import SecondaryButton from "../shared/SecondaryButton";
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
            search: "",
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
        if (values.search) filters.search = values.search;
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
             

            <FormSection title="تصفية العملاء" gridClassName="!grid-cols-1 ">
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
                <InvoiceTextField
                    label="اسم العميل"
                    placeholder="ابحث بالاسم"
                    error={errors.search?.message}
                    {...register("search")}
                />
                {/* <InvoiceTextField
                    label="رقم الجوال"
                    placeholder="ابحث برقم الجوال"
                    inputMode="tel"
                    error={errors.mobile?.message}
                    {...register("mobile")}
                /> */}
                {/* <InvoiceTextField
                    label="البريد الإلكتروني"
                    placeholder="ابحث بالبريد الإلكتروني"
                    inputMode="email"
                    error={errors.email?.message}
                    {...register("email")}
                /> */}
                {/* <InvoiceTextField
                    label="الدولة"
                    placeholder="ابحث بالدولة"
                    error={errors.country?.message}
                    {...register("country")}
                /> */}
                {/* <InvoiceTextField
                    label="المدينة"
                    placeholder="ابحث بالمدينة"
                    error={errors.city?.message}
                    {...register("city")}
                /> */}
                {/* <Controller
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
                /> */}
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