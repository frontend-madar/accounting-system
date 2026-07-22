"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { departmentService } from "@/services/department.service";
import { getErrorMessage } from "@/lib/axios";
import { useDepartmentStore } from "@/store/department.store";
import type { CreateDepartmentsPayload } from "@/types/department.types";

export function useCreateDepartments() {
    const router = useRouter();
    const refetchDepartments = useDepartmentStore((s) => s.refetchDepartments);

    return useMutation({
        mutationFn: (payload: CreateDepartmentsPayload) =>
            departmentService.createDepartments(payload),
        onSuccess: (response) => {
            toast.success(response.message || "تم إضافة الأقسام بنجاح");
            // Keep the shared store in sync after a create.
            refetchDepartments();
            router.push("/dashboard");
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, "تعذر إضافة الأقسام"));
        },
    });
}

export function useGetDepartments() {
    const departments = useDepartmentStore((s) => s.departments);
    const isLoading = useDepartmentStore((s) => s.isLoading);
    const isError = useDepartmentStore((s) => s.isError);
    const hasFetched = useDepartmentStore((s) => s.hasFetched);
    const fetchDepartments = useDepartmentStore((s) => s.fetchDepartments);

    useEffect(() => {
        if (!hasFetched) {
            fetchDepartments();
        }
    }, [hasFetched, fetchDepartments]);

    return { data: departments, isLoading, isError };
}