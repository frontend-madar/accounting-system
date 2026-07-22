"use client";

import { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Eye, EyeOff, Loader2, User, Lock, Mail, Users, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { acceptInvitationSchema } from "@/validations/auth";
import { z } from "zod";
import { useAcceptInvitation } from "@/hooks/use-auth";
import IntlTelInput, { IntlTelInputRef } from "@intl-tel-input/react";
import "intl-tel-input/styles";
import Link from "next/link";
import FooterTerm from "./FooterTerm";

type AcceptInvitationFormValues = z.infer<typeof acceptInvitationSchema>;
type FieldErrors = Partial<Record<keyof AcceptInvitationFormValues, string>>;

export function AcceptInvitationForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const email = searchParams.get("email") ?? "";

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [phone, setPhone] = useState("");
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [countryCode, setCountryCode] = useState("+20");
    const itiRef = useRef<IntlTelInputRef>(null);
    const acceptInvitationMutation = useAcceptInvitation();

    function handleCountryChange(iso2: string) {
        const dialCode = itiRef.current?.getInstance()?.getSelectedCountry()?.dialCode;
        if (dialCode) setCountryCode(`+${dialCode}`);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const raw = {
            token,
            email,
            name: String(formData.get("name") ?? ""),
            phone,
            password: String(formData.get("password") ?? ""),
            confirmPassword: String(formData.get("confirmPassword") ?? ""),
        };

        const result = acceptInvitationSchema.safeParse(raw);
        if (!result.success) {
            const errors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof AcceptInvitationFormValues;
                if (!errors[key]) errors[key] = issue.message;
            }
            setFieldErrors(errors);
            return;
        }

        setFieldErrors({});
        acceptInvitationMutation.mutate(result.data);
    }

    return (
        <div className="w-full md:p-6 flex flex-col justify-between min-h-screen md:min-h-auto">
            {/* Brand Header - Mobile */}
            <div className="md:hidden text-center pt-8 pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#40369F] to-[#322A7C] shadow-lg shadow-[#40369F]/25 mb-3">
                    <span className="text-2xl font-bold text-white">D</span>
                </div>
                <h1 className="text-2xl font-bold text-[#171A1F]">مرحباً بك في الفريق</h1>
                <p className="text-sm text-[#6C7075] mt-1">أكمل بياناتك لتفعيل الحساب</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-[#40369F]/5 border border-[#F0F0F2] p-6 md:p-10 transition-all hover:shadow-2xl hover:shadow-[#40369F]/8">
                {/* Desktop Header */}
                <div className="hidden md:block">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-[#40369F] to-[#322A7C]"></div>
                        <h1 className="text-[32px] font-bold text-[#171A1F]">مرحبًا بك في فريق العمل</h1>
                    </div>
                    <p className="text-[16px] text-[#6C7075] pr-4 leading-relaxed">
                        قام مسؤول النظام بدعوتك للانضمام إلى منصة أستاذ. أنشئ كلمة المرور الخاصة بك لتفعيل حسابك.
                    </p>
                    {email && (
                        <div className="mt-3 p-3 bg-[#F5F6FF] rounded-xl border border-[#EDEEFF] pr-4">
                            <p className="text-[14px] text-[#40369F] flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span className="font-medium">{email}</span>
                                <span className="text-[#6C7075] font-normal text-sm">•</span>
                                <span className="text-[#6C7075] font-normal text-sm">البريد الإلكتروني المرتبط بالدعوة</span>
                            </p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
                    {/* Name Field */}
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-medium text-[#171A1F] flex items-center gap-2">
                            الاسم
                        </Label>
                        <div className={cn(
                            "relative rounded-xl transition-all duration-200",
                            focusedField === "name" && "ring-2 ring-[#40369F]/20 shadow-lg shadow-[#40369F]/5"
                        )}>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="أدخل اسمك الكامل"
                                autoComplete="name"
                                aria-invalid={!!fieldErrors.name}
                                onFocus={() => setFocusedField("name")}
                                onBlur={() => setFocusedField(null)}
                                className={cn(
                                    "ctm-inp pr-11 h-[54px] text-[15px] rounded-xl border-[#E4E5E7] bg-[#FAFBFC] transition-all duration-200",
                                    "placeholder:text-[#9A9DA2] placeholder:text-sm",
                                    "focus:bg-white focus:border-[#40369F]",
                                    fieldErrors.name &&
                                    "border-red-500 focus-visible:ring-red-500 bg-red-50/40",
                                    !fieldErrors.name && focusedField === "name" && "border-[#40369F]"
                                )}
                            />
                            <User className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9A9DA2] pointer-events-none transition-colors duration-200" />
                            {fieldErrors.name && (
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                                </div>
                            )}
                        </div>
                        {fieldErrors.name && (
                            <p className="text-sm text-red-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                                {fieldErrors.name}
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
                                    "ctm-inp pl-11 h-[54px] text-[15px] rounded-xl border-[#E4E5E7] bg-[#FAFBFC] transition-all duration-200",
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

                    {/* Confirm Password Field */}
                    <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#171A1F] flex items-center gap-2">
                           
                            تأكيد كلمة المرور
                        </Label>
                        <div className={cn(
                            "relative rounded-xl transition-all duration-200",
                            focusedField === "confirmPassword" && "ring-2 ring-[#40369F]/20 shadow-lg shadow-[#40369F]/5"
                        )}>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                aria-invalid={!!fieldErrors.confirmPassword}
                                onFocus={() => setFocusedField("confirmPassword")}
                                onBlur={() => setFocusedField(null)}
                                className={cn(
                                    "ctm-inp pl-11 h-[54px] text-[15px] rounded-xl border-[#E4E5E7] bg-[#FAFBFC] transition-all duration-200",
                                    "placeholder:text-[#9A9DA2] placeholder:text-sm tracking-wider",
                                    "focus:bg-white focus:border-[#40369F]",
                                    fieldErrors.confirmPassword &&
                                    "border-red-500 focus-visible:ring-red-500 bg-red-50/40",
                                    !fieldErrors.confirmPassword && focusedField === "confirmPassword" && "border-[#40369F]"
                                )}
                            />
                            <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9A9DA2] pointer-events-none transition-colors duration-200" />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9DA2] hover:text-[#40369F] transition-all duration-200 hover:scale-110 active:scale-95"
                                aria-label={showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                            {fieldErrors.confirmPassword && (
                                <div className="absolute left-12 top-1/2 -translate-y-1/2">
                                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                                </div>
                            )}
                        </div>
                        {fieldErrors.confirmPassword && (
                            <p className="text-sm text-red-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                                {fieldErrors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={acceptInvitationMutation.isPending}
                        className="w-full bg-gradient-to-r from-[#40369F] to-[#322A7C] h-[56px] text-[17px] font-semibold hover:from-[#322A7C] hover:to-[#2A226B] focus-visible:ring-4 focus-visible:ring-[#40369F]/30 flex items-center justify-center gap-3 transition-all duration-300 rounded-xl shadow-lg shadow-[#40369F]/25 hover:shadow-xl hover:shadow-[#40369F]/35 hover:scale-[1.01] active:scale-[0.98] group"
                    >
                        {acceptInvitationMutation.isPending ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                جارِ تفعيل الحساب...
                            </>
                        ) : (
                            <>
                                تفعيل الحساب
                                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                            </>
                        )}
                    </Button>
                </form>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-[#F8F9FF] rounded-xl border border-[#EDEEFF]">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#40369F]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Users className="h-4 w-4 text-[#40369F]" />
                        </div>
                        <div>
                            <p className="text-[14px] font-medium text-[#171A1F]">تمت دعوتك بواسطة مسؤول النظام</p>
                            <p className="text-[13px] text-[#6C7075] leading-relaxed">
                                أنشئ كلمة المرور الخاصة بك لتفعيل حسابك والبدء في استخدام المنصة.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Terms */}
             <FooterTerm />
        </div>
    );
}