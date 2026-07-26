export const SUPPLIER_CURRENCIES = ["SAR", "EGP", "AED", "USD", "EUR", "GBP"] as const;
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

export type UpdateSupplierPayload = Partial<CreateSupplierPayload>;

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