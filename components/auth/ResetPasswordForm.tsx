"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Key, Shield, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { resetPasswordSchema } from "@/validations/auth";
import { z } from "zod";
import { useResetPassword } from "@/hooks/use-auth";

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
type FieldErrors = Partial<Record<keyof ResetPasswordFormValues, string>>;

function ResetPasswordFormInner() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const resetPasswordMutation = useResetPassword();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const raw = {
      email,
      otp: String(formData.get("otp") ?? ""),
      password: String(formData.get("password") ?? ""),
      confirm_password: String(formData.get("confirm_password") ?? ""),
    };

    const result = resetPasswordSchema.safeParse(raw);
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ResetPasswordFormValues;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    resetPasswordMutation.mutate(result.data);
  }

  return (
    <div className="w-full md:p-6 flex flex-col justify-between min-h-screen md:min-h-auto">
      {/* Brand Header - Mobile */}
      <div className="md:hidden text-center pt-8 pb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#40369F] to-[#322A7C] shadow-lg shadow-[#40369F]/25 mb-3">
          <span className="text-2xl font-bold text-white">D</span>
        </div>
        <h1 className="text-2xl font-bold text-[#171A1F]">إعادة تعيين كلمة المرور</h1>
        <p className="text-sm text-[#6C7075] mt-1">أدخل الرمز وكلمة المرور الجديدة</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-[#40369F]/5 border border-[#F0F0F2] p-6 md:p-10 transition-all hover:shadow-2xl hover:shadow-[#40369F]/8">
        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-[#40369F] to-[#322A7C]"></div>
            <h1 className="text-[32px] font-bold text-[#171A1F]">إعادة تعيين كلمة المرور</h1>
          </div>
          <p className="text-[16px] text-[#6C7075] pr-4 leading-relaxed">
            أدخل الرمز المرسل إلى بريدك الإلكتروني مع كلمة المرور الجديدة.
          </p>
          {email && (
            <p className="mt-2 text-[15px] font-medium text-[#40369F] pr-4 flex items-center gap-2">
              {email}
              <span className="text-[#6C7075] font-normal text-sm">•</span>
              <Link 
                href="/forgot-password" 
                className="text-[#40369F] hover:text-[#322A7C] hover:underline transition-colors duration-200 text-sm font-medium"
              >
                تغيير البريد الإلكتروني
              </Link>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
          {/* OTP Field */}
          <div className="space-y-1.5">
            <Label htmlFor="otp" className="text-sm font-medium text-[#171A1F] flex items-center gap-2">
              رمز التحقق
            </Label>
            <div className={cn(
              "relative rounded-xl transition-all duration-200",
              focusedField === "otp" && "ring-2 ring-[#40369F]/20 shadow-lg shadow-[#40369F]/5"
            )}>
              <Input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                placeholder="أدخل رمز التحقق المكون من 6 أرقام"
                aria-invalid={!!fieldErrors.otp}
                onFocus={() => setFocusedField("otp")}
                onBlur={() => setFocusedField(null)}
                className={cn(
                  "ctm-inp h-[54px] text-[15px] rounded-xl border-[#E4E5E7] bg-[#FAFBFC] transition-all duration-200",
                  "placeholder:text-[#9A9DA2] placeholder:text-sm text-center tracking-[0.3em] font-mono",
                  "focus:bg-white focus:border-[#40369F]",
                  fieldErrors.otp &&
                    "border-red-500 focus-visible:ring-red-500 bg-red-50/40",
                  !fieldErrors.otp && focusedField === "otp" && "border-[#40369F]"
                )}
              />
              {fieldErrors.otp && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                </div>
              )}
            </div>
            {fieldErrors.otp && (
              <p className="text-sm text-red-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                {fieldErrors.otp}
              </p>
            )}
          </div>

          {/* New Password Field */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium text-[#171A1F] flex items-center gap-2">
              كلمة المرور الجديدة
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
            <Label htmlFor="confirm_password" className="text-sm font-medium text-[#171A1F] flex items-center gap-2">
              تأكيد كلمة المرور
            </Label>
            <div className={cn(
              "relative rounded-xl transition-all duration-200",
              focusedField === "confirm_password" && "ring-2 ring-[#40369F]/20 shadow-lg shadow-[#40369F]/5"
            )}>
              <Input
                id="confirm_password"
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={!!fieldErrors.confirm_password}
                onFocus={() => setFocusedField("confirm_password")}
                onBlur={() => setFocusedField(null)}
                className={cn(
                  "ctm-inp pl-11 h-[54px] text-[15px] rounded-xl border-[#E4E5E7] bg-[#FAFBFC] transition-all duration-200",
                  "placeholder:text-[#9A9DA2] placeholder:text-sm tracking-wider",
                  "focus:bg-white focus:border-[#40369F]",
                  fieldErrors.confirm_password &&
                    "border-red-500 focus-visible:ring-red-500 bg-red-50/40",
                  !fieldErrors.confirm_password && focusedField === "confirm_password" && "border-[#40369F]"
                )}
              />
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
              {fieldErrors.confirm_password && (
                <div className="absolute left-12 top-1/2 -translate-y-1/2">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                </div>
              )}
            </div>
            {fieldErrors.confirm_password && (
              <p className="text-sm text-red-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                {fieldErrors.confirm_password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="w-full bg-gradient-to-r from-[#40369F] to-[#322A7C] h-[56px] text-[17px] font-semibold hover:from-[#322A7C] hover:to-[#2A226B] focus-visible:ring-4 focus-visible:ring-[#40369F]/30 flex items-center justify-center gap-3 transition-all duration-300 rounded-xl shadow-lg shadow-[#40369F]/25 hover:shadow-xl hover:shadow-[#40369F]/35 hover:scale-[1.01] active:scale-[0.98] group"
          >
            {resetPasswordMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                جارِ إعادة التعيين...
              </>
            ) : (
              <>
                إعادة تعيين كلمة المرور
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
              </>
            )}
          </Button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-[15px] text-[#1E1F1F]">
          تذكرت كلمة المرور؟{" "}
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
      <div className="text-center text-[12px] text-[#8B8E92] mt-6 leading-relaxed px-4">
        بإنشاء حسابك، أنت توافق على{" "}
        <span className="font-semibold text-[#5C5F63] hover:text-[#40369F] transition-colors duration-200 cursor-pointer">
          شروط الاستخدام
        </span>
        {" و "}
        <span className="font-semibold text-[#5C5F63] hover:text-[#40369F] transition-colors duration-200 cursor-pointer">
          سياسة الخصوصية
        </span>
        {" "} الخاصة بالنظام.
      </div>
    </div>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#40369F]" />
    </div>}>
      <ResetPasswordFormInner />
    </Suspense>
  );
}