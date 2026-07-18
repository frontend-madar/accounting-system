"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Plus } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import {
    employeeFormSchema,
    EmployeeFormValues,
    EMPLOYEE_CURRENCY,
    DEPARTMENT_OPTIONS,
    BANK_OPTIONS,
} from "@/validations/employee";
import { FormSection } from "../invoice/FormSection";
import { InvoiceTextField } from "../invoice/TextField";
import { SelectField } from "../invoice/SelectField";
import { FieldLabel } from "../invoice/FieldLabel";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MainButton from "../MainButton";
import { DateField } from "../Datefield";

interface CreateEmployeeFormProps {
    onSaveEmployee?: (values: EmployeeFormValues) => void;
    onSaveAndAddAnother?: (values: Partial<EmployeeFormValues>) => void;
}

export function CreaeteEmployeeForm({
    onSaveEmployee,
    onSaveAndAddAnother,
}: CreateEmployeeFormProps) {

    const {
        control,
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeFormSchema),
        defaultValues: {
            fullName: "",
            mobile: "",
            email: "",
            birthDate: "",
            nationalId: "",
            city: "",
            department: "",
            jobTitle: "",
            hireDate: "",
            employmentType: "full_time",
            basicSalary: "",
            housingAllowance: "",
            transportAllowance: "",
            iban: "",
            bank: "",
        },
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
        // TODO: upload logic here, e.g. call your API or set form state
    };

    function handleSaveAndAddAnother() {
        // Saved as-is, without requiring full validation.
        onSaveAndAddAnother?.(getValues());
    }

    function onSubmit(values: EmployeeFormValues) {
        onSaveEmployee?.(values);
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-2xl  ctm-shadow bg-white p-6"
        >

            <FormSection title="بيانات الموظف" gridClassName="!grid-cols-3">
                <InvoiceTextField
                    label="الاسم الكامل"
                    placeholder="    ادخل اسم الموظف    "
                    error={errors.fullName?.message}
                    {...register("fullName")}
                />
                <InvoiceTextField
                    label="رقم الجوال"
                    placeholder="ادخل رقم الجوال"
                    inputMode="tel"
                    error={errors.mobile?.message}
                    {...register("mobile")}
                />
                <InvoiceTextField
                    label="البريد الإلكتروني"
                    placeholder="ادخل البريد الإلكتروني"
                    inputMode="email"
                    error={errors.email?.message}
                    {...register("email")}
                />
                <InvoiceTextField
                    label=" تاريخ الميلاد "
                    placeholder="يوم/شهر/سنة"
                    error={errors.birthDate?.message}
                    {...register("birthDate")}
                />
                <InvoiceTextField
                    label="  الرقم القومي "
                    placeholder="ادخل الرقم القومي"
                    error={errors.nationalId?.message}
                    {...register("nationalId")}
                />
                <InvoiceTextField
                    label=" المدينة "
                    placeholder="ادخل المدينة"
                    error={errors.city?.message}
                    {...register("city")}
                />
            </FormSection>

            <FormSection title="  البيانات الوظيفية   " gridClassName="!grid-cols-3">
                <Controller
                    control={control}
                    name="department"
                    render={({ field }) => (
                        <SelectField
                            label="القسم"
                            placeholder="اختر القسم"
                            value={field.value}
                            onChange={field.onChange}
                            options={DEPARTMENT_OPTIONS}
                            error={errors.department?.message}
                        />
                    )}
                />
                <InvoiceTextField
                    label="المسمى الوظيفي"
                    placeholder="مثال: محاسب اول"
                    error={errors.jobTitle?.message}
                    {...register("jobTitle")}
                />



                <Controller
                    control={control}
                    name="hireDate"
                    render={({ field }) => (
                        <DateField
                            label="تاريخ التعيين"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.hireDate?.message}
                        />
                    )}
                />




                <div className="col-span-3">
                    <FieldLabel htmlFor={"employmentType"} dropdown={false} className="mb-2">
                        <span className="text-[#232323] text-[14px] md:text-[18px] mb-2"> نوع التوظيف </span>
                    </FieldLabel>

                    <Controller
                        control={control}
                        name="employmentType"
                        render={({ field }) => (
                            <RadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                                className="flex items-center gap-4"
                            >
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <RadioGroupItem
                                        value="full_time"
                                        id="full_time"
                                        className="w-5 h-5 border-[#BEBCC1] data-[state=checked]:border-[#463BAF] [&_svg]:w-4 [&_svg]:h-4 [&_svg]:fill-[#463BAF] [&_svg]:stroke-none"
                                    />
                                    <span className="text-[#232323] text-[16px]">دوام كامل</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <RadioGroupItem
                                        value="part_time"
                                        id="part_time"
                                        className="w-5 h-5 border-[#BEBCC1] data-[state=checked]:border-[#463BAF] [&_svg]:w-4 [&_svg]:h-4 [&_svg]:fill-[#463BAF] [&_svg]:stroke-none"
                                    />
                                    <span className="text-[#232323] text-[16px]">دوام جزئي</span>
                                </label>
                            </RadioGroup>
                        )}
                    />
                </div>
            </FormSection>

            <FormSection title="البيانات المالية" gridClassName="!grid-cols-3">
                <InvoiceTextField
                    label={`الراتب الأساسي (${EMPLOYEE_CURRENCY})`}
                    placeholder="0.00"
                    inputMode="decimal"
                    error={errors.basicSalary?.message}
                    {...register("basicSalary")}
                />
                <InvoiceTextField
                    label="بدل السكن"
                    placeholder="0.00"
                    inputMode="decimal"
                    error={errors.housingAllowance?.message}
                    {...register("housingAllowance")}
                />
                <InvoiceTextField
                    label="بدل الانتقال"
                    placeholder="0.00"
                    inputMode="decimal"
                    error={errors.transportAllowance?.message}
                    {...register("transportAllowance")}
                />

                <div className="col-span-2">
                    <InvoiceTextField
                        label="رقم الحساب البنكي (IBAN)"
                        placeholder="ادخل رقم الحساب البنكي"
                        error={errors.iban?.message}
                        {...register("iban")}
                    />
                </div>
                <Controller
                    control={control}
                    name="bank"
                    render={({ field }) => (
                        <SelectField
                            label="البنك"
                            placeholder="اختر البنك"
                            value={field.value}
                            onChange={field.onChange}
                            options={BANK_OPTIONS}
                            error={errors.bank?.message}
                        />
                    )}
                />
            </FormSection>

            <div>
                <FieldLabel htmlFor={"attachments"} dropdown={false}>
                    <span className="text-[#232323] text-[14px] md:text-[18px] mb-2"> المرفقات </span>
                </FieldLabel>
                <div
                    className="h-[132px] bg-[#FAFCFE] border border-dashed border-[#C0C1C3] rounded-md flex items-center justify-between px-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleFileSelect(file);
                    }}
                >

                    <FileText className="w-23 h-23 text-gray-500" strokeWidth={1.5} />
                    <div className="flex items-center flex-1 justify-center gap-2 md:text-[19px] text-[15px]">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 14.292C14.3012 14.292 14.5607 14.3953 14.749 14.4961C14.9443 14.6006 15.1261 14.7359 15.2871 14.873C15.6084 15.1467 15.9296 15.499 16.2168 15.8379C16.4848 16.1542 16.745 16.4861 16.9668 16.7686C16.9854 16.7922 17.0044 16.815 17.0225 16.8379C17.2712 17.1545 17.4405 17.3672 17.5439 17.4736C17.8808 17.8202 17.8729 18.3741 17.5264 18.7109C17.1798 19.0476 16.6258 19.0398 16.2891 18.6934C16.1058 18.5048 15.8698 18.2045 15.6455 17.9189C15.6283 17.897 15.6112 17.8747 15.5937 17.8525C15.3687 17.5659 15.1276 17.2598 14.8818 16.9697C14.8795 16.9669 14.8774 16.9637 14.875 16.9609V24.5C14.875 24.9832 14.4832 25.375 14 25.375C13.5168 25.375 13.125 24.9832 13.125 24.5V16.9609C13.1226 16.9637 13.1205 16.9669 13.1182 16.9697C12.8724 17.2598 12.6313 17.5659 12.4062 17.8525C12.3888 17.8747 12.3717 17.897 12.3545 17.9189C12.1302 18.2045 11.8942 18.5048 11.7109 18.6934C11.3742 19.0398 10.8202 19.0476 10.4736 18.7109C10.1271 18.3741 10.1192 17.8202 10.4561 17.4736C10.5595 17.3672 10.7288 17.1545 10.9775 16.8379C10.9956 16.815 11.0146 16.7922 11.0332 16.7686C11.255 16.4861 11.5152 16.1542 11.7832 15.8379C12.0704 15.499 12.3916 15.1467 12.7129 14.873C12.8739 14.7359 13.0557 14.6006 13.251 14.4961C13.4393 14.3953 13.6988 14.292 14 14.292ZM14 2.625C17.952 2.625 21.1672 5.77312 21.2881 9.69922C24.2591 10.123 26.542 12.682 26.542 15.7725C26.542 18.9293 24.1611 21.5306 21.0967 21.8701C20.6165 21.9233 20.1832 21.5768 20.1299 21.0967C20.0767 20.6165 20.4232 20.1832 20.9033 20.1299C23.0887 19.8879 24.792 18.0301 24.792 15.7725C24.792 13.5944 23.2078 11.7891 21.1338 11.4463C20.8864 12.6178 20.3586 13.6863 19.625 14.5762C19.3176 14.9488 18.7663 15.0016 18.3936 14.6943C18.0208 14.387 17.9673 13.8358 18.2744 13.4629C18.966 12.624 19.4155 11.5794 19.5186 10.4346C19.5335 10.2682 19.542 10.0994 19.542 9.92871C19.542 6.86012 17.0591 4.375 14 4.375C11.4385 4.375 9.28018 6.118 8.64648 8.48633C9.97136 8.58034 11.1919 9.05976 12.1934 9.81348C12.5795 10.1041 12.6568 10.653 12.3662 11.0391C12.0756 11.4251 11.5267 11.5025 11.1406 11.2119C10.312 10.5883 9.28379 10.2188 8.16699 10.2187C8.00612 10.2187 7.84692 10.2263 7.69043 10.2412C5.17729 10.4808 3.20801 12.6041 3.20801 15.1885C3.2082 17.5925 4.91301 19.5977 7.1748 20.0576C7.64814 20.1541 7.9537 20.6164 7.85742 21.0898C7.761 21.5632 7.29866 21.8687 6.82519 21.7725C3.76225 21.1494 1.4582 18.4386 1.45801 15.1885C1.45801 11.9377 3.76317 9.22433 6.82812 8.60254C7.45097 5.20266 10.4236 2.625 14 2.625Z" fill="#0088FF" />
                        </svg>

                        <div className="text-[20px] text-center " >
                            <span className="text-[#0F1219]">افلت الملف هنا</span>
                            <span className=" px-1 ">او</span>
                            <span className="text-[#0088FF] ">اختر من جهازك</span>
                        </div>
                    </div>



                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(file);
                        }}
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveAndAddAnother}
                    className="gap-2 rounded-lg h-[47px] text-[18px]"
                >
                    <Plus className="h-4 w-4" />
                    حفظ واضافة موظف اخر
                </Button>
                <MainButton icon={<Plus />} text="حفظ الموظف" className="!w-[150px]" />
            </div>
        </form>
    );
}