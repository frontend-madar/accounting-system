"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEmployeeReport, useUpdateEmployeeReport } from "@/hooks/use-employee-report";
import { Loader2 } from "lucide-react";

const updateReportSchema = z.object({
  employeeId: z.string().min(1, "معرف الموظف مطلوب"),
  clientName: z.string().min(1, "اسم العميل مطلوب"),
  paymentDate: z.string().min(1, "تاريخ الدفع مطلوب"),
  target: z.number().min(0, "التارجت يجب أن يكون أكبر من 0"),
});

type UpdateReportFormValues = z.infer<typeof updateReportSchema>;

interface UpdateEmployeeReportFormProps {
  reportId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateEmployeeReportForm({
  reportId,
  open,
  onOpenChange,
}: UpdateEmployeeReportFormProps) {
  const { data: reportRes, isLoading: isLoadingReport } = useEmployeeReport(reportId || undefined);
  const { mutate: updateReport, isPending: isUpdating } = useUpdateEmployeeReport();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateReportFormValues>({
    resolver: zodResolver(updateReportSchema),
  });

  useEffect(() => {
    if (reportRes?.data) {
      reset({
        employeeId: reportRes.data.employeeId,
        clientName: reportRes.data.clientName,
        paymentDate: reportRes.data.paymentDate.split("T")[0],
        target: reportRes.data.target,
      });
    }
  }, [reportRes, reset]);

  const onSubmit = (data: UpdateReportFormValues) => {
    if (!reportId) return;
    updateReport(
      { id: reportId, payload: data },
      {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>تعديل تقرير الموظف</DialogTitle>
        </DialogHeader>

        {isLoadingReport ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#40369F]" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="employeeId">معرف الموظف</Label>
              <Input
                id="employeeId"
                {...register("employeeId")}
                placeholder="أدخل معرف الموظف"
                className="mt-1"
              />
              {errors.employeeId && (
                <p className="text-sm text-red-500 mt-1">{errors.employeeId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="clientName">اسم العميل</Label>
              <Input
                id="clientName"
                {...register("clientName")}
                placeholder="أدخل اسم العميل"
                className="mt-1"
              />
              {errors.clientName && (
                <p className="text-sm text-red-500 mt-1">{errors.clientName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="paymentDate">تاريخ الدفع</Label>
              <Input
                id="paymentDate"
                type="date"
                {...register("paymentDate")}
                className="mt-1"
              />
              {errors.paymentDate && (
                <p className="text-sm text-red-500 mt-1">{errors.paymentDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="target">التارجت</Label>
              <Input
                id="target"
                type="number"
                {...register("target", { valueAsNumber: true })}
                placeholder="أدخل قيمة التارجت"
                className="mt-1"
              />
              {errors.target && (
                <p className="text-sm text-red-500 mt-1">{errors.target.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="bg-[#40369F] hover:bg-[#322A7C]"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    جاري التحديث...
                  </>
                ) : (
                  "تحديث"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}