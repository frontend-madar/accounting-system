// types/payroll.types.ts

// ── Shared ──────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedList<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Payroll Run ──────────────────────────────────────────────────────────────

export type PayrollRunStatus = "مسودة" | "معتمدة" | "كانسل";

export interface PayrollDetailEmployee {
  id: string;
  fullName: string;
  email: string;
  department: string;
  jobTitle: string;
}

export interface PayrollDetailItem {
  id: string;
  payrollRunId: string;
  employeeId: string;
  basicSalary: number;
  allowances: number;
  bonuses: number;
  overtime: number;
  deductions: number;
  netSalary: number;
  createdAt: string;
  updatedAt: string;
  employee: PayrollDetailEmployee;
}

export interface PayrollRun {
  id: string;
  runNumber: string;
  year: number;
  month: number;
  startDate: string;
  endDate: string;
  status: PayrollRunStatus;
  createdAt: string;
  updatedAt?: string;
  details?: PayrollDetailItem[];
}

export interface PayrollRunListItem {
  id: string;
  runNumber: string;
  year: number;
  month: number;
  startDate: string;
  endDate: string;
  status: PayrollRunStatus;
  employeeCount: number;
  totalNetSalary: number;
  createdAt: string;
}

// ── Payroll Run Request Payloads ─────────────────────────────────────────────

export interface CreatePayrollRunPayload {
  year: number;
  month: number;
  startDate: string;
  endDate: string;
  employeeIds: string[];
}

export type UpdatePayrollRunPayload = Partial<CreatePayrollRunPayload>;

export interface UpdatePayrollRunStatusPayload {
  status: PayrollRunStatus;
}

// ── Payroll Run API Response Types ───────────────────────────────────────────

export type CreatePayrollRunResponse = ApiResponse<PayrollRun>;
export type GetPayrollRunsResponse = ApiResponse<PaginatedList<PayrollRunListItem>>;
export type GetPayrollRunByIdResponse = ApiResponse<PayrollRun>;
export type UpdatePayrollRunResponse = ApiResponse<PayrollRun>;

// ── Payroll Details ──────────────────────────────────────────────────────────

export interface GetPayrollDetailsParams {
  payrollRunId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UpdatePayrollDetailPayload {
  basicSalary?: number;
  allowances?: number;
  bonuses?: number;
  overtime?: number;
  deductions?: number;
}

export type GetPayrollDetailsResponse = ApiResponse<PaginatedList<PayrollDetailItem>>;
export type GetPayrollDetailByIdResponse = ApiResponse<PayrollDetailItem>;
export type UpdatePayrollDetailResponse = ApiResponse<PayrollDetailItem>;

// ── Payroll Runs List Params ─────────────────────────────────────────────────

export interface GetPayrollRunsParams {
  page?: number;
  limit?: number;
  search?: string;
  month?: number;
  year?: number;
}

 
export interface ExportPayrollRunsEmailParams {
  to: string;
}

export interface ExportPayrollRunsResponse {
  success: boolean;
  message: string;
  data?: Blob | any;
}