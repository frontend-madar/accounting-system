import { api } from "@/lib/axios";
import type {
  GetEmployeeReportsParams,
  GetEmployeeReportsResponse,
  GetEmployeeReportResponse,
  CreateEmployeeReportPayload,
  CreateEmployeeReportResponse,
  UpdateEmployeeReportPayload,
  UpdateEmployeeReportResponse,
  DeleteEmployeeReportResponse,
  ExportEmployeeReportsEmailParams,
} from "@/types/employee-report.types";

export const employeeReportService = {
  // ── CRUD Operations ─────────────────────────────────────────────────────

  /** GET /employee-reports — list all employee reports */
  getEmployeeReports: (params: GetEmployeeReportsParams = {}) =>
    api
      .get<GetEmployeeReportsResponse>("/employee-reports", { params })
      .then((res) => res.data),

  /** GET /employee-reports/:id — get single report by ID */
  getEmployeeReportById: (id: string) =>
    api
      .get<GetEmployeeReportResponse>(`/employee-reports/${id}`)
      .then((res) => res.data),

  /** POST /employee-reports — create new report */
  createEmployeeReport: (payload: CreateEmployeeReportPayload) =>
    api
      .post<CreateEmployeeReportResponse>("/employee-reports", payload)
      .then((res) => res.data),

  /** PATCH /employee-reports/:id — update report */
  updateEmployeeReport: (id: string, payload: UpdateEmployeeReportPayload) =>
    api
      .patch<UpdateEmployeeReportResponse>(`/employee-reports/${id}`, payload)
      .then((res) => res.data),

  /** DELETE /employee-reports/:id — delete report */
  deleteEmployeeReport: (id: string) =>
    api
      .delete<DeleteEmployeeReportResponse>(`/employee-reports/${id}`)
      .then((res) => res.data),

  // ── Export Functions ────────────────────────────────────────────────────

  /** GET /export/employee-reports/pdf — export as PDF */
  exportEmployeeReportsPdf: (params: GetEmployeeReportsParams = {}) =>
    api
      .get("/export/employee-reports/pdf", {
        params,
        responseType: "blob",
      })
      .then((res) => res.data as Blob),

  /** GET /export/employee-reports/excel — export as Excel */
  exportEmployeeReportsExcel: (params: GetEmployeeReportsParams = {}) =>
    api
      .get("/export/employee-reports/excel", {
        params,
        responseType: "blob",
      })
      .then((res) => res.data as Blob),

  /** POST /export/employee-reports/email — send via email */
  exportEmployeeReportsEmail: ({ to }: ExportEmployeeReportsEmailParams) =>
    api
      .post<{ success: boolean; message: string }>(
        "/export/employee-reports/email",
        { to }
      )
      .then((res) => res.data),
};