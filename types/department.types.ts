export interface CreateDepartmentsPayload {
    departments: string[];
}

export interface CreateDepartmentsData {
    id: string;
    businessName: string;
    email: string;
    countryCode: string;
    phone: string;
    departments: string[];
    isVerified: boolean;
    role: string;
    companyId: string;
    provider: string | null;
    socialId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDepartmentsResponse {
    success: boolean;
    data: CreateDepartmentsData;
    message: string;
}

export interface GetDepartmentsResponse {
  success: boolean;
  data: string[];
  message: string;
}