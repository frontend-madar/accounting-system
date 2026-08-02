import { api } from "@/lib/axios";
import type {
  GetDeferredAccountsParams,
  GetDeferredAccountsResponse,
  CreateDeferredAccountPayload,
  CreateDeferredAccountResponse,
  UpdateDeferredAccountPayload,
  UpdateDeferredAccountResponse,
  DeleteDeferredAccountResponse,
} from "@/types/deferred-account.types";

export const deferredAccountService = {
  getDeferredAccounts: (params: GetDeferredAccountsParams = {}) =>
    api
      .get<GetDeferredAccountsResponse>("/deferred-accounts", { params })
      .then((res) => res.data),

  createDeferredAccount: (payload: CreateDeferredAccountPayload) =>
    api
      .post<CreateDeferredAccountResponse>("/deferred-accounts", payload)
      .then((res) => res.data),

  updateDeferredAccount: (
    accountId: string,
    payload: UpdateDeferredAccountPayload
  ) =>
    api
      .patch<UpdateDeferredAccountResponse>(
        `/deferred-accounts/${accountId}`,
        payload
      )
      .then((res) => res.data),

  deleteDeferredAccount: (accountId: string) =>
    api
      .delete<DeleteDeferredAccountResponse>(`/deferred-accounts/${accountId}`)
      .then((res) => res.data),
};