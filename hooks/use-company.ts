import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companyService } from "@/services/company.service";
import { getErrorMessage } from "@/lib/axios";
import type { CompanySettings } from "@/types/company.types";

export const COMPANY_QUERY_KEY = ["company-settings"];

export function useCompanySettings() {
  return useQuery({
    queryKey: COMPANY_QUERY_KEY,
    queryFn: () => companyService.getSettings(),
  });
}

export function useUpdateCompanySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormData) => companyService.updateSettings(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: COMPANY_QUERY_KEY });
      toast.success(data.message || "تم تحديث بيانات الشركة بنجاح");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر تحديث بيانات الشركة"));
    },
  });
}