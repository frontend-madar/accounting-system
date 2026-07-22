// services/employee.service.ts

import { api } from "@/lib/axios";
import type {
  CreateEmployeePayload,
  CreateEmployeeResponse,
  UpdateEmployeePayload,
  UpdateEmployeeResponse,
  GetEmployeesParams,
  GetEmployeesResponse,
} from "@/types/employee.types";

function buildEmployeeFormData(payload: CreateEmployeePayload): FormData {
  const formData = new FormData();
  formData.append("fullName", payload.fullName);
  formData.append("email", payload.email);
  formData.append("mobile", payload.mobile);
  formData.append("nationalId", payload.nationalId);
  formData.append("birthDate", payload.birthDate);
  formData.append("city", payload.city);
  formData.append("country", payload.country);
  formData.append("department", payload.department);
  formData.append("jobTitle", payload.jobTitle);
  formData.append("hireDate", payload.hireDate);
  formData.append("employmentType", payload.employmentType);
  formData.append("basicSalary", payload.basicSalary);
  formData.append("bankName", payload.bankName);
  formData.append("iban", payload.iban);
  if (payload.housingAllowance) formData.append("housingAllowance", payload.housingAllowance);
  if (payload.transportationAllowance) formData.append("transportationAllowance", payload.transportationAllowance);
  if (payload.attachments) formData.append("attachments", payload.attachments);
  return formData;
}

/** Only appends fields that were actually provided — used for PATCH, where most fields are optional. */
function buildPartialEmployeeFormData(payload: UpdateEmployeePayload): FormData {
  const formData = new FormData();
  (Object.keys(payload) as (keyof UpdateEmployeePayload)[]).forEach((key) => {
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

export const employeeService = {
  createEmployee: (payload: CreateEmployeePayload) =>
    api
      .post<CreateEmployeeResponse>("/employees", buildEmployeeFormData(payload), {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),

  getEmployees: (params: GetEmployeesParams = {}) =>
    api.get<GetEmployeesResponse>("/employees", { params }).then((res) => res.data),

  updateEmployee: (id: string, payload: UpdateEmployeePayload) =>
    api
      .patch<UpdateEmployeeResponse>(`/employees/${id}`, buildPartialEmployeeFormData(payload), {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),

  deleteEmployee: (id: string) =>
    api.delete<{ success: boolean }>(`/employees/${id}`).then((res) => res.data),
};