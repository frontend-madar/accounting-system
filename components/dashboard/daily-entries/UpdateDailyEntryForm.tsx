"use client";

import * as React from "react";
import { useEffect, useMemo } from "react";
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
import { useExpensePaymentMethods } from "@/hooks/useExpenses";
import { useDailyEntry, useUpdateDailyEntry } from "@/hooks/use-daily-entry";
import { useCurrencyStore } from "@/store/currency.store";
import { useSyncCurrencies } from "@/hooks/useSyncCurrencies";
import type { UpdateDailyEntryPayload } from "@/types/daily-entry.types";

interface UpdateDailyEntryFormProps {
  entryId: string;
}

function formatDateInput(dateStr?: string): string {
  if (!dateStr) return "";
  return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
}

function DailyEntryFormSkeleton() {
  return (
    <div className="space-y-8 rounded-2xl ctm-shadow bg-white p-2 md:p-6 animate-pulse">
      {/* Title */}
      <div className="flex flex-col items-center md:items-end gap-2">
        <div className="h-6 md:h-9 w-64 md:w-96 rounded-md bg-[#E4E5E7]" />
        <div className="h-4 md:h-5 w-72 md:w-[420px] rounded-md bg-[#EEEFF1]" />
      </div>

      {/* بيانات العميل والموظف */}
      <SkeletonSection gridClassName="md:!grid-cols-3" fieldCount={3} />

      {/* تفاصيل الإقامة */}
      <SkeletonSection gridClassName="md:!grid-cols-3" fieldCount={3} />

      {/* الحجوزات */}
      <div>
        <div className="h-6 w-32 rounded-md bg-[#E4E5E7] mb-4" />
        {[0, 1].map((i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 shadow-md p-4 rounded-md bg-white mb-5"
          >
            <SkeletonField />
            <SkeletonField />
            <SkeletonField />
          </div>
        ))}
        <div className="h-11 w-40 rounded-xl bg-[#E4E5E7]" />
      </div>

      {/* تفاصيل الدفع */}
      <SkeletonSection fieldCount={5} />

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-5">
        <div className="h-11 w-36 rounded-xl bg-[#E4E5E7]" />
        <div className="h-11 w-24 rounded-xl bg-[#EEEFF1]" />
      </div>
    </div>
  );
}

function SkeletonSection({
  fieldCount,
  gridClassName,
}: {
  fieldCount: number;
  gridClassName?: string;
}) {
  return (
    <div>
      <div className="h-5 w-40 rounded-md bg-[#E4E5E7] mb-4" />
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${gridClassName ?? ""}`}>
        {Array.from({ length: fieldCount }).map((_, i) => (
          <SkeletonField key={i} />
        ))}
      </div>
    </div>
  );
}

function SkeletonField() {
  return (
    <div className="space-y-1.5">
      <div className="h-4 w-24 rounded bg-[#E4E5E7]" />
      <div className="h-[47px] w-full rounded-xl border border-[#EDEEFF] bg-[#FAFBFC]" />
    </div>
  );
}

export function UpdateDailyEntryForm({ entryId }: UpdateDailyEntryFormProps) {
  useSyncCurrencies();
  const currencyOptions = useCurrencyStore((s) => s.currencyOptions);

  const { data: entryRes, isLoading: isEntryLoading } = useDailyEntry(entryId);
  const { data: clientsRes } = useClients({ limit: 100 });
  const { data: employeesRes } = useEmployees({ limit: 100 });
  const { data: paymentMethodsRes } = useExpensePaymentMethods();
  const { mutate: updateDailyEntry, isPending } = useUpdateDailyEntry();

  const entry = entryRes?.data;

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

  const paymentMethodOptions = useMemo(() => {
    const list = paymentMethodsRes?.data || [];
    return list.map((pm) => ({ label: pm.name, value: pm.name }));
  }, [paymentMethodsRes]);

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, dirtyFields },
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

  // Once the entry loads and client/employee lists are ready, resolve
  // clientName/employeeName back to ids and populate the form.
  useEffect(() => {
    if (!entry) return;

    const matchedClient = clientList.find((c) => c.name === entry.clientName);
    const matchedEmployee = employeeList.find((e) => e.fullName === entry.employeeName);

    reset({
      clientId: matchedClient?.id || "",
      employeeId: matchedEmployee?.id || "",
      checkIn: formatDateInput(entry.checkIn),
      checkOut: formatDateInput(entry.checkOut),
      destination: entry.destination,
      currency: entry.currency,
      totalCost: String(entry.totalCost),
      paidAmount: String(entry.paidAmount),
      paymentDate: formatDateInput(entry.paymentDate),
      paymentMethod: entry.paymentMethod,
      bookingLines: entry.bookingLines.length
        ? entry.bookingLines.map((line) => ({
          bookingPlace: line.bookingPlace,
          serviceType: line.serviceType,
          bookingPrice: String(line.bookingPrice),
        }))
        : [{ bookingPlace: "", serviceType: "", bookingPrice: "" }],
    });
  }, [entry, clientList, employeeList, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bookingLines",
  });

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

  function onSubmit(values: DailyEntryFormValues) {
    const selectedClient = clientList.find((c) => c.id === values.clientId);
    const selectedEmployee = employeeList.find((e) => e.id === values.employeeId);

    const payload: UpdateDailyEntryPayload = {};

    if (dirtyFields.clientId) {
      if (!selectedClient) return;
      payload.clientName = selectedClient.name;
    }
    if (dirtyFields.employeeId) {
      if (!selectedEmployee) return;
      payload.employeeName = selectedEmployee.fullName;
    }
    if (dirtyFields.checkIn) payload.checkIn = values.checkIn;
    if (dirtyFields.checkOut) payload.checkOut = values.checkOut;
    if (dirtyFields.destination) payload.destination = values.destination;
    if (dirtyFields.currency) payload.currency = values.currency;
    if (dirtyFields.totalCost) payload.totalCost = parseFloat(values.totalCost) || 0;
    if (dirtyFields.paidAmount) payload.paidAmount = parseFloat(values.paidAmount || "0") || 0;
    if (dirtyFields.paymentDate) payload.paymentDate = values.paymentDate || "";
    if (dirtyFields.paymentMethod) payload.paymentMethod = values.paymentMethod || "";

    if (dirtyFields.bookingLines) {
      payload.bookingLines = values.bookingLines.map((line) => ({
        bookingPlace: line.bookingPlace,
        serviceType: line.serviceType,
        bookingPrice: parseFloat(line.bookingPrice) || 0,
      }));
    }

    if (Object.keys(payload).length === 0) {
      return;
    }

    updateDailyEntry({ id: entryId, payload });
  }

  if (isEntryLoading || !entry) {
    return (
      <DailyEntryFormSkeleton />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-2xl ctm-shadow bg-white p-2 md:p-6"
    >
      <h1 className="text-[20px] md:text-[34px] font-bold text-[#171A1F] text-center md:text-right">
        تعديل القيد اليومي
      </h1>
      <p className="-mt-6 text-[15px] md:text-[18px] text-[#171A1F] text-center md:text-right">
        تعديل بيانات حجوزات العميل وتفاصيل الدفع الخاصة بها.
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
          text={isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
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