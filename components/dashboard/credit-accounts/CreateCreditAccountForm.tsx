"use client";

import * as React from "react";
import { useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";

import {
  creditAccountFormSchema,
  CreditAccountFormValues,
  CURRENCY_OPTIONS,
  STATUS_OPTIONS,
} from "@/validations/CreditAccount";
import { FormSection } from "../invoice/FormSection";
import { InvoiceTextField } from "../invoice/TextField";
import { SelectField } from "../invoice/SelectField";
import MainButton from "../shared/MainButton";
import SecondaryButton from "../shared/SecondaryButton";
import { DateField } from "../Datefield";

import { useClients } from "@/hooks/use-client";
import { useEmployees } from "@/hooks/use-employee";
import { useExpensePaymentMethods } from "@/hooks/useExpenses";
import { useCreateDeferredAccount } from "@/hooks/use-deferred-account";
import type { CreateDeferredAccountPayload } from "@/types/deferred-account.types";
import { useSyncCurrencies } from "@/hooks/useSyncCurrencies";
import { useCurrencyStore } from "@/store/currency.store";
import { useInvoices } from "@/hooks/use-invoice";
interface CreateCreditAccountFormProps {
  onSaveDraft?: (values: Partial<CreditAccountFormValues>) => void;
}

export function CreateCreditAccountForm({
  onSaveDraft,
}: CreateCreditAccountFormProps) {
  const { data: clientsRes } = useClients({ limit: 100 });
  const { data: employeesRes } = useEmployees({ limit: 100 });
  const { data: paymentMethodsRes } = useExpensePaymentMethods();
  const { mutate: createDeferredAccount, isPending } = useCreateDeferredAccount();

  const clientOptions = useMemo(() => {
    const list = clientsRes?.data?.data || [];
    return list.map((c) => ({ label: c.name, value: c.id }));
  }, [clientsRes]);

  const employeeOptions = useMemo(() => {
    const list = employeesRes?.data?.data || [];
    return list.map((e) => ({ label: e.fullName, value: e.id }));
  }, [employeesRes]);

  const paymentMethodOptions = useMemo(() => {
    const list = paymentMethodsRes?.data || [];
    return list.map((pm) => ({ label: pm.name, value: pm.name }));
  }, [paymentMethodsRes]);

  useSyncCurrencies();
  const currencyOptions = useCurrencyStore((s) => s.currencyOptions);

  const { data: invoicesRes } = useInvoices({ limit: 100 });

  const invoiceNumberOptions = useMemo(() => {
    const list = invoicesRes?.data?.data || [];
    return list.map((inv) => ({ label: inv.invoiceNumber, value: inv.invoiceNumber }));
  }, [invoicesRes]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreditAccountFormValues>({
    resolver: zodResolver(creditAccountFormSchema),
    defaultValues: {
      clientId: "",
      employeeId: "",
      travelDate: "",
      invoiceNumber: "",
      currency: "SAR",
      totalAmount: "",
      status: "باقي الدفع",
      payments: [{ amount: "", paymentDate: "", paymentMethod: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "payments",
  });

  function onSubmit(values: CreditAccountFormValues) {
    const totalAmountNum = parseFloat(values.totalAmount);

    const payments = (values.payments || [])
      .filter((p) => p.amount && p.paymentMethod && p.paymentDate)
      .map((p) => ({
        amount: parseFloat(p.amount),
        paymentMethod: p.paymentMethod,
        paymentDate: p.paymentDate,
      }));

    const payload: CreateDeferredAccountPayload = {
      clientId: values.clientId,
      employeeId: values.employeeId,
      travelDate: values.travelDate,
      currency: values.currency,
      invoiceNumber: values.invoiceNumber,
      totalAmount: totalAmountNum,
      status: values.status,
      payments: payments.length > 0 ? payments : undefined,
    };

    createDeferredAccount(payload);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-2xl ctm-shadow bg-white p-2 md:p-6"
    >
      <h1 className="text-[20px] md:text-[34px] font-bold text-[#171A1F] text-center md:text-right">
        إضافة حساب جديد
      </h1>
      <p className="-mt-6 text-[15px] md:text-[18px] text-[#171A1F] text-center md:text-right">
        إضافة بيانات عميل جديد لتسجيل معاملاته المالية ومتابعة أرصدته المستحقة.
      </p>

      <FormSection title="بيانات العميل" gridClassName="items-end">
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
          name="travelDate"
          render={({ field }) => (
            <DateField
              label="تاريخ السفر"
              value={field.value}
              onChange={field.onChange}
              error={errors.travelDate?.message}
            />
          )}
        />

        <MainButton
          text="اضافة عميل جديد"
          icon={<Plus className="w-4 h-4" />}
          href="/dashboard/clients/create"
        />
      </FormSection>

      <FormSection title="تفاصيل الحساب الآجل" gridClassName="md:!grid-cols-3">
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

        <Controller
          control={control}
          name="invoiceNumber"
          render={({ field }) => (
            <SelectField
              label="رقم الفاتورة"
              placeholder="اختر رقم الفاتورة"
              value={field.value}
              onChange={field.onChange}
              options={invoiceNumberOptions}
              error={errors.invoiceNumber?.message}
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

      <FormSection title="تفاصيل الدفع">
        <InvoiceTextField
          label="السعر الاجمالي"
          placeholder="80000"
          type="number"
          error={errors.totalAmount?.message}
          {...register("totalAmount")}
        />
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <SelectField
              label="الحالة"
              placeholder="اختر الحالة"
              value={field.value}
              onChange={field.onChange}
              options={STATUS_OPTIONS}
              error={errors.status?.message}
            />
          )}
        />

        <div className="col-span-4 text-[#0F1219] text-[22px] font-bold"> الدفعات </div>

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
              label="تم دفع"
              placeholder="3000"
              type="number"
              error={errors.payments?.[index]?.amount?.message}
              {...register(`payments.${index}.amount`)}
            />

            <Controller
              control={control}
              name={`payments.${index}.paymentDate`}
              render={({ field }) => (
                <DateField
                  label="تاريخ الدفع"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={errors.payments?.[index]?.paymentDate?.message}
                />
              )}
            />

            <Controller
              control={control}
              name={`payments.${index}.paymentMethod`}
              render={({ field }) => (
                <SelectField
                  label="طريقة الدفع"
                  placeholder="اختر طريقة الدفع"
                  value={field.value || ""}
                  onChange={field.onChange}
                  options={paymentMethodOptions}
                  error={errors.payments?.[index]?.paymentMethod?.message}
                />
              )}
            />
          </div>
        ))}

        <MainButton
          type="button"
          text="اضافة دفعة جديدة"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => append({ amount: "", paymentDate: "", paymentMethod: "" })}
          className="col-span-4"
        />
      </FormSection>

      <div className="flex items-center gap-3 pt-5">
        <MainButton
          text={isPending ? "جاري الحفظ..." : "حفظ"}
          icon={<Plus className="h-4 w-4" />}
          disabled={isPending}
        />
        <SecondaryButton
          text="إلغاء"
          icon={<X className="h-4 w-4" />}
          href="/dashboard/credit-accounts"
        />
      </div>
    </form>
  );
}