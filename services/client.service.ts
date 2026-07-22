// services/client.service.ts

import { api } from "@/lib/axios";
import type {
  CreateClientPayload,
  CreateClientResponse,
  UpdateClientPayload,
  UpdateClientResponse,
  GetClientsParams,
  GetClientsResponse,
} from "@/types/client.types";

function buildClientFormData(payload: CreateClientPayload): FormData {
  const formData = new FormData();

  formData.append("clientType", payload.clientType);
  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("mobile", payload.mobile);
  formData.append("country", payload.country);
  formData.append("city", payload.city);
  formData.append("currency", payload.currency);

  if (payload.commercialRegister) formData.append("commercialRegister", payload.commercialRegister);
  if (payload.taxCard) formData.append("taxCard", payload.taxCard);
  if (payload.taxNumber) formData.append("taxNumber", payload.taxNumber);
  if (payload.notes) formData.append("notes", payload.notes);
  if (payload.attachments) formData.append("attachments", payload.attachments);

  return formData;
}

/** Only appends fields that were actually provided — used for PATCH, where most fields are optional. */
function buildPartialClientFormData(payload: UpdateClientPayload): FormData {
  const formData = new FormData();
  (Object.keys(payload) as (keyof UpdateClientPayload)[]).forEach((key) => {
    const value = payload[key];
    if (value === undefined || value === null || value === "") return;
    if (key === "attachments") {
      if (value instanceof File) formData.append("attachments", value);
      return;
    }
    formData.append(key, String(value));
  });
  return formData;
}

export const clientService = {
  createClient: (payload: CreateClientPayload) =>
    api
      .post<CreateClientResponse>("/clients", buildClientFormData(payload), {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),

  getClients: (params: GetClientsParams = {}) =>
    api.get<GetClientsResponse>("/clients", { params }).then((res) => res.data),

  updateClient: (id: string, payload: UpdateClientPayload) =>
    api
      .patch<UpdateClientResponse>(`/clients/${id}`, buildPartialClientFormData(payload), {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),

  deleteClient: (id: string) =>
    api.delete<{ success: boolean }>(`/clients/${id}`).then((res) => res.data),
};