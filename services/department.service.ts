import { api } from "@/lib/axios";
import type {
    CreateDepartmentsPayload,
    CreateDepartmentsResponse,
    GetDepartmentsResponse,
} from "@/types/department.types";

export const departmentService = {
    createDepartments: (payload: CreateDepartmentsPayload) =>
        api
            .post<CreateDepartmentsResponse>("/auth/departments", payload)
            .then((res) => res.data),

    getDepartments: () =>
        api.get<GetDepartmentsResponse>("/departments").then((res) => res.data),
};