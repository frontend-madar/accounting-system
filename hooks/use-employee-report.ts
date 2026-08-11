import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { employeeReportService } from "@/services/employee-report.service";
import { getErrorMessage } from "@/lib/axios";
import type {
  GetEmployeeReportsParams,
  CreateEmployeeReportPayload,
  UpdateEmployeeReportPayload,
  ExportEmployeeReportsEmailParams,
} from "@/types/employee-report.types";

export const EMPLOYEE_REPORTS_QUERY_KEY = "employee-reports";

// ── Query Hooks ────────────────────────────────────────────────────────────

export function useEmployeeReports(params: GetEmployeeReportsParams = {}) {
  return useQuery({
    queryKey: [EMPLOYEE_REPORTS_QUERY_KEY, params],
    queryFn: () => employeeReportService.getEmployeeReports(params),
  });
}

export function useEmployeeReport(id?: string) {
  return useQuery({
    queryKey: [EMPLOYEE_REPORTS_QUERY_KEY, id],
    queryFn: () => employeeReportService.getEmployeeReportById(id as string),
    enabled: !!id,
  });
}

// ── Mutation Hooks ─────────────────────────────────────────────────────────

export function useCreateEmployeeReport() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CreateEmployeeReportPayload) =>
      employeeReportService.createEmployeeReport(payload),
    onSuccess: (res) => {
      toast.success(res.message || "تم إضافة التقرير بنجاح");
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_REPORTS_QUERY_KEY] });
      router.push("/dashboard/employee-reports");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء إضافة التقرير"));
    },
  });
}

export function useUpdateEmployeeReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateEmployeeReportPayload;
    }) => employeeReportService.updateEmployeeReport(id, payload),
    onSuccess: (res) => {
      toast.success(res.message || "تم تحديث التقرير بنجاح");
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_REPORTS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء تحديث التقرير"));
    },
  });
}

export function useDeleteEmployeeReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeReportService.deleteEmployeeReport(id),
    onSuccess: (res) => {
      toast.success(res.message || "تم حذف التقرير بنجاح");
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_REPORTS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء حذف التقرير"));
    },
  });
}

// ── Export Hooks ───────────────────────────────────────────────────────────

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function useExportEmployeeReportsPdf() {
  return useMutation({
    mutationFn: (params: GetEmployeeReportsParams = {}) =>
      employeeReportService.exportEmployeeReportsPdf(params),
    onSuccess: (blob) => {
      downloadBlob(
        blob,
        `employee-reports-${new Date().toISOString().slice(0, 10)}.pdf`
      );
      toast.success("تم تنزيل الملف بنجاح");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر تصدير الملف"));
    },
  });
}

export function useExportEmployeeReportsExcel() {
  return useMutation({
    mutationFn: (params: GetEmployeeReportsParams = {}) =>
      employeeReportService.exportEmployeeReportsExcel(params),
    onSuccess: (blob) => {
      downloadBlob(
        blob,
        `employee-reports-${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      toast.success("تم تنزيل الملف بنجاح");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر تصدير الملف"));
    },
  });
}

export function useExportEmployeeReportsEmail() {
  return useMutation({
    mutationFn: (params: ExportEmployeeReportsEmailParams) =>
      employeeReportService.exportEmployeeReportsEmail(params),
    onSuccess: (res) => {
      toast.success(res.message || "تم إرسال الملف بالبريد الإلكتروني بنجاح");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر إرسال الملف بالبريد الإلكتروني"));
    },
  });
}