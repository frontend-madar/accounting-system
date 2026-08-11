import { api } from "@/lib/axios";
import type {
  CreatePayrollRunPayload,
  CreatePayrollRunResponse,
  GetPayrollRunsParams,
  GetPayrollRunsResponse,
  GetPayrollRunByIdResponse,
  UpdatePayrollRunPayload,
  UpdatePayrollRunResponse,
  UpdatePayrollRunStatusPayload,
  GetPayrollDetailsParams,
  GetPayrollDetailsResponse,
  GetPayrollDetailByIdResponse,
  UpdatePayrollDetailPayload,
  UpdatePayrollDetailResponse,
  ExportPayrollRunsEmailParams,
} from "@/types/payroll.types";

export const payrollService = {
  // ── Payroll Runs ────────────────────────────────────────────────────────

  /** POST /payroll-runs — create a new payroll run */
  createPayrollRun: (payload: CreatePayrollRunPayload) =>
    api
      .post<CreatePayrollRunResponse>("/payroll-runs", payload)
      .then((res) => res.data),

  /** GET /payroll-runs — list all payroll runs (paginated) */
  getPayrollRuns: (params: GetPayrollRunsParams = {}) =>
    api
      .get<GetPayrollRunsResponse>("/payroll-runs", { params })
      .then((res) => res.data),

  /** GET /payroll-runs/:id — get a single payroll run with details */
  getPayrollRunById: (id: string) =>
    api
      .get<GetPayrollRunByIdResponse>(`/payroll-runs/${id}`)
      .then((res) => res.data),

  /** PATCH /payroll-runs/:id — update a payroll run */
  updatePayrollRun: (id: string, payload: UpdatePayrollRunPayload) =>
    api
      .patch<UpdatePayrollRunResponse>(`/payroll-runs/${id}`, payload)
      .then((res) => res.data),

  /** PATCH /payroll-runs/:id/status — update payroll run status only */
  updatePayrollRunStatus: (
    id: string,
    payload: UpdatePayrollRunStatusPayload
  ) =>
    api
      .patch<UpdatePayrollRunResponse>(`/payroll-runs/${id}/status`, payload)
      .then((res) => res.data),

  /** DELETE /payroll-runs/:id — delete a payroll run */
  deletePayrollRun: (id: string) =>
    api
      .delete<{ success: boolean }>(`/payroll-runs/${id}`)
      .then((res) => res.data),

  // ── Payroll Details ─────────────────────────────────────────────────────

  /** GET /payroll-details — list detail rows (paginated, filterable) */
  getPayrollDetails: (params: GetPayrollDetailsParams = {}) =>
    api
      .get<GetPayrollDetailsResponse>("/payroll-details", { params })
      .then((res) => res.data),

  /** GET /payroll-details/:id — get a single payroll detail row */
  getPayrollDetailById: (id: string) =>
    api
      .get<GetPayrollDetailByIdResponse>(`/payroll-details/${id}`)
      .then((res) => res.data),

  /** PATCH /payroll-details/:id — update salary fields for one employee row */
  updatePayrollDetail: (id: string, payload: UpdatePayrollDetailPayload) =>
    api
      .patch<UpdatePayrollDetailResponse>(`/payroll-details/${id}`, payload)
      .then((res) => res.data),

  /** DELETE /payroll-details/:id — remove one payroll detail row */
  deletePayrollDetail: (id: string) =>
    api
      .delete<{ success: boolean }>(`/payroll-details/${id}`)
      .then((res) => res.data),

  // ── Export Functions ────────────────────────────────────────────────────

  
  exportPayrollRunPdf: () =>
    api
      .get(`/export/payroll-runs/pdf`, {
        responseType: "blob",
      })
      .then((res) => res.data as Blob),

  
  exportPayrollRunExcel: () =>
    api
      .get(`/export/payroll-runs/excel`, {
        responseType: "blob",
      })
      .then((res) => res.data as Blob),

  
  exportPayrollRunEmail: ({ to }: { to: string }) =>
    api
      .post<{ success: boolean; message: string }>(
        `/export/payroll-runs/email`,
        { to }
      )
      .then((res) => res.data),
};