// hooks/use-employee.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { employeeService } from "@/services/employee.service";
import { getErrorMessage } from "@/lib/axios";
import type {
  CreateEmployeePayload,
  UpdateEmployeePayload,
  GetEmployeesParams,
} from "@/types/employee.types";
import { useRouter } from "next/navigation";

export const EMPLOYEES_QUERY_KEY = "employees";

export function useEmployees(params: GetEmployeesParams = {}) {
  return useQuery({
    queryKey: [EMPLOYEES_QUERY_KEY, params],
    queryFn: () => employeeService.getEmployees(params),
  });
}

export function useCreateEmployee() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => employeeService.createEmployee(payload),
    onSuccess: () => {
      toast.success("تم إضافة الموظف بنجاح");
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_QUERY_KEY] });
      router.push("/dashboard/employees");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء إضافة الموظف"));
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEmployeePayload }) =>
      employeeService.updateEmployee(id, payload),
    onSuccess: () => {
      toast.success("تم تحديث بيانات الموظف بنجاح");
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء تحديث بيانات الموظف"));
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeeService.deleteEmployee(id),
    onSuccess: () => {
      toast.success("تم حذف الموظف بنجاح");
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء حذف الموظف"));
    },
  });
}