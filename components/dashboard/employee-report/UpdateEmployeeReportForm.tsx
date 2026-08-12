"use client";

import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, X, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { FormSection } from "../invoice/FormSection";
import { InvoiceTextField } from "../invoice/TextField";
import { SelectField } from "../invoice/SelectField";
import { FieldLabel } from "../invoice/FieldLabel";
import { DateField } from "../Datefield";
import MainButton from "../shared/MainButton";
import SecondaryButton from "../shared/SecondaryButton";
import { useEmployeeReport, useUpdateEmployeeReport } from "@/hooks/use-employee-report";
import { useEmployees } from "@/hooks/use-employee";

const updateReportSchema = z.object({
  employeeId: z.string().min(1, "الموظف مطلوب"),
  clientName: z.string().min(1, "اسم العميل مطلوب"),
  paymentDate: z.string().min(1, "تاريخ الدفع مطلوب"),
  target: z.number().min(0, "التارجت يجب أن يكون أكبر من 0"),
  manuallyOverridden: z.boolean(),
});

type UpdateReportFormValues = z.infer<typeof updateReportSchema>;

interface UpdateEmployeeReportFormProps {
  reportId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ORIGIN_LABELS: Record<string, string> = {
  MANUAL: "يدوي",
  JOURNAL: "قيد يومية",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const MONTH_LABELS = [
  "يناير", "فبراير", "مارس", "ابريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

function UpdateReportFormSkeleton() {
  return (
    <div className="space-y-8 pt-2">
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
      <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
        <Skeleton className="h-11 w-[110px] rounded-md" />
        <Skeleton className="h-11 w-[150px] rounded-md" />
      </div>
    </div>
  );
}

export function UpdateEmployeeReportForm({
  reportId,
  open,
  onOpenChange,
}: UpdateEmployeeReportFormProps) {
  const { data: reportRes, isLoading: isLoadingReport } = useEmployeeReport(
    open ? reportId || undefined : undefined
  );
  const { mutate: updateReport, isPending: isUpdating } = useUpdateEmployeeReport();

  const { data: employeesRes } = useEmployees({ limit: 100 });
  const employeeList = useMemo(() => employeesRes?.data?.data ?? [], [employeesRes]);
  const employeeOptions = useMemo(
    () => employeeList.map((e) => ({ label: e.fullName, value: e.id })),
    [employeeList]
  );

  const report = reportRes?.data;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateReportFormValues>({
    resolver: zodResolver(updateReportSchema),
    values: report
      ? {
          employeeId: report.employeeId,
          clientName: report.clientName,
          paymentDate: report.paymentDate.split("T")[0],
          target: report.target,
          manuallyOverridden: report.manuallyOverridden,
        }
      : undefined,
  });

  function onSubmit(values: UpdateReportFormValues) {
    if (!reportId) return;
    updateReport(
      { id: reportId, payload: values },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-5xl overflow-y-auto">
        <DialogHeader className="mt-4">
          <DialogTitle>تعديل تقرير الموظف</DialogTitle>
        </DialogHeader>

        {isLoadingReport || !report ? (
          <UpdateReportFormSkeleton />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-2">
            <FormSection title="بيانات التقرير" gridClassName="!grid-cols-1 md:!grid-cols-2">
              <Controller
                control={control}
                name="employeeId"
                render={({ field }) => (
                  <SelectField
                    label="الموظف"
                    placeholder="اختر الموظف"
                    value={field.value}
                    onChange={field.onChange}
                    options={employeeOptions}
                    error={errors.employeeId?.message}
                  />
                )}
              />
              <InvoiceTextField
                label="اسم العميل"
                placeholder="أدخل اسم العميل"
                error={errors.clientName?.message}
                {...register("clientName")}
              />
              <Controller
                control={control}
                name="paymentDate"
                render={({ field }) => (
                  <DateField
                    label="تاريخ الدفع"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.paymentDate?.message}
                  />
                )}
              />
              <InvoiceTextField
                label="التارجت"
                type="number"
                placeholder="أدخل قيمة التارجت"
                inputMode="decimal"
                error={errors.target?.message}
                {...register("target", { valueAsNumber: true })}
              />
            </FormSection>
            

            {/* Read-only metadata */}
            <div>
              <FieldLabel htmlFor="meta" dropdown={false} className="mb-2">
                <span className="flex items-center gap-1.5 text-[#232323] text-[14px] md:text-[16px]">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  معلومات إضافية
                </span>
              </FieldLabel>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-lg border border-[#EEEEF0] p-3">
                    <p className="text-[12px] text-muted-foreground">الفترة</p>
                    <p className="mt-1 text-[14px] font-medium text-[#232323]">
                        {MONTH_LABELS[report.month - 1]} {report.year}
                    </p>
                </div>
                <div className="rounded-lg border border-[#EEEEF0] p-3">
                    <p className="text-[12px] text-muted-foreground">المصدر</p>
                    <p className="mt-1 text-[14px] font-medium text-[#232323]">
                        {ORIGIN_LABELS[report.origin] ?? report.origin}
                    </p>
                </div>
                <div className="rounded-lg border border-[#EEEEF0] p-3">
                    <p className="text-[12px] text-muted-foreground">تاريخ الإنشاء</p>
                    <p className="mt-1 text-[14px] font-medium text-[#232323]">
                        {formatDateTime(report.createdAt)}
                    </p>
                </div>
                <div className="rounded-lg border border-[#EEEEF0] p-3">
                    <p className="text-[12px] text-muted-foreground">آخر تحديث</p>
                    <p className="mt-1 text-[14px] font-medium text-[#232323]">
                        {formatDateTime(report.updatedAt)}
                    </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
              <SecondaryButton
                type="button"
                text="إلغاء"
                icon={<X className="h-4 w-4" />}
                onClick={() => onOpenChange(false)}
                className="!w-[110px]"
              />
              <MainButton
                text="تحديث"
                icon={<Save className="h-4 w-4" />}
                className="!w-[150px]"
                disabled={isUpdating}
              />
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}