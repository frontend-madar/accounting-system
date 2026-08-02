"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useCreateEmployee } from "@/hooks/use-employee";

import {
    employeeFormSchema,
    EmployeeFormValues,
    EMPLOYEE_CURRENCY,
} from "@/validations/employee-schema";
import { FormSection } from "../invoice/FormSection";
import { InvoiceTextField } from "../invoice/TextField";
import { SelectField } from "../invoice/SelectField";
import { FieldLabel } from "../invoice/FieldLabel";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DateField } from "../Datefield";
import { toIsoDate } from "@/utils/toIsoDate";
import { useGetDepartments } from "@/hooks/use-department";
import FileUploadField from "../shared/FileUploadField";
import MainButton from "../shared/MainButton";
import SecondaryButton from "../shared/SecondaryButton";
import { useExpenseAccounts } from "@/hooks/useExpenses";
import { useExpenseOptionsStore } from "@/store/expense.store";
import { useSyncExpenseOptions } from "@/hooks/useSyncExpenseOptions";

interface CreateEmployeeFormProps {
    onSaveEmployee?: (values: EmployeeFormValues) => void;
    onSaveAndAddAnother?: (values: Partial<EmployeeFormValues>) => void;
}

export function CreaeteEmployeeForm({

}: CreateEmployeeFormProps) {

    const {
        control,
        register,
        handleSubmit,
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
            basicSalary: undefined,
            housingAllowance: undefined,
            transportAllowance: undefined,
            iban: "",
            bank: "",
        },
    });

     const { data: accountsRes } = useExpenseAccounts();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { mutate: createEmployee, isPending } = useCreateEmployee();

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

    useSyncExpenseOptions();
   const accountOptions = useExpenseOptionsStore((s) => s.accountOptions);

    function onSubmit(values: EmployeeFormValues) {
         
        createEmployee({
            fullName: values.fullName,
            email: values.email,
            mobile: values.mobile,
            nationalId: values.nationalId,
            birthDate: toIsoDate(values.birthDate),
            city: values.city,
            country: values.country,
            department: values.department,
            jobTitle: values.jobTitle,
            hireDate: toIsoDate(values.hireDate),
            employmentType: values.employmentType,
            basicSalary: values.basicSalary,
            housingAllowance: values.housingAllowance,
            transportationAllowance: values.transportAllowance,
            bankName: values.bank,
            iban: values.iban,
            attachments: selectedFile,
        });
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-2xl  ctm-shadow bg-white p-2 md:p-6"
        >

            <FormSection title="بيانات الموظف" gridClassName="!grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3">

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
                <Controller
                    control={control}
                    name="birthDate"
                    render={({ field }) => (
                        <DateField
                            label="تاريخ الميلاد"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.hireDate?.message}
                        />
                    )}
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
                <InvoiceTextField
                    label=" الدولة "
                    placeholder="ادخل الدولة"
                    error={errors.country?.message}
                    {...register("country")}
                />
            </FormSection>

            <FormSection title="  البيانات الوظيفية   " gridClassName="!grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3">
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
                                        : "اختر القسم"
                            }
                            value={field.value}
                            onChange={field.onChange}
                            options={departmentOptions}
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

                <div className="lg:col-span-3 mt-0 md:mt-7 lg:mt-0">
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

            <FormSection title="البيانات المالية" gridClassName="!grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3">
                <InvoiceTextField
                    label={`الراتب الأساسي (${EMPLOYEE_CURRENCY})`}
                    placeholder="0.00"
                    inputMode="numeric"
                    error={errors.basicSalary?.message}
                    {...register("basicSalary", { valueAsNumber: true })}
                />
                <InvoiceTextField
                    label="بدل السكن"
                    type="number"
                    placeholder="0.00"
                    inputMode="numeric"
                    error={errors.housingAllowance?.message}
                    {...register("housingAllowance", { valueAsNumber: true })}
                />
                <InvoiceTextField
                    label="بدل الانتقال"
                    type="number"
                    placeholder="0.00"
                    inputMode="numeric"
                    error={errors.transportAllowance?.message}
                    {...register("transportAllowance", { valueAsNumber: true })}
                />

                <div className="lg:col-span-2">
                    <InvoiceTextField
                        type="number"
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
                            options={accountOptions}
                            error={errors.bank?.message}
                        />
                    )}
                />
            </FormSection>


            <FileUploadField
                label=" المرفقات "
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
            />
            

            <div className="flex flex-col md:flex-row items-center  gap-3 border-t border-border pt-5">
                <MainButton icon={<Plus />} text="حفظ الموظف" className="md:!w-[150px]" disabled={isPending} />
                <SecondaryButton text=" حفظ واضافة موظف اخر" icon={<Plus className="h-4 w-4" />} />
            </div>
        </form>
    );
}