// types/employee.types.ts

export type EmploymentType = "full_time" | "part_time";

export interface CreateEmployeePayload {
  fullName: string;
  email: string;
  mobile: string;
  nationalId: string;
  birthDate: string;
  city: string;
  country: string;
  department: string;
  jobTitle: string;
  hireDate: string;
  employmentType: EmploymentType;
  basicSalary: string;
  housingAllowance?: string;
  transportationAllowance?: string;
  bankName: string;
  iban: string;
  attachments?: File | null;
}

export type UpdateEmployeePayload = Partial<CreateEmployeePayload>;

export interface EmployeeData {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  mobile: string;
  nationalId: string;
  birthDate: string;
  city: string;
  country: string;
  department: string;
  jobTitle: string;
  hireDate: string;
  employmentType: EmploymentType;
  basicSalary: string;
  housingAllowance?: string;
  transportationAllowance?: string;
  bankName: string;
  iban: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export type CreateEmployeeResponse = ApiResponse<EmployeeData>;
export type UpdateEmployeeResponse = ApiResponse<EmployeeData>;

export interface EmployeeListData {
  data: EmployeeData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type GetEmployeesResponse = ApiResponse<EmployeeListData>;

export interface GetEmployeesParams {
  search?: string;
  department?: string;
  page?: number;
  limit?: number;
  sortBy?: "asc" | "desc";
}