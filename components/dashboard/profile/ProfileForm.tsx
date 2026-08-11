"use client";

import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormSection } from "@/components/dashboard/invoice/FormSection";
import { InvoiceTextField } from "@/components/dashboard/invoice/TextField";
import { CreatableMultiSelectField } from "@/components/dashboard/invoice/CreatableMultiSelectField";
import MainButton from "@/components/dashboard/shared/MainButton";
import SecondaryButton from "@/components/dashboard/shared/SecondaryButton";
import { profileSchema, ProfileFormValues } from "@/validations/profile-schema";
import { useGetProfile, useUpdateProfile } from "@/hooks/use-profile";
import { useGetDepartments, useCreateDepartment } from "@/hooks/use-department";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileForm() {
  const { data: profileResponse, isLoading } = useGetProfile();
  const profile = profileResponse?.data;

  const { data: departmentsData, isLoading: isDepartmentsLoading } = useGetDepartments();
  const departmentOptions = useMemo(
    () =>
      (departmentsData ?? []).map((dept) => ({
        label: dept,
        value: dept,
      })),
    [departmentsData]
  );

  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { mutateAsync: createDepartment, isPending: isCreatingDepartment } = useCreateDepartment();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: profile
      ? {
          name: profile.name ?? "",
          phone: profile.phone ?? "",
          departments: profile.departments ?? [],
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        }
      : undefined,
  });

  function onSubmit(values: ProfileFormValues) {
    updateProfile({
      name: values.name,
      phone: values.phone,
      departments: values.departments,
      ...(values.newPassword
        ? {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
            confirmNewPassword: values.confirmNewPassword,
          }
        : {}),
    });
  }

  async function handleCreateDepartment(name: string) {
    await createDepartment(name);
  }

  if (isLoading) {
    return (
      <div className="space-y-8 rounded-2xl ctm-shadow bg-white p-4 md:p-6">
        <div className="space-y-4">
          <Skeleton className="h-7 w-40" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-[47px] w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-[47px] w-full rounded-xl" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-[47px] w-full rounded-xl" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-7 w-44" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-[47px] w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-[47px] w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-[47px] w-full rounded-xl" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 border-t border-border pt-5">
          <Skeleton className="h-12 w-full md:w-[246px] rounded-2xl" />
          <Skeleton className="h-12 w-full md:w-[246px] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-2xl ctm-shadow bg-white p-4 md:p-6"
    >
      <FormSection title="البيانات الشخصية" gridClassName="!grid-cols-1 md:!grid-cols-2">
        <InvoiceTextField
          label="الاسم الكامل"
          placeholder="ادخل الاسم الكامل"
          error={errors.name?.message}
          {...register("name")}
        />
        <InvoiceTextField
          label="رقم الجوال"
          placeholder="ادخل رقم الجوال"
          type="tel"
          inputMode="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <div className="md:col-span-2">
          <Controller
            control={control}
            name="departments"
            render={({ field }) => (
              <CreatableMultiSelectField
                label="الأقسام"
                placeholder={isDepartmentsLoading ? "جاري تحميل الأقسام..." : "اختر الأقسام أو أضف قسمًا جديدًا"}
                options={departmentOptions}
                value={field.value ?? []}
                onChange={field.onChange}
                error={errors.departments?.message}
                onCreateOption={handleCreateDepartment}
                isCreating={isCreatingDepartment}
              />
            )}
          />
        </div>
      </FormSection>

      <FormSection title="تغيير كلمة المرور" gridClassName="!grid-cols-1 md:!grid-cols-3">
        <InvoiceTextField
          label="كلمة المرور الحالية"
          placeholder="ادخل كلمة المرور الحالية"
          type="password"
          error={errors.oldPassword?.message}
          {...register("oldPassword")}
        />
        <InvoiceTextField
          label="كلمة المرور الجديدة"
          placeholder="ادخل كلمة المرور الجديدة"
          type="password"
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <InvoiceTextField
          label="تأكيد كلمة المرور"
          placeholder="تأكيد كلمة المرور الجديدة"
          type="password"
          error={errors.confirmNewPassword?.message}
          {...register("confirmNewPassword")}
        />
      </FormSection>

      <div className="flex flex-col md:flex-row items-center gap-3 border-t border-border pt-5">
        <MainButton
          text="حفظ التغييرات"
          type="submit"
          disabled={isPending}
          loading={isPending}
        />
        <SecondaryButton
          text="إلغاء"
          type="button"
          onClick={() => reset()}
          disabled={isPending}
        />
      </div>
    </form>
  );
}