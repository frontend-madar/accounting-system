import { api } from "@/lib/axios";
import type {
  GetDeferredAccountsParams,
  GetDeferredAccountsResponse,
  CreateDeferredAccountPayload,
  CreateDeferredAccountResponse,
  UpdateDeferredAccountPayload,
  UpdateDeferredAccountResponse,
  DeleteDeferredAccountResponse,
  ExportDeferredAccountsEmailParams,
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

  exportDeferredAccountsPdf: (params: GetDeferredAccountsParams = {}) =>
    api
      .get("/export/deferred-accounts/pdf", {
        params,
        responseType: "blob",
      })
      .then((res) => res.data as Blob),

  exportDeferredAccountsExcel: (params: GetDeferredAccountsParams = {}) =>
    api
      .get("/export/deferred-accounts/excel", {
        params,
        responseType: "blob",
      })
      .then((res) => res.data as Blob),

  exportDeferredAccountsEmail: ({ to }: ExportDeferredAccountsEmailParams) =>
    api
      .post<{ success: boolean; message: string }>(
        "/export/deferred-accounts/email",
        {}, // empty JSON body
        { params: { to } }
      )
      .then((res) => res.data),
};