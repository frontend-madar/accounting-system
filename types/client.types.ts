// types/client.types.ts

export type ClientType = "individual" | "business";

export interface CreateClientPayload {
  clientType: ClientType;
  name: string;
  email: string;
  mobile: string;
  country: string;
  city: string;
  commercialRegister?: string;
  taxCard?: string;
  taxNumber?: string;
  currency: string;
  notes?: string;
  attachments?: File | null;
}

export type UpdateClientPayload = Partial<CreateClientPayload>;

export interface ClientData {
  id: string;
  userId: string;
  clientType: ClientType;
  name: string;
  email: string;
  mobile: string;
  country: string;
  city: string;
  commercialRegister: string | null;
  taxCard: string | null;
  taxNumber: string | null;
  currency: string;
  notes: string | null;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export type CreateClientResponse = ApiResponse<ClientData>;
export type UpdateClientResponse = ApiResponse<ClientData>;

export interface ClientListData {
  data: ClientData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type GetClientsResponse = ApiResponse<ClientListData>;

export interface GetClientsParams {
  clientType?: "individual" | "business";
  name?: string;
  mobile?: string;
  email?: string;
  country?: string;
  city?: string;
  currency?: string;
  page?: number;
  limit?: number;
}