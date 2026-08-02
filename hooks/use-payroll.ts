// hooks/use-payroll.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { payrollService } from "@/services/payroll.service";
import { getErrorMessage } from "@/lib/axios";
import type {
  CreatePayrollRunPayload,
  UpdatePayrollRunPayload,
  UpdatePayrollRunStatusPayload,
  GetPayrollRunsParams,
  GetPayrollDetailsParams,
  UpdatePayrollDetailPayload,
} from "@/types/payroll.types";

// ── Query Keys ───────────────────────────────────────────────────────────────

export const PAYROLL_RUNS_KEY = "payroll-runs";
export const PAYROLL_DETAILS_KEY = "payroll-details";

// ── Payroll Runs ─────────────────────────────────────────────────────────────

/** Fetch paginated list of payroll runs. */
export function usePayrollRuns(params: GetPayrollRunsParams = {}) {
  return useQuery({
    queryKey: [PAYROLL_RUNS_KEY, params],
    queryFn: () => payrollService.getPayrollRuns(params),
  });
}

/** Fetch a single payroll run with its detail rows. */
export function usePayrollRunById(id: string | undefined) {
  return useQuery({
    queryKey: [PAYROLL_RUNS_KEY, id],
    queryFn: () => payrollService.getPayrollRunById(id!),
    enabled: !!id,
  });
}

/** Create a new payroll run. */
export function useCreatePayrollRun() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePayrollRunPayload) =>
      payrollService.createPayrollRun(payload),
    onSuccess: (res) => {
      toast.success(res.message ?? "تم إنشاء مسير الراتب بنجاح");
      queryClient.invalidateQueries({ queryKey: [PAYROLL_RUNS_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء إنشاء مسير الراتب"));
    },
  });
}

/** Update an existing payroll run (employees / dates). */
export function useUpdatePayrollRun() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePayrollRunPayload }) =>
      payrollService.updatePayrollRun(id, payload),
    onSuccess: (res) => {
      toast.success(res.message ?? "تم تحديث مسير الراتب بنجاح");
      queryClient.invalidateQueries({ queryKey: [PAYROLL_RUNS_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء تحديث مسير الراتب"));
    },
  });
}

/** Update only the status of a payroll run (مسودة / معتمدة). */
export function useUpdatePayrollRunStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePayrollRunStatusPayload;
    }) => payrollService.updatePayrollRunStatus(id, payload),
    onSuccess: (res) => {
      toast.success(res.message ?? "تم تحديث الحالة بنجاح");
      queryClient.invalidateQueries({ queryKey: [PAYROLL_RUNS_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء تحديث الحالة"));
    },
  });
}

/** Delete a payroll run by ID. */
export function useDeletePayrollRun() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => payrollService.deletePayrollRun(id),
    onSuccess: () => {
      toast.success("تم حذف مسير الراتب بنجاح");
      queryClient.invalidateQueries({ queryKey: [PAYROLL_RUNS_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء حذف مسير الراتب"));
    },
  });
}

// ── Payroll Details ──────────────────────────────────────────────────────────

/** Fetch paginated payroll detail rows (filter by payrollRunId / search). */
export function usePayrollDetails(params: GetPayrollDetailsParams = {}) {
  return useQuery({
    queryKey: [PAYROLL_DETAILS_KEY, params],
    queryFn: () => payrollService.getPayrollDetails(params),
  });
}

/** Fetch a single payroll detail row by its ID. */
export function usePayrollDetailById(id: string | undefined) {
  return useQuery({
    queryKey: [PAYROLL_DETAILS_KEY, id],
    queryFn: () => payrollService.getPayrollDetailById(id!),
    enabled: !!id,
  });
}

/** Update salary fields for one employee detail row. */
export function useUpdatePayrollDetail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePayrollDetailPayload;
    }) => payrollService.updatePayrollDetail(id, payload),
    onSuccess: () => {
      toast.success("تم تحديث بيانات الراتب بنجاح");
      queryClient.invalidateQueries({ queryKey: [PAYROLL_DETAILS_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء تحديث بيانات الراتب"));
    },
  });
}

/** Delete a single payroll detail row. */
export function useDeletePayrollDetail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => payrollService.deletePayrollDetail(id),
    onSuccess: () => {
      toast.success("تم حذف سجل الراتب بنجاح");
      queryClient.invalidateQueries({ queryKey: [PAYROLL_DETAILS_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء حذف سجل الراتب"));
    },
  });
}
