import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { expenseService } from "@/services/expense.service";
import { getErrorMessage } from "@/lib/axios";
import type {
  CreateExpensePayload,
  UpdateExpensePayload,
  GetExpensesParams,
  ExportExpensesEmailParams,
} from "@/types/expense.types";

export const EXPENSES_QUERY_KEY = "expenses";
export const EXPENSE_CATEGORIES_QUERY_KEY = "expense-categories";
export const EXPENSE_PAYMENT_METHODS_QUERY_KEY = "expense-payment-methods";
export const EXPENSE_ACCOUNTS_QUERY_KEY = "expense-accounts";
export const EXPENSE_PERIODS_QUERY_KEY = "expense-periods";
export const EXPENSE_DASHBOARD_QUERY_KEY = "expense-dashboard";

export function useExpenses(params: GetExpensesParams = {}) {
  return useQuery({
    queryKey: [EXPENSES_QUERY_KEY, params],
    queryFn: () => expenseService.getExpenses(params),
  });
}

export function useExpense(id: string | null) {
  return useQuery({
    queryKey: [EXPENSES_QUERY_KEY, id],
    queryFn: () => expenseService.getExpenseById(id as string),
    enabled: !!id,
  });
}

export function useExpenseCategories() {
  return useQuery({
    queryKey: [EXPENSE_CATEGORIES_QUERY_KEY],
    queryFn: () => expenseService.getCategories(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useExpensePaymentMethods() {
  return useQuery({
    queryKey: [EXPENSE_PAYMENT_METHODS_QUERY_KEY],
    queryFn: () => expenseService.getPaymentMethods(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useExpenseAccounts() {
  return useQuery({
    queryKey: [EXPENSE_ACCOUNTS_QUERY_KEY],
    queryFn: () => expenseService.getAccounts(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useExpensePeriods() {
  return useQuery({
    queryKey: [EXPENSE_PERIODS_QUERY_KEY],
    queryFn: () => expenseService.getPeriods(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useExpenseDashboard() {
  return useQuery({
    queryKey: [EXPENSE_DASHBOARD_QUERY_KEY],
    queryFn: () => expenseService.getDashboardStats(),
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExpensePayload) => expenseService.createExpense(payload),
    onSuccess: (res) => {
      toast.success(res.message || "تم إضافة المصروف بنجاح");
      queryClient.invalidateQueries({ queryKey: [EXPENSES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [EXPENSE_DASHBOARD_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [EXPENSE_CATEGORIES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [EXPENSE_PERIODS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء إضافة المصروف"));
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateExpensePayload }) =>
      expenseService.updateExpense(id, payload),
    onSuccess: (res) => {
      toast.success(res.message || "تم تحديث المصروف بنجاح");
      queryClient.invalidateQueries({ queryKey: [EXPENSES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [EXPENSE_DASHBOARD_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء تحديث المصروف"));
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expenseService.deleteExpense(id),
    onSuccess: (res) => {
      toast.success(res.message || "تم حذف المصروف بنجاح");
      queryClient.invalidateQueries({ queryKey: [EXPENSES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [EXPENSE_DASHBOARD_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء حذف المصروف"));
    },
  });
}

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

export function useExportExpensesPdf() {
  return useMutation({
    mutationFn: (params: GetExpensesParams = {}) => expenseService.exportExpensesPdf(params),
    onSuccess: (blob) => {
      downloadBlob(blob, `expenses-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("تم تنزيل الملف بنجاح");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر تصدير الملف"));
    },
  });
}

export function useExportExpensesExcel() {
  return useMutation({
    mutationFn: (params: GetExpensesParams = {}) => expenseService.exportExpensesExcel(params),
    onSuccess: (blob) => {
      downloadBlob(blob, `expenses-${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast.success("تم تنزيل الملف بنجاح");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر تصدير الملف"));
    },
  });
}

export function useExportExpensesEmail() {
  return useMutation({
    mutationFn: (params: ExportExpensesEmailParams) => expenseService.exportExpensesEmail(params),
    onSuccess: (res) => {
      toast.success(res.message || "تم إرسال الملف بالبريد الإلكتروني بنجاح");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر إرسال الملف بالبريد الإلكتروني"));
    },
  });
}