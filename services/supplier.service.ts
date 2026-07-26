import { api } from "@/lib/axios";
import type {
  CreateSupplierPayload,
  CreateSupplierResponse,
  UpdateSupplierPayload,
  UpdateSupplierResponse,
  GetSupplierResponse,
  GetSuppliersParams,
  GetSuppliersResponse,
} from "@/types/supplier.types";

export const supplierService = {
  createSupplier: (payload: CreateSupplierPayload) =>
    api.post<CreateSupplierResponse>("/suppliers", payload).then((res) => res.data),

  getSuppliers: (params: GetSuppliersParams = {}) =>
    api.get<GetSuppliersResponse>("/suppliers", { params }).then((res) => res.data),

  getSupplierById: (id: string) =>
    api.get<GetSupplierResponse>(`/suppliers/${id}`).then((res) => res.data),

  updateSupplier: (id: string, payload: UpdateSupplierPayload) =>
    api.patch<UpdateSupplierResponse>(`/suppliers/${id}`, payload).then((res) => res.data),

  deleteSupplier: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/suppliers/${id}`).then((res) => res.data),

  exportSuppliersPdf: (params: GetSuppliersParams = {}) =>
    api
      .get("/suppliers/export/pdf", {
        params,
        responseType: "blob",
      })
      .then((res) => res.data as Blob),
};