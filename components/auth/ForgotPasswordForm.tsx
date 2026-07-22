"use client";

import { useState } from "react";
import { Loader2, Mail, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { forgotPasswordSchema } from "@/validations/auth";
import { z } from "zod";
import { useForgotPassword } from "@/hooks/use-auth";
import Link from "next/link";

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type FieldErrors = Partial<Record<keyof ForgotPasswordFormValues, string>>;

export function ForgotPasswordForm() {
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const forgotPasswordMutation = useForgotPassword();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const raw = {
            email: String(formData.get("email") ?? ""),
        };

        const result = forgotPasswordSchema.safeParse(raw);
        if (!result.success) {
            const errors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof ForgotPasswordFormValues;
                if (!errors[key]) errors[key] = issue.message;
            }
            setFieldErrors(errors);
            return;
        }

        setFieldErrors({});
        forgotPasswordMutation.mutate(result.data);
    }

    return (
        <div className="w-full md:p-6 flex flex-col justify-between min-h-screen md:min-h-auto">
            {/* Brand Header - Mobile */}
            <div className="md:hidden text-center pt-8 pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#40369F] to-[#322A7C] shadow-lg shadow-[#40369F]/25 mb-3">
                    <span className="text-2xl font-bold text-white">D</span>
                </div>
                <h1 className="text-2xl font-bold text-[#171A1F]">نسيت كلمة المرور؟</h1>
                <p className="text-sm text-[#6C7075] mt-1">استعد الوصول إلى حسابك</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-[#40369F]/5 border border-[#F0F0F2] p-6 md:p-10 transition-all hover:shadow-2xl hover:shadow-[#40369F]/8">
                {/* Desktop Header */}
                <div className="hidden md:block">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-[#40369F] to-[#322A7C]"></div>
                        <h1 className="text-[32px] font-bold text-[#171A1F]">نسيت كلمة المرور؟</h1>
                    </div>
                    <p className="text-[16px] text-[#6C7075] pr-4 leading-relaxed">
                        أدخل بريدك الإلكتروني وسنرسل لك رمزًا لإعادة تعيين كلمة المرور.
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
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

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={forgotPasswordMutation.isPending}
                        className="w-full bg-gradient-to-r from-[#40369F] to-[#322A7C] h-[56px] text-[17px] font-semibold hover:from-[#322A7C] hover:to-[#2A226B] focus-visible:ring-4 focus-visible:ring-[#40369F]/30 flex items-center justify-center gap-3 transition-all duration-300 rounded-xl shadow-lg shadow-[#40369F]/25 hover:shadow-xl hover:shadow-[#40369F]/35 hover:scale-[1.01] active:scale-[0.98] group"
                    >
                        {forgotPasswordMutation.isPending ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                جارِ الإرسال...
                            </>
                        ) : (
                            <>
                                إرسال رمز إعادة التعيين
                                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                            </>
                        )}
                    </Button>
                </form>

                {/* Back to Login Link */}
                <div className="mt-6 text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-[15px] text-[#40369F] hover:text-[#322A7C] font-medium transition-all duration-200 group"
                    >
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                        العودة إلى تسجيل الدخول
                    </Link>
                </div>
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