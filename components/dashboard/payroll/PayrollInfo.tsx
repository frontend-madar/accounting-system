"use client";

import { useState } from "react";
import { FormSection } from "../invoice/FormSection";
import { SelectField } from "../invoice/SelectField";
import { DateField } from "../Datefield";

interface MonthOption {
  value: string;
  label: string;
}

const MONTH_OPTIONS: MonthOption[] = [
  { value: "1", label: "يناير" },
  { value: "2", label: "فبراير" },
  { value: "3", label: "مارس" },
  { value: "4", label: "أبريل" },
  { value: "5", label: "مايو" },
  { value: "6", label: "يونيو" },
  { value: "7", label: "يوليو" },
  { value: "8", label: "أغسطس" },
  { value: "9", label: "سبتمبر" },
  { value: "10", label: "أكتوبر" },
  { value: "11", label: "نوفمبر" },
  { value: "12", label: "ديسمبر" },
];

const YEAR_OPTIONS = ["2024", "2025", "2026", "2027"].map((y) => ({
  value: y,
  label: y,
}));

export interface PayrollInfoValues {
  month: string;
  year: string;
  startDate: string;
  endDate: string;
  branch: string;
  department: string;
}

interface PayrollInfoProps {
  defaultValues?: Partial<PayrollInfoValues>;
  onChange?: (values: PayrollInfoValues) => void;
}

export function PayrollInfo({
  defaultValues,
  onChange,
}: PayrollInfoProps) {
  const [values, setValues] = useState<PayrollInfoValues>({
    month: defaultValues?.month ?? "7",
    year: defaultValues?.year ?? "2026",
    startDate: defaultValues?.startDate ?? "2026-07-01",
    endDate: defaultValues?.endDate ?? "2026-07-31",
    branch: defaultValues?.branch ?? "all",
    department: defaultValues?.department ?? "all",
  });

  function update<K extends keyof PayrollInfoValues>(key: K, value: PayrollInfoValues[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    onChange?.(next);
  }

  return (
    <form className="space-y-8 rounded-2xl ctm-shadow bg-white p-6">
      <FormSection title="معلومات المسير">
        <SelectField
          label="الشهر"
          placeholder="اختر الشهر"
          value={values.month}
          onChange={(v) => update("month", v)}
          options={MONTH_OPTIONS}
        />

        <SelectField
          label="السنة"
          placeholder="اختر السنة"
          value={values.year}
          onChange={(v) => update("year", v)}
          options={YEAR_OPTIONS}
        />

        <DateField
          label="فترة الرواتب (من)"
          value={values.startDate}
          onChange={(v) => update("startDate", v)}
        />

        <DateField
          label="فترة الرواتب (إلى)"
          value={values.endDate}
          onChange={(v) => update("endDate", v)}
        />
      </FormSection>
    </form>
  );
}