import { api } from "@/lib/axios";
import type {
  GetDailyEntriesParams,
  GetDailyEntriesResponse,
  GetDailyEntryResponse,
  CreateDailyEntryPayload,
  CreateDailyEntryResponse,
  UpdateDailyEntryPayload,
  UpdateDailyEntryResponse,
  DeleteDailyEntryResponse,
  ExportDailyEntriesEmailParams,
} from "@/types/daily-entry.types";

export const dailyEntryService = {
  getDailyEntries: (params: GetDailyEntriesParams = {}) =>
    api
      .get<GetDailyEntriesResponse>("/daily-entries", { params })
      .then((res) => res.data),

  getDailyEntryById: (id: string) =>
    api
      .get<GetDailyEntryResponse>(`/daily-entries/${id}`)
      .then((res) => res.data),

  createDailyEntry: (payload: CreateDailyEntryPayload) =>
    api
      .post<CreateDailyEntryResponse>("/daily-entries", payload)
      .then((res) => res.data),

  updateDailyEntry: (id: string, payload: UpdateDailyEntryPayload) =>
    api
      .patch<UpdateDailyEntryResponse>(`/daily-entries/${id}`, payload)
      .then((res) => res.data),

  deleteDailyEntry: (id: string) =>
    api
      .delete<DeleteDailyEntryResponse>(`/daily-entries/${id}`)
      .then((res) => res.data),
   
  exportDailyEntriesPdf: () =>
    api
      .get("/export/daily-entries/pdf", {
         responseType: "blob"
      })
      .then((res) => res.data as Blob),

  exportDailyEntriesExcel: () =>
    api
      .get("/export/daily-entries/excel", {
        responseType: "blob",
      })
      .then((res) => res.data as Blob),

  exportDailyEntriesEmail: ({ to }: ExportDailyEntriesEmailParams) =>
    api
      .post<{ success: boolean; message: string }>(
        "/export/daily-entries/email",
        { to }
      )
      .then((res) => res.data),
};