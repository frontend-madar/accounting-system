import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { invoiceService } from "@/services/invoice.service";
import { getErrorMessage } from "@/lib/axios";
import type {
  GetInvoicesParams,
  CreateInvoicePayload,
  UpdateInvoicePayload,
  ExportInvoicesEmailParams,
} from "@/types/invoice.types";

export const INVOICES_QUERY_KEY = "invoices";

export function useInvoices(params: GetInvoicesParams = {}) {
  return useQuery({
    queryKey: [INVOICES_QUERY_KEY, params],
    queryFn: () => invoiceService.getInvoices(params),
  });
}

export function useInvoice(id?: string) {
  return useQuery({
    queryKey: [INVOICES_QUERY_KEY, id],
    queryFn: () => invoiceService.getInvoiceById(id as string),
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CreateInvoicePayload) =>
      invoiceService.createInvoice(payload),
    onSuccess: (res) => {
      toast.success(res.message || "تم إنشاء الفاتورة بنجاح");
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
      router.push("/dashboard/invoices");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء إنشاء الفاتورة"));
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateInvoicePayload;
    }) => invoiceService.updateInvoice(id, payload),
    onSuccess: (res) => {
      toast.success(res.message || "تم تحديث الفاتورة بنجاح");
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء تحديث الفاتورة"));
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => invoiceService.deleteInvoice(id),
    onSuccess: (res) => {
      toast.success(res.message || "تم حذف الفاتورة بنجاح");
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء حذف الفاتورة"));
    },
  });
}

export function useDeleteInvoicePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      invoiceId,
      paymentId,
    }: {
      invoiceId: string;
      paymentId: string;
    }) => invoiceService.deleteInvoicePayment(invoiceId, paymentId),
    onSuccess: (res) => {
      toast.success(res.message || "تم حذف الدفعة بنجاح");
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء حذف الدفعة"));
    },
  });
}

export function useDeleteInvoiceInclude() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      invoiceId,
      index,
    }: {
      invoiceId: string;
      index: number;
    }) => invoiceService.deleteInvoiceInclude(invoiceId, index),
    onSuccess: (res) => {
      toast.success(res.message || "تم حذف العنصر بنجاح");
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء حذف العنصر"));
    },
  });
}

export function useDownloadInvoicePdf() {
  return useMutation({
    mutationFn: async ({
      invoiceId,
      invoiceNumber,
    }: {
      invoiceId: string;
      invoiceNumber?: string;
    }) => {
      const blob = await invoiceService.downloadInvoicePdf(invoiceId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${invoiceNumber || invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء تحميل الفاتورة"));
    },
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function useExportInvoicesPdf() {
  return useMutation({
    mutationFn: (params: GetInvoicesParams = {}) => invoiceService.exportInvoicesPdf(params),
    onSuccess: (blob) => {
      downloadBlob(blob, `invoices-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("تم تنزيل الملف بنجاح");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر تصدير الملف"));
    },
  });
}

export function useExportInvoicesExcel() {
  return useMutation({
    mutationFn: (params: GetInvoicesParams = {}) => invoiceService.exportInvoicesExcel(params),
    onSuccess: (blob) => {
      downloadBlob(blob, `invoices-${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast.success("تم تنزيل الملف بنجاح");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر تصدير الملف"));
    },
  });
}

export function useExportInvoicesEmail() {
  return useMutation({
    mutationFn: (params: ExportInvoicesEmailParams) => invoiceService.exportInvoicesEmail(params),
    onSuccess: (res) => {
      toast.success(res.message || "تم إرسال الملف بالبريد الإلكتروني بنجاح");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر إرسال الملف بالبريد الإلكتروني"));
    },
  });
}