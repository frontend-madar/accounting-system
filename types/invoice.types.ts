export interface InvoicePayment {
  id: string;
  invoiceId: string;
  paidAmount: number;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  clientId: string;
  clientName: string;
  employeeId: string;
  employeeName: string;
  invoiceNumber: string;
  service: string;
  includes: string[];
  totalPrice: number;
  currency: string;
  remainingAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  payments: InvoicePayment[];
}

export interface GetInvoicesParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface InvoicesPaginatedData {
  data: InvoiceItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetInvoicesResponse {
  success: boolean;
  data: InvoicesPaginatedData;
  message?: string;
}

export interface GetInvoiceResponse {
  success: boolean;
  data: InvoiceItem;
  message?: string;
}

export interface CreateInvoicePaymentPayload {
  paidAmount: number;
  paymentDate: string;
}

export interface CreateInvoicePayload {
  invoiceNumber: string;
  currency: string;
  clientId: string;
  employeeId: string;
  service: string;
  includes: string[];
  totalPrice: number;
  status: string;
  payments?: CreateInvoicePaymentPayload[];
}

export interface CreateInvoiceResponse {
  success: boolean;
  message: string;
  data: InvoiceItem;
}

export interface UpdateInvoicePayload {
  invoiceNumber?: string;
  currency?: string;
  clientId?: string;
  employeeId?: string;
  service?: string;
  includes?: string[];
  totalPrice?: number;
  status?: string;
  payments?: CreateInvoicePaymentPayload[];
}

export interface UpdateInvoiceResponse {
  success: boolean;
  message: string;
  data: InvoiceItem;
}

export interface DeleteInvoiceResponse {
  success: boolean;
  message: string;
}

export interface DeleteInvoicePaymentResponse {
  success: boolean;
  message: string;
}

export interface DeleteInvoiceIncludeResponse {
  success: boolean;
  message: string;
  data?: InvoiceItem;
}