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
};