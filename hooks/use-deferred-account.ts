import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deferredAccountService } from "@/services/deferred-account.service";
import { getErrorMessage } from "@/lib/axios";
import type {
  GetDeferredAccountsParams,
  CreateDeferredAccountPayload,
  UpdateDeferredAccountPayload,
  ExportDeferredAccountsEmailParams,
} from "@/types/deferred-account.types";

export const DEFERRED_ACCOUNTS_QUERY_KEY = "deferred-accounts";

export function useDeferredAccounts(params: GetDeferredAccountsParams = {}) {
  return useQuery({
    queryKey: [DEFERRED_ACCOUNTS_QUERY_KEY, params],
    queryFn: () => deferredAccountService.getDeferredAccounts(params),
  });
}

export function useCreateDeferredAccount() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CreateDeferredAccountPayload) =>
      deferredAccountService.createDeferredAccount(payload),
    onSuccess: (res) => {
      toast.success(res.message || "تم إضافة الحساب الآجل بنجاح");
      queryClient.invalidateQueries({ queryKey: [DEFERRED_ACCOUNTS_QUERY_KEY] });
      router.push("/dashboard/credit-accounts");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء إضافة الحساب الآجل"));
    },
  });
}

export function useDeferredAccount(accountId: string | null) {
  return useQuery({
    queryKey: [DEFERRED_ACCOUNTS_QUERY_KEY, "detail", accountId],
    queryFn: () => deferredAccountService.getDeferredAccountById(accountId as string),
    select: (res) => res.data,
    enabled: !!accountId,
  });
}

export function useUpdateDeferredAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accountId,
      payload,
    }: {
      accountId: string;
      payload: UpdateDeferredAccountPayload;
    }) => deferredAccountService.updateDeferredAccount(accountId, payload),
    onSuccess: (res) => {
      toast.success(res.message || "تم تحديث الحساب الآجل بنجاح");
      queryClient.invalidateQueries({ queryKey: [DEFERRED_ACCOUNTS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء تحديث الحساب الآجل"));
    },
  });
}

export function useDeleteDeferredAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) =>
      deferredAccountService.deleteDeferredAccount(accountId),
    onSuccess: (res) => {
      toast.success(res.message || "تم حذف الحساب الآجل بنجاح");
      queryClient.invalidateQueries({ queryKey: [DEFERRED_ACCOUNTS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء حذف الحساب الآجل"));
    },
  });
}

// NEW: Export hooks
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

export function useExportDeferredAccountsPdf() {
  return useMutation({
    mutationFn: (params: GetDeferredAccountsParams = {}) =>
      deferredAccountService.exportDeferredAccountsPdf(params),
    onSuccess: (blob) => {
      downloadBlob(blob, `deferred-accounts-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("تم تنزيل الملف بنجاح");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر تصدير الملف"));
    },
  });
}

export function useExportDeferredAccountsExcel() {
  return useMutation({
    mutationFn: (params: GetDeferredAccountsParams = {}) =>
      deferredAccountService.exportDeferredAccountsExcel(params),
    onSuccess: (blob) => {
      downloadBlob(blob, `deferred-accounts-${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast.success("تم تنزيل الملف بنجاح");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر تصدير الملف"));
    },
  });
}

export function useExportDeferredAccountsEmail() {
  return useMutation({
    mutationFn: (params: ExportDeferredAccountsEmailParams) =>
      deferredAccountService.exportDeferredAccountsEmail(params),
    onSuccess: (res) => {
      toast.success(res.message || "تم إرسال الملف بالبريد الإلكتروني بنجاح");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر إرسال الملف بالبريد الإلكتروني"));
    },
  });
}