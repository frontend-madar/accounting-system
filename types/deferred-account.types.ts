export interface DeferredAccountPayment {
  id: string;
  deferredAccountId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeferredAccountItem {
  id: string;
  clientId: string;
  clientName: string;
  employeeId: string;
  employeeName: string;
  travelDate: string;
  currency: string;
  invoiceNumber: string;
  totalAmount: number;
  remainingAmount: number;
  status: string;
  createdAt: string;
  payments: DeferredAccountPayment[];
}

export interface GetDeferredAccountsParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface DeferredAccountsPaginatedData {
  data: DeferredAccountItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetDeferredAccountsResponse {
  success: boolean;
  data: DeferredAccountsPaginatedData;
  message: string;
}

export interface CreateDeferredAccountPaymentPayload {
  amount: number;
  paymentMethod: string;
  paymentDate: string;
}

export interface CreateDeferredAccountPayload {
  clientId: string;
  employeeId: string;
  travelDate: string;
  currency: string;
  invoiceNumber: string;
  totalAmount: number;
  status: string;
  payments?: CreateDeferredAccountPaymentPayload[];
}

export interface CreateDeferredAccountResponse {
  success: boolean;
  message: string;
  data: DeferredAccountItem;
}

export interface UpdateDeferredAccountPayload {
  clientId?: string;
  employeeId?: string;
  travelDate?: string;
  currency?: string;
  invoiceNumber?: string;
  totalAmount?: number;
  status?: string;
}

export interface UpdateDeferredAccountResponse {
  success: boolean;
  message: string;
  data: DeferredAccountItem;
}

export interface DeleteDeferredAccountResponse {
  success: boolean;
  message: string;
}
export interface UpdateDeferredAccountPaymentPayload {
  id?: string; // existing payment id, omit for new payments
  amount: number;
  paymentMethod: string;
  paymentDate: string;
}

export interface UpdateDeferredAccountPayload {
  clientId?: string;
  employeeId?: string;
  travelDate?: string;
  currency?: string;
  invoiceNumber?: string;
  totalAmount?: number;
  status?: string;
  payments?: UpdateDeferredAccountPaymentPayload[];
}
