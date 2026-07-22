"use client";

import { useRef, useState } from "react";
import { ChevronDown, Eye, EyeOff, Loader2, Building2, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { signupSchema, DEPARTMENT_OPTIONS } from "@/validations/auth";
import { z } from "zod";
import IntlTelInput, { IntlTelInputRef } from "@intl-tel-input/react";
import "intl-tel-input/styles";
import { useSignup } from "@/hooks/use-auth";
import { FacebookIcon, GoogleIcon } from "@/icons";
import SocialLoginButtons from "./SocialLoginButtons";
import FooterTerm from "./FooterTerm";

type SignupFormValues = z.infer<typeof signupSchema>;
type FieldErrors = Partial<Record<keyof SignupFormValues, string>>;

export function SignupForm() {
    const itiRef = useRef<IntlTelInputRef>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [phone, setPhone] = useState("");
    const [countryCode, setCountryCode] = useState("+20");
    const [departments, setDepartments] = useState<string[]>([]);
    const [isDeptOpen, setIsDeptOpen] = useState(false);

    const signupMutation = useSignup();

    function toggleDepartment(dept: string) {
        setDepartments((prev) =>
            prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
        );
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const raw = {
            businessName: String(formData.get("businessName") ?? ""),
            email: String(formData.get("email") ?? ""),
            countryCode,
            phone,
            departments,
            password: String(formData.get("password") ?? ""),
        };

        const result = signupSchema.safeParse(raw);
        if (!result.success) {
            const errors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof SignupFormValues;
                if (!errors[key]) errors[key] = issue.message;
            }
            setFieldErrors(errors);
            return;
        }

        setFieldErrors({});
        signupMutation.mutate(result.data);
    }

    function handleCountryChange(iso2: string) {
        const dialCode = itiRef.current?.getInstance()?.getSelectedCountry()?.dialCode;
        if (dialCode) setCountryCode(`+${dialCode}`);
    }

    return (
        <div className="w-full md:p-6 flex flex-col justify-between min-h-screen md:min-h-auto">
            {/* Brand Header - Mobile */}
            <div className="md:hidden text-center pt-8 pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#40369F] to-[#322A7C] shadow-lg shadow-[#40369F]/25 mb-3">
                    <span className="text-2xl font-bold text-white">D</span>
                </div>
                <h1 className="text-2xl font-bold text-[#171A1F]">إنشاء حساب</h1>
                <p className="text-sm text-[#6C7075] mt-1">ابدأ رحلتك معنا</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-[#40369F]/5 border border-[#F0F0F2] p-6 md:p-10 transition-all hover:shadow-2xl hover:shadow-[#40369F]/8">
                {/* Desktop Header */}
                <div className="hidden md:block">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-[#40369F] to-[#322A7C]"></div>
                        <h1 className="text-[32px] font-bold text-[#171A1F]">إنشاء حساب جديد</h1>
                    </div>
                    <p className="text-[16px] text-[#6C7075] pr-4 leading-relaxed">
                        أدخل بيانات شركتك لإنشاء حساب جديد، ثم قم بتأكيد بريدك الإلكتروني لإكمال عملية التسجيل.
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
                    {/* Business Name Field */}
                    <div className="space-y-1.5">
                        <Label htmlFor="businessName" className="text-sm font-medium text-[#171A1F] flex items-center gap-2">
                            الاسم التجاري
                        </Label>
                        <div className={cn(
                            "relative rounded-xl transition-all duration-200",
                            focusedField === "businessName" && "ring-2 ring-[#40369F]/20 shadow-lg shadow-[#40369F]/5"
                        )}>
                            <Input
                                id="businessName"
                                name="businessName"
                                type="text"
                                placeholder="مثال: شركة التقنية المتطورة"
                                autoComplete="organization"
                                aria-invalid={!!fieldErrors.businessName}
                                onFocus={() => setFocusedField("businessName")}
                                onBlur={() => setFocusedField(null)}
                                className={cn(
                                    "ctm-inp pr-11 h-[54px] text-[15px] rounded-xl border-[#E4E5E7] bg-[#FAFBFC] transition-all duration-200",
                                    "placeholder:text-[#9A9DA2] placeholder:text-sm",
                                    "focus:bg-white focus:border-[#40369F]",
                                    fieldErrors.businessName &&
                                    "border-red-500 focus-visible:ring-red-500 bg-red-50/40",
                                    !fieldErrors.businessName && focusedField === "businessName" && "border-[#40369F]"
                                )}
                            />
                            <Building2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9A9DA2] pointer-events-none transition-colors duration-200" />
                            {fieldErrors.businessName && (
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                                </div>
                            )}
                        </div>
                        {fieldErrors.businessName && (
                            <p className="text-sm text-red-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                                {fieldErrors.businessName}
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm font-medium text-[#171A1F] flex items-center gap-2">
                            البريد الإلكتروني
                        </Label>
                        <div className={cn(
                            "relative rounded-xl transition-all duration-200",
                            focusedField === "email" && "ring-2 ring-[#40369F]/20 shadow-lg shadow-[#40369F]/5"
                        )}>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="example@company.com"
                                autoComplete="email"
                                aria-invalid={!!fieldErrors.email}
                                onFocus={() => setFocusedField("email")}
                                onBlur={() => setFocusedField(null)}
                                className={cn(
                                    "ctm-inp pr-11 h-[54px] text-[15px] rounded-xl border-[#E4E5E7] bg-[#FAFBFC] transition-all duration-200",
                                    "placeholder:text-[#9A9DA2] placeholder:text-sm",
                                    "focus:bg-white focus:border-[#40369F]",
                                    fieldErrors.email &&
                                    "border-red-500 focus-visible:ring-red-500 bg-red-50/40",
                                    !fieldErrors.email && focusedField === "email" && "border-[#40369F]"
                                )}
                            />
                            <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9A9DA2] pointer-events-none transition-colors duration-200" />
                            {fieldErrors.email && (
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                                </div>
                            )}
                        </div>
                        {fieldErrors.email && (
                            <p className="text-sm text-red-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                                {fieldErrors.email}
                            </p>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-sm font-medium text-[#171A1F] flex items-center gap-2">
                            رقم الهاتف
                        </Label>
                        <div className={cn(
                            "relative rounded-xl transition-all duration-200",
                            focusedField === "phone" && "ring-2 ring-[#40369F]/20 shadow-lg shadow-[#40369F]/5"
                        )}>
                            <div
                                dir="ltr"
                                className={cn(
                                    "ctm-inp relative h-[54px] rounded-xl border-[#E4E5E7] bg-[#FAFBFC] transition-all duration-200",
                                    "focus-within:bg-white focus-within:border-[#40369F]",
                                    fieldErrors.phone && "!border-red-500 bg-red-50/40",
                                    !fieldErrors.phone && focusedField === "phone" && "border-[#40369F]"
                                )}
                            >
                                <ChevronDown className="pointer-events-none absolute left-3 top-1/2 z-20 h-4 w-4 -translate-y-1/2 text-[#9A9DA2]" />
                                <IntlTelInput
                                    ref={itiRef}
                                    initialCountry="eg"
                                    onChangeNumber={(number) => setPhone(number)}
                                    onChangeCountry={handleCountryChange}
                                    loadUtils={() => import("intl-tel-input/utils")}
                                    inputProps={{
                                        id: "phone",
                                        name: "phone",
                                        "aria-invalid": !!fieldErrors.phone,
                                        className: "w-full h-[54px] border-0 bg-transparent pr-3 text-left focus:outline-none text-[15px]",
                                    }}
                                />
                                {phone === "" && (
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[15px] text-[#9A9DA2]">
                                        رقم الهاتف
                                    </span>
                                )}
                                {fieldErrors.phone && (
                                    <div className="absolute left-12 top-1/2 -translate-y-1/2">
                                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {fieldErrors.phone && (
                            <p className="text-sm text-red-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                                {fieldErrors.phone}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-sm font-medium text-[#171A1F] flex items-center gap-2">

                            كلمة المرور
                        </Label>
                        <div className={cn(
                            "relative rounded-xl transition-all duration-200",
                            focusedField === "password" && "ring-2 ring-[#40369F]/20 shadow-lg shadow-[#40369F]/5"
                        )}>
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                aria-invalid={!!fieldErrors.password}
                                onFocus={() => setFocusedField("password")}
                                onBlur={() => setFocusedField(null)}
                                className={cn(
                                    "ctm-inp pr-11 pl-11 h-[54px] text-[15px] rounded-xl border-[#E4E5E7] bg-[#FAFBFC] transition-all duration-200",
                                    "placeholder:text-[#9A9DA2] placeholder:text-sm tracking-wider",
                                    "focus:bg-white focus:border-[#40369F]",
                                    fieldErrors.password &&
                                    "border-red-500 focus-visible:ring-red-500 bg-red-50/40",
                                    !fieldErrors.password && focusedField === "password" && "border-[#40369F]"
                                )}
                            />
                            <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9A9DA2] pointer-events-none transition-colors duration-200" />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9DA2] hover:text-[#40369F] transition-all duration-200 hover:scale-110 active:scale-95"
                                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                            {fieldErrors.password && (
                                <div className="absolute left-12 top-1/2 -translate-y-1/2">
                                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                                </div>
                            )}
                        </div>
                        {fieldErrors.password && (
                            <p className="text-sm text-red-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                                {fieldErrors.password}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={signupMutation.isPending}
                        className="w-full bg-gradient-to-r from-[#40369F] to-[#322A7C] h-[56px] text-[17px] font-semibold hover:from-[#322A7C] hover:to-[#2A226B] focus-visible:ring-4 focus-visible:ring-[#40369F]/30 flex items-center justify-center gap-3 transition-all duration-300 rounded-xl shadow-lg shadow-[#40369F]/25 hover:shadow-xl hover:shadow-[#40369F]/35 hover:scale-[1.01] active:scale-[0.98] group"
                    >
                        {signupMutation.isPending ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                جارِ إنشاء الحساب...
                            </>
                        ) : (
                            <>
                                إنشاء حساب
                                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                            </>
                        )}
                    </Button>
                </form>

                {/* Divider */}
                <div className="relative my-8 flex items-center justify-center">
                    <Separator className="bg-[#E4E5E7]" />
                    <span className="absolute bg-white px-4 text-sm text-[#9A9DA2] font-medium">
                        أو سجل عبر
                    </span>
                </div>

                {/* Social Buttons login */}
                <SocialLoginButtons />

                {/* Login Link */}
                <p className="mt-6 text-center text-[15px] text-[#1E1F1F]">
                    لديك حساب بالفعل؟{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-[#40369F] hover:text-[#322A7C] hover:underline transition-all duration-200 relative inline-block"
                    >
                        تسجيل الدخول
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#40369F] transition-all duration-300 hover:w-full"></span>
                    </Link>
                </p>
            </div>

            {/* Footer Terms */}
            <FooterTerm />
        </div>
    );
}