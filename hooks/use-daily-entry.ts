import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { dailyEntryService } from "@/services/daily-entry.service";
import { getErrorMessage } from "@/lib/axios";
import type {
  GetDailyEntriesParams,
  CreateDailyEntryPayload,
  UpdateDailyEntryPayload,
  ExportDailyEntriesEmailParams,
} from "@/types/daily-entry.types";

export const DAILY_ENTRIES_QUERY_KEY = "daily-entries";

export function useDailyEntries(params: GetDailyEntriesParams = {}) {
  return useQuery({
    queryKey: [DAILY_ENTRIES_QUERY_KEY, params],
    queryFn: () => dailyEntryService.getDailyEntries(params),
  });
}

export function useDailyEntry(id?: string) {
  return useQuery({
    queryKey: [DAILY_ENTRIES_QUERY_KEY, id],
    queryFn: () => dailyEntryService.getDailyEntryById(id as string),
    enabled: !!id,
  });
}

export function useCreateDailyEntry() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CreateDailyEntryPayload) =>
      dailyEntryService.createDailyEntry(payload),
    onSuccess: (res) => {
      toast.success(res.message || "تم إضافة القيد اليومي بنجاح");
      queryClient.invalidateQueries({ queryKey: [DAILY_ENTRIES_QUERY_KEY] });
      router.push("/dashboard/daily-entries");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء إضافة القيد اليومي"));
    },
  });
}

export function useUpdateDailyEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDailyEntryPayload;
    }) => dailyEntryService.updateDailyEntry(id, payload),
    onSuccess: (res) => {
      toast.success(res.message || "تم تحديث القيد اليومي بنجاح");
      queryClient.invalidateQueries({ queryKey: [DAILY_ENTRIES_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء تحديث القيد اليومي"));
    },
  });
}

export function useDeleteDailyEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dailyEntryService.deleteDailyEntry(id),
    onSuccess: (res) => {
      toast.success(res.message || "تم حذف القيد اليومي بنجاح");
      queryClient.invalidateQueries({ queryKey: [DAILY_ENTRIES_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء حذف القيد اليومي"));
    },
  });
}

// ── Export Functions ─────────────────────────────────────────────────────────

/** Download helper */
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

/** Export daily entries as PDF */
export function useExportDailyEntriesPdf() {
  return useMutation({
    mutationFn: (params: GetDailyEntriesParams = {}) =>
      dailyEntryService.exportDailyEntriesPdf( ),
    onSuccess: (blob) => {
      downloadBlob(
        blob,
        `daily-entries-${new Date().toISOString().slice(0, 10)}.pdf`
      );
      toast.success("تم تنزيل الملف بنجاح");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر تصدير الملف"));
    },
  });
}

/** Export daily entries as Excel */
export function useExportDailyEntriesExcel() {
  return useMutation({
    mutationFn: (params: GetDailyEntriesParams = {}) =>
      dailyEntryService.exportDailyEntriesExcel( ),
    onSuccess: (blob) => {
      downloadBlob(
        blob,
        `daily-entries-${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      toast.success("تم تنزيل الملف بنجاح");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر تصدير الملف"));
    },
  });
}

/** Export daily entries via email */
export function useExportDailyEntriesEmail() {
  return useMutation({
    mutationFn: (params: ExportDailyEntriesEmailParams) =>
      dailyEntryService.exportDailyEntriesEmail(params),
    onSuccess: (res) => {
      toast.success(res.message || "تم إرسال الملف بالبريد الإلكتروني بنجاح");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر إرسال الملف بالبريد الإلكتروني"));
    },
  });
}