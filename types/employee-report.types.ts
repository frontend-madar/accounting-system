export interface EmployeeReport {
  id: string;
  employeeId: string;
  employeeName: string;
  clientId: string | null;
  clientName: string;
  paymentDate: string;
  target: number;
  month: number;
  year: number;
  origin: string;
  sourceJournalEntryId: string | null;
  manuallyOverridden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetEmployeeReportsParams {
  page?: number;
  limit?: number;
  search?: string;
  employeeId?: string;
  month?: number;
  year?: number;
}

export interface EmployeeReportsPaginatedData {
  totalTarget: number;
  totalClients: number;
  data: EmployeeReport[];
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetEmployeeReportsResponse {
  success: boolean;
  data: EmployeeReportsPaginatedData;
  message: string;
}

export interface GetEmployeeReportResponse {
  success: boolean;
  data: EmployeeReport;
  message: string;
}

export interface CreateEmployeeReportPayload {
  employeeId: string;
  clientName: string;
  paymentDate: string;
  target: number;
}

export interface CreateEmployeeReportResponse {
  success: boolean;
  message: string;
  data: EmployeeReport;
}

export interface UpdateEmployeeReportPayload {
  employeeId?: string;
  clientName?: string;
  paymentDate?: string;
  target?: number;
}

export interface UpdateEmployeeReportResponse {
  success: boolean;
  message: string;
  data: EmployeeReport;
}

export interface DeleteEmployeeReportResponse {
  success: boolean;
  message: string;
}

export interface ExportEmployeeReportsEmailParams {
  to: string;
}