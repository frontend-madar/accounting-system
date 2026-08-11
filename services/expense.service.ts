import { api } from "@/lib/axios";
import type {
  CreateExpensePayload,
  CreateExpenseResponse,
  UpdateExpensePayload,
  UpdateExpenseResponse,
  GetExpenseByIdResponse,
  GetExpensesParams,
  GetExpensesResponse,
  GetExpenseCategoriesResponse,
  GetPaymentMethodsResponse,
  GetExpenseAccountsResponse,
  GetExpensePeriodsResponse,
  GetExpenseDashboardResponse,
  ExportExpensesEmailParams,
} from "@/types/expense.types";

// `document` is a file upload, so create/update go out as multipart form-data.
function buildExpenseFormData(payload: Partial<CreateExpensePayload>) {
  const formData = new FormData();

  if (payload.amount !== undefined) formData.append("amount", String(payload.amount));
  if (payload.currency) formData.append("currency", payload.currency);
  if (payload.expenseDate) formData.append("expenseDate", payload.expenseDate);
  if (payload.category) formData.append("category", payload.category);
  if (payload.paymentMethodId) formData.append("paymentMethodId", payload.paymentMethodId);
  if (payload.accountId) formData.append("accountId", payload.accountId);
  if (payload.status) formData.append("status", payload.status);
  if (payload.payeePhone) formData.append("payeePhone", payload.payeePhone);
  if (payload.notes) formData.append("notes", payload.notes);
  if (payload.document) formData.append("document", payload.document);

  return formData;
}

export const expenseService = {
  getExpenses: (params: GetExpensesParams = {}) =>
    api.get<GetExpensesResponse>("/expenses", { params }).then((res) => res.data),

  getExpenseById: (id: string) =>
    api.get<GetExpenseByIdResponse>(`/expenses/${id}`).then((res) => res.data),

  createExpense: (payload: CreateExpensePayload) =>
    api
      .post<CreateExpenseResponse>("/expenses", buildExpenseFormData(payload), {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),

  updateExpense: (id: string, payload: UpdateExpensePayload) =>
    api
      .patch<UpdateExpenseResponse>(`/expenses/${id}`, buildExpenseFormData(payload), {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),

  deleteExpense: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/expenses/${id}`).then((res) => res.data),

  getCategories: () =>
    api.get<GetExpenseCategoriesResponse>("/expenses/categories").then((res) => res.data),

  getPaymentMethods: () =>
    api.get<GetPaymentMethodsResponse>("/expenses/payment-methods").then((res) => res.data),

  getAccounts: () =>
    api.get<GetExpenseAccountsResponse>("/expenses/accounts").then((res) => res.data),

  getPeriods: () =>
    api.get<GetExpensePeriodsResponse>("/expenses/periods").then((res) => res.data),

  getDashboardStats: () =>
    api.get<GetExpenseDashboardResponse>("/expenses/dashboard").then((res) => res.data),

  exportExpensesPdf: (params: GetExpensesParams = {}) =>
    api
      .get("/export/expenses/pdf", {
        params,
        responseType: "blob",
      })
      .then((res) => res.data as Blob),

  exportExpensesExcel: (params: GetExpensesParams = {}) =>
    api
      .get("/export/expenses/excel", {
        params,
        responseType: "blob",
      })
      .then((res) => res.data as Blob),

  exportExpensesEmail: ({ to }: ExportExpensesEmailParams) =>
    api
      .post<{ success: boolean; message: string }>(
        "/export/expenses/email",
        {}, // empty JSON body — avoids "null is not valid JSON" on strict body parsers
        { params: { to } }
      )
      .then((res) => res.data),
};