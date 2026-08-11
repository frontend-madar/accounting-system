import { api } from "@/lib/axios";
import type {
  GetInvoicesParams,
  GetInvoicesResponse,
  GetInvoiceResponse,
  CreateInvoicePayload,
  CreateInvoiceResponse,
  UpdateInvoicePayload,
  UpdateInvoiceResponse,
  DeleteInvoiceResponse,
  DeleteInvoicePaymentResponse,
  DeleteInvoiceIncludeResponse,
  ExportInvoicesEmailParams,
} from "@/types/invoice.types";

export const invoiceService = {
  getInvoices: (params: GetInvoicesParams = {}) =>
    api.get<GetInvoicesResponse>("/invoices", { params }).then((res) => res.data),

  getInvoiceById: (id: string) =>
    api.get<GetInvoiceResponse>(`/invoices/${id}`).then((res) => res.data),

  createInvoice: (payload: CreateInvoicePayload) =>
    api.post<CreateInvoiceResponse>("/invoices", payload).then((res) => res.data),

  updateInvoice: (id: string, payload: UpdateInvoicePayload) =>
    api
      .patch<UpdateInvoiceResponse>(`/invoices/${id}`, payload)
      .then((res) => res.data),

  deleteInvoice: (id: string) =>
    api.delete<DeleteInvoiceResponse>(`/invoices/${id}`).then((res) => res.data),

  deleteInvoicePayment: (invoiceId: string, paymentId: string) =>
    api
      .delete<DeleteInvoicePaymentResponse>(
        `/invoices/${invoiceId}/payments/${paymentId}`
      )
      .then((res) => res.data),

  deleteInvoiceInclude: (invoiceId: string, index: number) =>
    api
      .delete<DeleteInvoiceIncludeResponse>(
        `/invoices/${invoiceId}/includes/${index}`
      )
      .then((res) => res.data),

  downloadInvoicePdf: (invoiceId: string) =>
    api
      .get(`/invoices/${invoiceId}/pdf`, { responseType: "blob" })
      .then((res) => res.data as Blob),

  exportInvoicesPdf: (params: GetInvoicesParams = {}) =>
    api
      .get("/export/invoices/pdf", {
        params,
        responseType: "blob",
      })
      .then((res) => res.data as Blob),

  exportInvoicesExcel: (params: GetInvoicesParams = {}) =>
    api
      .get("/export/invoices/excel", {
        params,
        responseType: "blob",
      })
      .then((res) => res.data as Blob),

  exportInvoicesEmail: ({ to }: ExportInvoicesEmailParams) =>
    api
      .post<{ success: boolean; message: string }>(
        "/export/invoices/email",
        {}, // empty JSON body — avoids "null is not valid JSON" on strict body parsers
        { params: { to } }
      )
      .then((res) => res.data),
};