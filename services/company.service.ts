import { api } from "@/lib/axios";
import type { CompanySettingsResponse, UpdateCompanySettingsResponse } from "@/types/company.types";

export const companyService = {
  getSettings: () =>
    api.get<CompanySettingsResponse>("/company/settings").then((res) => res.data),

  updateSettings: (payload: FormData) =>
    api.patch<UpdateCompanySettingsResponse>("/company/settings", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => res.data),
};