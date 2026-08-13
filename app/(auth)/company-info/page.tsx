"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Building2, FileText, MapPin, Shield, Check, Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCompanySettings } from "@/hooks/use-company";
import { toast } from "sonner";
import Image from "next/image";
import FooterTerm from "@/components/auth/FooterTerm";
import SecondaryButton from "@/components/dashboard/shared/SecondaryButton";
import MainButton from "@/components/dashboard/shared/MainButton";

interface CompanySettings {
  businessName: string;
  logo: string | null;
  licenseNumber: string | null;
  commercialRegistration: string | null;
  companyAddress: string | null;
  termsText: string | null;
  privacyPolicyText: string | null;
}

// Skeleton Component
function CompanyInfoSkeleton() {
  return (
    <div className="w-full md:p-6 flex flex-col min-h-screen md:min-h-auto gap-4">


      <div className="bg-white rounded-3xl shadow-xl shadow-[#40369F]/5 border border-[#F0F0F2] p-6 md:p-10">
        {/* Desktop Header Skeleton */}
        <div className="hidden md:block">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-[#40369F] to-[#322A7C]"></div>
            <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-6 w-full max-w-2xl bg-gray-200 rounded-lg animate-pulse mt-2"></div>
        </div>

        <div className="mt-8 space-y-6">
          {/* Logo Upload Skeleton */}
          <div className="space-y-2">
            <div className="h-5 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl bg-gray-200 animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Business Name Skeleton */}
          <div className="space-y-1.5">
            <div className="h-5 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-[54px] rounded-xl bg-gray-200 animate-pulse"></div>
          </div>

          {/* License & Registration Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="h-5 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-[54px] rounded-xl bg-gray-200 animate-pulse"></div>
            </div>
            <div className="space-y-1.5">
              <div className="h-5 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-[54px] rounded-xl bg-gray-200 animate-pulse"></div>
            </div>
          </div>

          {/* Address Skeleton */}
          <div className="space-y-1.5">
            <div className="h-5 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-[54px] rounded-xl bg-gray-200 animate-pulse"></div>
          </div>

          {/* Terms Skeleton */}
          <div className="space-y-1.5">
            <div className="h-5 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-[120px] rounded-xl bg-gray-200 animate-pulse"></div>
          </div>

          {/* Privacy Skeleton */}
          <div className="space-y-1.5">
            <div className="h-5 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-[120px] rounded-xl bg-gray-200 animate-pulse"></div>
          </div>

          {/* Info Box Skeleton */}
          <div className="p-4 bg-[#F8F9FF] rounded-xl border border-[#EDEEFF]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-4 w-full max-w-md bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-4">
            <div className="h-[50px] w-32 rounded-xl bg-gray-200 animate-pulse"></div>
            <div className="h-[50px] w-full flex-1 rounded-xl bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="text-center text-[12px] text-[#8B8E92] mt-6 leading-relaxed px-4 space-y-1">
        <div className="h-4 w-64 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
      </div>
    </div>
  );
}

export default function CompanyInfoForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<CompanySettings>({
    businessName: "",
    logo: null,
    licenseNumber: "",
    commercialRegistration: "",
    companyAddress: "",
    termsText: "",
    privacyPolicyText: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: settingsData, isLoading: isLoadingSettings } = useCompanySettings();

  useEffect(() => {
    if (settingsData?.data) {
      setFormData({
        businessName: settingsData.data.businessName || "",
        logo: settingsData.data.logo || null,
        licenseNumber: settingsData.data.licenseNumber || "",
        commercialRegistration: settingsData.data.commercialRegistration || "",
        companyAddress: settingsData.data.companyAddress || "",
        termsText: settingsData.data.termsText || "",
        privacyPolicyText: settingsData.data.privacyPolicyText || "",
      });
      if (settingsData.data.logo) {
        setLogoPreview(settingsData.data.logo);
      }
      setIsLoading(false);
    }
  }, [settingsData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("يرجى اختيار صورة بصيغة PNG أو JPG أو WEBP");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن لا يتجاوز 2 ميجابايت");
        return;
      }

      setLogoFile(file);
      const preview = URL.createObjectURL(file);
      setLogoPreview(preview);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setFormData((prev) => ({ ...prev, logo: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.businessName.trim()) {
      toast.error("يرجى إدخال اسم الشركة");
      return;
    }

    const submitData = new FormData();
    submitData.append("businessName", formData.businessName);
    submitData.append("licenseNumber", formData.licenseNumber || "");
    submitData.append("commercialRegistration", formData.commercialRegistration || "");
    submitData.append("companyAddress", formData.companyAddress || "");
    submitData.append("termsText", formData.termsText || "");
    submitData.append("privacyPolicyText", formData.privacyPolicyText || "");

    if (logoFile) {
      submitData.append("logo", logoFile);
    }

    toast.success("تم حفظ بيانات الشركة بنجاح");
  };

  // Show skeleton while loading
  if (isLoading || isLoadingSettings) {
    return <CompanyInfoSkeleton />;
  }

  return (
    <div className="w-full md:p-6 flex flex-col min-h-screen md:min-h-auto gap-4">


      <div className="bg-white rounded-3xl shadow-xl shadow-[#40369F]/5 border border-[#F0F0F2] p-6 md:p-10 transition-all hover:shadow-2xl hover:shadow-[#40369F]/8">
        {/* Desktop Header */}
        <div className="">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-[#40369F] to-[#322A7C]"></div>
            <h1 className="text-[32px] font-bold text-[#171A1F]">معلومات الشركة</h1>
          </div>
          <p className="text-[16px] text-[#6C7075] pr-4 leading-relaxed">
            قم بإدخال معلومات شركتك لتظهر لعملائك في الفواتير الصادرة عن النظام
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#171A1F] flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-[#40369F]" />
              شعار الشركة
            </Label>
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "relative w-24 h-24 rounded-2xl border-2 border-dashed transition-all duration-200 flex items-center justify-center",
                  logoPreview
                    ? "border-[#40369F] bg-[#F8F9FF]"
                    : "border-[#E4E5E7] bg-[#FAFBFC] hover:border-[#40369F] hover:bg-[#F8F9FF] cursor-pointer"
                )}
                onClick={() => !logoPreview && fileInputRef.current?.click()}
              >
                {logoPreview ? (
                  <>
                    <Image
                      src={logoPreview}
                      alt="شعار الشركة"
                      fill
                      className="object-contain rounded-2xl p-1"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveLogo();
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-lg"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-[#9A9DA2] mx-auto mb-1" />
                    <p className="text-xs text-[#9A9DA2]">رفع شعار</p>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#6C7075]">
                  {logoPreview ? "تم اختيار الشعار" : "لم يتم اختيار ملف"}
                </p>
                <p className="text-xs text-[#9A9DA2] mt-1">
                  يفضل استخدام صورة بصيغة PNG أو JPG بحجم لا يتجاوز 2 ميجابايت
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Business Name */}
          <div className="space-y-1.5">
            <Label htmlFor="businessName" className="text-sm font-medium text-[#171A1F] flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#40369F]" />
              اسم الشركة <span className="text-red-500">*</span>
            </Label>
            <div className={cn(
              "relative rounded-xl transition-all duration-200",
              focusedField === "businessName" && "ring-2 ring-[#40369F]/20 shadow-lg shadow-[#40369F]/5"
            )}>
              <Input
                id="businessName"
                name="businessName"
                type="text"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="أدخل اسم الشركة"
                onFocus={() => setFocusedField("businessName")}
                onBlur={() => setFocusedField(null)}
                className={cn(
                  "ctm-inp pr-11 h-[54px] text-[15px] rounded-xl border-[#E4E5E7] bg-[#FAFBFC] transition-all duration-200",
                  "placeholder:text-[#9A9DA2] placeholder:text-sm",
                  "focus:bg-white focus:border-[#40369F]",
                  focusedField === "businessName" && "border-[#40369F]"
                )}
              />
              <Building2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9A9DA2] pointer-events-none transition-colors duration-200" />
            </div>
          </div>

          {/* License Number & Commercial Registration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* License Number */}
            <div className="space-y-1.5">
              <Label htmlFor="licenseNumber" className="text-sm font-medium text-[#171A1F] flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#40369F]" />
                رقم الترخيص
              </Label>
              <div className={cn(
                "relative rounded-xl transition-all duration-200",
                focusedField === "licenseNumber" && "ring-2 ring-[#40369F]/20 shadow-lg shadow-[#40369F]/5"
              )}>
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  type="text"
                  value={formData.licenseNumber || ""}
                  onChange={handleInputChange}
                  placeholder="أدخل رقم الترخيص"
                  onFocus={() => setFocusedField("licenseNumber")}
                  onBlur={() => setFocusedField(null)}
                  className={cn(
                    "ctm-inp pr-11 h-[54px] text-[15px] rounded-xl border-[#E4E5E7] bg-[#FAFBFC] transition-all duration-200",
                    "placeholder:text-[#9A9DA2] placeholder:text-sm",
                    "focus:bg-white focus:border-[#40369F]",
                    focusedField === "licenseNumber" && "border-[#40369F]"
                  )}
                />
                <FileText className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9A9DA2] pointer-events-none transition-colors duration-200" />
              </div>
            </div>

            {/* Commercial Registration */}
            <div className="space-y-1.5">
              <Label htmlFor="commercialRegistration" className="text-sm font-medium text-[#171A1F] flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#40369F]" />
                السجل التجاري
              </Label>
              <div className={cn(
                "relative rounded-xl transition-all duration-200",
                focusedField === "commercialRegistration" && "ring-2 ring-[#40369F]/20 shadow-lg shadow-[#40369F]/5"
              )}>
                <Input
                  id="commercialRegistration"
                  name="commercialRegistration"
                  type="text"
                  value={formData.commercialRegistration || ""}
                  onChange={handleInputChange}
                  placeholder="أدخل رقم السجل التجاري"
                  onFocus={() => setFocusedField("commercialRegistration")}
                  onBlur={() => setFocusedField(null)}
                  className={cn(
                    "ctm-inp pr-11 h-[54px] text-[15px] rounded-xl border-[#E4E5E7] bg-[#FAFBFC] transition-all duration-200",
                    "placeholder:text-[#9A9DA2] placeholder:text-sm",
                    "focus:bg-white focus:border-[#40369F]",
                    focusedField === "commercialRegistration" && "border-[#40369F]"
                  )}
                />
                <FileText className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9A9DA2] pointer-events-none transition-colors duration-200" />
              </div>
            </div>
          </div>

          {/* Company Address */}
          <div className="space-y-1.5">
            <Label htmlFor="companyAddress" className="text-sm font-medium text-[#171A1F] flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#40369F]" />
              عنوان الشركة
            </Label>
            <div className={cn(
              "relative rounded-xl transition-all duration-200",
              focusedField === "companyAddress" && "ring-2 ring-[#40369F]/20 shadow-lg shadow-[#40369F]/5"
            )}>
              <Input
                id="companyAddress"
                name="companyAddress"
                type="text"
                value={formData.companyAddress || ""}
                onChange={handleInputChange}
                placeholder="أدخل عنوان الشركة"
                onFocus={() => setFocusedField("companyAddress")}
                onBlur={() => setFocusedField(null)}
                className={cn(
                  "ctm-inp pr-11 h-[54px] text-[15px] rounded-xl border-[#E4E5E7] bg-[#FAFBFC] transition-all duration-200",
                  "placeholder:text-[#9A9DA2] placeholder:text-sm",
                  "focus:bg-white focus:border-[#40369F]",
                  focusedField === "companyAddress" && "border-[#40369F]"
                )}
              />
              <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9A9DA2] pointer-events-none transition-colors duration-200" />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-1.5">
            <Label htmlFor="termsText" className="text-sm font-medium text-[#171A1F] flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#40369F]" />
              الشروط والأحكام
            </Label>
            <div className={cn(
              "relative rounded-xl transition-all duration-200",
              focusedField === "termsText" && "ring-2 ring-[#40369F]/20 shadow-lg shadow-[#40369F]/5"
            )}>
              <Textarea
                id="termsText"
                name="termsText"
                value={formData.termsText || ""}
                onChange={handleInputChange}
                placeholder="أدخل الشروط والأحكام"
                rows={4}
                onFocus={() => setFocusedField("termsText")}
                onBlur={() => setFocusedField(null)}
                className={cn(
                  "ctm-inp min-h-[120px] text-[15px] rounded-xl border-[#E4E5E7] bg-[#FAFBFC] transition-all duration-200 resize-y",
                  "placeholder:text-[#9A9DA2] placeholder:text-sm",
                  "focus:bg-white focus:border-[#40369F]",
                  focusedField === "termsText" && "border-[#40369F]"
                )}
              />
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="space-y-1.5">
            <Label htmlFor="privacyPolicyText" className="text-sm font-medium text-[#171A1F] flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#40369F]" />
              سياسة الخصوصية
            </Label>
            <div className={cn(
              "relative rounded-xl transition-all duration-200",
              focusedField === "privacyPolicyText" && "ring-2 ring-[#40369F]/20 shadow-lg shadow-[#40369F]/5"
            )}>
              <Textarea
                id="privacyPolicyText"
                name="privacyPolicyText"
                value={formData.privacyPolicyText || ""}
                onChange={handleInputChange}
                placeholder="أدخل سياسة الخصوصية"
                rows={4}
                onFocus={() => setFocusedField("privacyPolicyText")}
                onBlur={() => setFocusedField(null)}
                className={cn(
                  "ctm-inp min-h-[120px] text-[15px] rounded-xl border-[#E4E5E7] bg-[#FAFBFC] transition-all duration-200 resize-y",
                  "placeholder:text-[#9A9DA2] placeholder:text-sm",
                  "focus:bg-white focus:border-[#40369F]",
                  focusedField === "privacyPolicyText" && "border-[#40369F]"
                )}
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-[#F8F9FF] rounded-xl border border-[#EDEEFF]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#40369F]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="h-4 w-4 text-[#40369F]" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-[#171A1F]">تُعرض على عملائك في الفواتير الصادرة عن النظام</p>
                <p className="text-[13px] text-[#6C7075] leading-relaxed">
                  سيتم عرض شعار الشركة واسمها وعنوانها ورقم الترخيص والسجل التجاري على جميع الفواتير الصادرة.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-3 pt-4">


            <SecondaryButton
              text="السابق"
              onClick={() => router.back()}
              className="h-[50px] !w-full"
            />

            <MainButton
              type="submit"
              text="حفظ"
              icon={<Building2 className="h-4 w-4" />}
              variant="primary"
              size="md"

              className="h-[50px] !w-full"
            />
          </div>
        </form>
      </div>

      {/* Footer Terms */}
      <FooterTerm />
    </div>
  );
}