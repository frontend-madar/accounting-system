export interface CompanySettings {
  businessName: string;
  logo: string | null;
  licenseNumber: string | null;
  commercialRegistration: string | null;
  companyAddress: string | null;
  termsText: string | null;
  privacyPolicyText: string | null;
}

export interface CompanySettingsResponse {
  success: boolean;
  data: CompanySettings;
  message: string;
}

export interface UpdateCompanySettingsResponse {
  success: boolean;
  data: CompanySettings;
  message: string;
}