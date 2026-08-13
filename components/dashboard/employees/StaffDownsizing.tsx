"use client";

import {
    staffDownsizingSchema,
    StaffDownsizingValues,
} from "@/validations/StaffDownsizing";
import { SelectField } from "../invoice/SelectField";
import { InvoiceTextField } from "../invoice/TextField";
import { FormSection } from "../invoice/FormSection";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useMemo } from "react";
import { useGetDepartments } from "@/hooks/use-department";
import MainButton from "../shared/MainButton";
import SecondaryButton from "../shared/SecondaryButton"; 
import { Check } from "lucide-react";
import { RefreshIcon } from "@/icons";


interface StaffDownsizingProps {
    onFilterChange: (filters: { search: string; department: string }) => void;
}

const StaffDownsizing = ({ onFilterChange }: StaffDownsizingProps) => {
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<StaffDownsizingValues>({
        resolver: zodResolver(staffDownsizingSchema),
        defaultValues: { searchName: "", department: "" },
    });


    const {
        data: departments,
        isLoading: isDepartmentsLoading,
        isError: isDepartmentsError,
    } = useGetDepartments();

    const departmentOptions = useMemo(
        () =>
            (departments ?? []).map((department) => ({
                label: department,
                value: department,
            })),
        [departments]
    );

    function onSubmit(values: StaffDownsizingValues) {
        onFilterChange({
            search: values.searchName as string,
            department: values.department as string,
        });
    }

    function handleReset() {
        reset();
        onFilterChange({ search: "", department: "" });
    }

    return (
        <form className="rounded-2xl ctm-shadow bg-white p-5 space-y-5" onSubmit={handleSubmit(onSubmit)}>

            <FormSection title="تصفية الموظفين" gridClassName="!grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3">
                <InvoiceTextField
                    label="بحث"
                    placeholder=" ابحث بالاسم "
                    {...register("searchName")}
                />

                <Controller
                    control={control}
                    name="department"
                    render={({ field }) => (
                        <SelectField
                            label="القسم"
                            placeholder={
                                isDepartmentsLoading
                                    ? "جاري تحميل الأقسام..."
                                    : isDepartmentsError
                                        ? "تعذر تحميل الأقسام"
                                        : " جميع الاقسام "
                            }
                            value={field.value as string}
                            onChange={field.onChange}
                            options={departmentOptions}
                            error={errors.department?.message}
                        />
                    )}
                />

            </FormSection>

            <div className="flex flex-col md:flex-row gap-3 justify-end" >

                <SecondaryButton onClick={handleReset} text="إعادة تعيين" icon={<RefreshIcon />} className="!w-full md:!w-[165px]" />
                <MainButton type="submit" text="تطبيق" icon={<Check className="w-5 h-5" />} className="!w-full md:!w-[130px]" />

            </div>
        </form>
    )
}

export default StaffDownsizing