"use client";

import { useState } from "react";
import { FormSection } from "../invoice/FormSection";
import { SelectField } from "../invoice/SelectField";

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

const BRANCH_OPTIONS = [
  { value: "all", label: "جميع الفروع" },
  { value: "main", label: "الفرع الرئيسي" },
  { value: "east", label: "فرع الشرقية" },
];

const DEPARTMENT_OPTIONS = [
  { value: "all", label: "جميع الاقسام" },
  { value: "hr", label: "الموارد البشرية" },
  { value: "finance", label: "المالية" },
  { value: "sales", label: "المبيعات" },
];

const MONTH_LABELS: Record<string, string> = Object.fromEntries(
  MONTH_OPTIONS.map((m) => [m.value, m.label]),
);

const DAYS_IN_MONTH: Record<string, number> = {
  "1": 31, "2": 28, "3": 31, "4": 30, "5": 31, "6": 30,
  "7": 31, "8": 31, "9": 30, "10": 31, "11": 30, "12": 31,
};

function buildPayrollPeriodLabel(month: string, year: string) {
  const days = DAYS_IN_MONTH[month] ?? 30;
  return `1 - ${days} ${MONTH_LABELS[month]} ${year}`;
}

interface PayrollInfoValues {
  month: string;
  year: string;
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
    month: defaultValues?.month ?? "6",
    year: defaultValues?.year ?? "2026",
    branch: defaultValues?.branch ?? "all",
    department: defaultValues?.department ?? "all",
  });

  function update<K extends keyof PayrollInfoValues>(key: K, value: PayrollInfoValues[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    onChange?.(next);
  }

  const payrollPeriodLabel = buildPayrollPeriodLabel(values.month, values.year);

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

          {/* Derived from month + year, so it's read-only rather than user-editable */}
          <SelectField
            label="فترة الرواتب"
            placeholder="فترة الرواتب"
            value={payrollPeriodLabel}
            onChange={() => {}}
            options={[{ value: payrollPeriodLabel, label: payrollPeriodLabel }]}
            // disabled
          />
       

          <SelectField
            label="الفرع"
            placeholder="اختر الفرع"
            value={values.branch}
            onChange={(v) => update("branch", v)}
            options={BRANCH_OPTIONS}
          />

          <SelectField
            label="القسم"
            placeholder="اختر القسم"
            value={values.department}
            onChange={(v) => update("department", v)}
            options={DEPARTMENT_OPTIONS}
          />
      </FormSection>
    </form>
  );
}