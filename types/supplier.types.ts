export const SUPPLIER_CURRENCIES = ["SAR", "EGP", "AED", "USD", "EUR", "GBP"] as const;
export const SUPPLIER_STATUS_OPTIONS = ["مكتمل", "غير مكتمل"] as const;
export type SupplierStatus = (typeof SUPPLIER_STATUS_OPTIONS)[number];

export type SupplierCurrency = (typeof SUPPLIER_CURRENCIES)[number];

export interface CreateSupplierPayload {
  supplierName: string;
  supplierPhone: string;
  clientName: string;
  serviceTypes: string[];
  travelDate: string;
  returnDate: string;
  currency: SupplierCurrency;
  servicePrice: number;
  amountPaid: number;
}


export interface SupplierData {
  id: string;
  userId: string;
  supplierPhone: string;
  clientId: string;
  supplierName: string;
  clientName: string;
  serviceTypes: string[];
  travelDate: string;
  returnDate: string;
  currency: SupplierCurrency;
  servicePrice: number;
  amountPaid: number;
  remainingAmount: number;
  status: SupplierStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierResponse {
  success: boolean;
  data: SupplierData;
  message: string;
}

export interface UpdateSupplierResponse {
  success: boolean;
  data: SupplierData;
  message: string;
}

export interface GetSupplierResponse {
  success: boolean;
  data: SupplierData;
  message: string;
}

export interface GetSuppliersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetSuppliersResponse {
  success: boolean;
  data: {
    data: SupplierData[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

export interface ExportSuppliersEmailParams {
  to: string;
}

export type UpdateSupplierPayload = Partial<CreateSupplierPayload> & {
  status?: SupplierStatus;
};