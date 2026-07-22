// components/dashboard/employees/UpdateEmployeeForm.tsx
"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
    employeeFormSchema,
    EmployeeFormValues,
    EMPLOYEE_CURRENCY,
    BANK_OPTIONS,
} from "@/validations/employee-schema";
import { FormSection } from "../invoice/FormSection";
import { InvoiceTextField } from "../invoice/TextField";
import { SelectField } from "../invoice/SelectField";
import { FieldLabel } from "../invoice/FieldLabel";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MainButton from "../MainButton";
import SecondaryButton from "../SecondaryButton";
import { DateField } from "../Datefield";
import { toIsoDate } from "@/utils/toIsoDate";
import { useUpdateEmployee } from "@/hooks/use-employee";
import { useGetDepartments } from "@/hooks/use-department";
import { EmployeeData, UpdateEmployeePayload } from "@/types/employee.types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface UpdateEmployeeFormProps {
    employee: EmployeeData | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/** Converts an ISO date string to the yyyy-MM-dd shape most date inputs expect. */
function toDateInputValue(iso: string): string {
    return iso ? iso.slice(0, 10) : "";
}

export function UpdateEmployeeForm({ employee, open, onOpenChange }: UpdateEmployeeFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { mutate: updateEmployee, isPending } = useUpdateEmployee();

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

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, dirtyFields },
    } = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeFormSchema),
        values: employee
            ? {
                fullName: employee.fullName,
                mobile: employee.mobile,
                email: employee.email,
                birthDate: toDateInputValue(employee.birthDate),
                nationalId: employee.nationalId,
                city: employee.city,
                country: employee.country,
                department: employee.department,
                jobTitle: employee.jobTitle,
                hireDate: toDateInputValue(employee.hireDate),
                employmentType: employee.employmentType,
                basicSalary: employee.basicSalary,
                housingAllowance: employee.housingAllowance ?? "",
                transportAllowance: employee.transportationAllowance ?? "",
                iban: employee.iban,
                bank: employee.bankName,
            }
            : undefined,
    });

    const handleFileSelect = (file: File) => {
        if (file.type !== "application/pdf") {
            toast.error("الملف يجب أن يكون بصيغة PDF فقط");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error("حجم الملف يجب ألا يتجاوز 10 ميجابايت");
            return;
        }
        setSelectedFile(file);
    };

    function onSubmit(values: EmployeeFormValues) {
        if (!employee) return;

        // Only send fields the user actually touched — dirtyFields marks that per-field.
        const payload: UpdateEmployeePayload = {};

        if (dirtyFields.fullName) payload.fullName = values.fullName;
        if (dirtyFields.mobile) payload.mobile = values.mobile;
        if (dirtyFields.email) payload.email = values.email;
        if (dirtyFields.birthDate) payload.birthDate = toIsoDate(values.birthDate);
        if (dirtyFields.nationalId) payload.nationalId = values.nationalId;
        if (dirtyFields.city) payload.city = values.city;
        if (dirtyFields.country) payload.country = values.country;
        if (dirtyFields.department) payload.department = values.department;
        if (dirtyFields.jobTitle) payload.jobTitle = values.jobTitle;
        if (dirtyFields.hireDate) payload.hireDate = toIsoDate(values.hireDate);
        if (dirtyFields.employmentType) payload.employmentType = values.employmentType;
        if (dirtyFields.basicSalary) payload.basicSalary = values.basicSalary;
        if (dirtyFields.housingAllowance) payload.housingAllowance = values.housingAllowance;
        if (dirtyFields.transportAllowance) payload.transportationAllowance = values.transportAllowance;
        if (dirtyFields.iban) payload.iban = values.iban;
        if (dirtyFields.bank) payload.bankName = values.bank;
        if (selectedFile) payload.attachments = selectedFile;

        if (Object.keys(payload).length === 0) {
            toast.info("لم يتم تغيير أي بيانات");
            return;
        }

        updateEmployee(
            { id: employee.id, payload },
            {
                onSuccess: () => {
                    setSelectedFile(null);
                    onOpenChange(false);
                },
            }
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[90vw] max-w-[90vw] !max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mt-8" >
                    <DialogTitle>تعديل بيانات الموظف</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-2">
                    <FormSection title="بيانات الموظف" gridClassName="!grid-cols-3">
                        <InvoiceTextField
                            label="الاسم الكامل"
                            placeholder="ادخل اسم الموظف"
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
                            label="تاريخ الميلاد"
                            placeholder="يوم/شهر/سنة"
                            error={errors.birthDate?.message}
                            {...register("birthDate")}
                        />
                        <InvoiceTextField
                            label="الرقم القومي"
                            placeholder="ادخل الرقم القومي"
                            error={errors.nationalId?.message}
                            {...register("nationalId")}
                        />
                        <InvoiceTextField
                            label="المدينة"
                            placeholder="ادخل المدينة"
                            error={errors.city?.message}
                            {...register("city")}
                        />
                        <InvoiceTextField
                            label="الدولة"
                            placeholder="ادخل الدولة"
                            error={errors.country?.message}
                            {...register("country")}
                        />
                    </FormSection>

                    <FormSection title="البيانات الوظيفية" gridClassName="!grid-cols-3">
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

                        <div className="col-span-3">
                            <FieldLabel htmlFor={"employmentType"} dropdown={false} className="mb-2">
                                <span className="text-[#232323] text-[14px] md:text-[18px] mb-2">نوع التوظيف</span>
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
                                            <RadioGroupItem value="full_time" id="update_full_time" />
                                            <span className="text-[#232323] text-[16px]">دوام كامل</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <RadioGroupItem value="part_time" id="update_part_time" />
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
                            <span className="text-[#232323] text-[14px] md:text-[18px] mb-2">المرفقات (اختياري لتغيير الملف الحالي)</span>
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
                            <FileText className="w-16 h-16 text-gray-500" strokeWidth={1.5} />
                            <div className="flex-1 text-center text-[15px]">
                                {selectedFile ? (
                                    <span className="text-[#0088FF]">{selectedFile.name}</span>
                                ) : (
                                    <>
                                        <span className="text-[#0F1219]">افلت الملف هنا</span>
                                        <span className="px-1">او</span>
                                        <span className="text-[#0088FF]">اختر من جهازك</span>
                                    </>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileSelect(file);
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
                        <SecondaryButton
                            type="button"
                            text="إلغاء"
                            icon={null}
                            onClick={() => onOpenChange(false)}
                            className="!w-[130px]"
                        />
                        <MainButton text="حفظ التعديلات" icon={null} className="!w-[150px]" disabled={isPending} />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}