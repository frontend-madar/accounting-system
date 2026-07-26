import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supplierService } from "@/services/supplier.service";
import { getErrorMessage } from "@/lib/axios";
import type {
  CreateSupplierPayload,
  UpdateSupplierPayload,
  GetSuppliersParams,
} from "@/types/supplier.types";

export const SUPPLIERS_QUERY_KEY = "suppliers";

export function useSuppliers(params: GetSuppliersParams = {}) {
  return useQuery({
    queryKey: [SUPPLIERS_QUERY_KEY, params],
    queryFn: () => supplierService.getSuppliers(params),
  });
}

/** Fetches a single supplier by id — used to populate the update form. Disabled until an id is provided. */
export function useSupplier(id: string | null) {
  return useQuery({
    queryKey: [SUPPLIERS_QUERY_KEY, id],
    queryFn: () => supplierService.getSupplierById(id as string),
    enabled: !!id,
  });
}

export function useCreateSupplier() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSupplierPayload) => supplierService.createSupplier(payload),
    onSuccess: (res) => {
      toast.success(res.message || "تم إضافة المورد بنجاح");
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] });
      router.push("/dashboard/suppliers");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء إضافة المورد"));
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSupplierPayload }) =>
      supplierService.updateSupplier(id, payload),
    onSuccess: (res) => {
      toast.success(res.message || "تم تحديث بيانات المورد بنجاح");
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء تحديث بيانات المورد"));
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => supplierService.deleteSupplier(id),
    onSuccess: (res) => {
      toast.success(res.message || "تم حذف المورد بنجاح");
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء حذف المورد"));
    },
  });
}

export function useExportSuppliersPdf() {
  return useMutation({
    mutationFn: (params: GetSuppliersParams = {}) => supplierService.exportSuppliersPdf(params),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `suppliers-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("تم تنزيل الملف بنجاح");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر تصدير الملف"));
    },
  });
}