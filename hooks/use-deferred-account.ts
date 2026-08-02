import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deferredAccountService } from "@/services/deferred-account.service";
import { getErrorMessage } from "@/lib/axios";
import type {
  GetDeferredAccountsParams,
  CreateDeferredAccountPayload,
  UpdateDeferredAccountPayload,
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