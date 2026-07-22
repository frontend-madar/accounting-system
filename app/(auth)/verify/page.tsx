"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Mail, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useResendOtp, useVerifyOtp } from "@/hooks/use-auth";
import { toast } from "sonner";

const RESEND_INTERVAL_SECONDS = 60;

export default function VerifyOtp() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_INTERVAL_SECONDS);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email) {
      toast.error("الرابط غير صالح — لم يتم العثور على البريد الإلكتروني");
      return;
    }

    if (otp.length !== 6) {
      toast.error("الرجاء إدخال رمز التحقق المكون من 6 أرقام");
      return;
    }

    verifyOtpMutation.mutate({ email, otp });
  }

  function handleResend() {
    if (!email || secondsLeft > 0) return;
    resendOtpMutation.mutate({ email }, {
      onSuccess: () => setSecondsLeft(RESEND_INTERVAL_SECONDS)
    });
  }

  return (
    <div className="w-full md:p-6 flex flex-col justify-between min-h-screen md:min-h-auto">
      {/* Brand Header - Mobile */}
      <div className="md:hidden text-center pt-8 pb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#40369F] to-[#322A7C] shadow-lg shadow-[#40369F]/25 mb-3">
          <span className="text-2xl font-bold text-white">D</span>
        </div>
        <h1 className="text-2xl font-bold text-[#171A1F]">تحقق من بريدك الإلكتروني</h1>
        <p className="text-sm text-[#6C7075] mt-1">أدخل رمز التحقق المكون من 6 أرقام</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-[#40369F]/5 border border-[#F0F0F2] p-6 md:p-10 transition-all hover:shadow-2xl hover:shadow-[#40369F]/8">
        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-[#40369F] to-[#322A7C]"></div>
            <h1 className="text-[32px] font-bold text-[#171A1F]">تحقق من بريدك الإلكتروني</h1>
          </div>
          <p className="text-[16px] text-[#6C7075] pr-4 leading-relaxed">
            أرسلنا رمز تحقق مكونًا من 6 أرقام إلى بريدك الإلكتروني. أدخل الرمز لتفعيل حسابك.
          </p>
          {email && (
            <div className="mt-3 p-3 bg-[#F5F6FF] rounded-xl border border-[#EDEEFF] pr-4 flex items-center justify-between flex-wrap gap-2">
              <p className="text-[14px] text-[#40369F] flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="font-medium">{email}</span>
              </p>
              <Link
                href="/signup"
                className="text-[13px] text-[#40369F] hover:text-[#322A7C] hover:underline transition-colors duration-200 font-medium"
              >
                تغيير البريد الإلكتروني
              </Link>
            </div>
          )}
        </div>

        {/* OTP Input Box */}
        <div className="mt-8 p-4 md:p-6 bg-[#FAFBFC] rounded-2xl border border-[#F0F0F2]">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5 text-[#40369F]" />
            <h2 className="text-[16px] font-semibold text-[#171A1F]">أدخل رمز التحقق</h2>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                  maxLength={6}
                  placeholder="_____"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  onFocus={() => setFocusedField("otp")}
                  onBlur={() => setFocusedField(null)}
                  className={cn(
                    "ctm-inp h-[64px] text-[24px] rounded-xl border-[#E4E5E7] bg-white transition-all duration-200",
                    "placeholder:text-[#9A9DA2] placeholder:text-sm text-center tracking-[0.5em] font-mono",
                    "focus:bg-white focus:border-[#40369F]",
                    focusedField === "otp" && "border-[#40369F]",
                    otp.length === 6 && "border-green-500 bg-green-50/30"
                  )}
                />
                {otp.length === 6 && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <CheckCircle className="h-5 w-5 text-green-500 animate-in fade-in zoom-in-50 duration-300" />
                  </div>
                )}
              </div>
              <p className="text-xs text-[#8B8E92] flex items-center gap-1">
                <span>أدخل الرمز المكون من 6 أرقام</span>
                <span className="w-1 h-1 rounded-full bg-[#8B8E92]"></span>
                <span className="font-mono">{otp.length}/6</span>
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={verifyOtpMutation.isPending || otp.length !== 6}
              className={cn(
                "w-full h-[56px] text-[17px] font-semibold flex items-center justify-center gap-3 transition-all duration-300 rounded-xl shadow-lg",
                otp.length === 6
                  ? "bg-gradient-to-r from-[#40369F] to-[#322A7C] hover:from-[#322A7C] hover:to-[#2A226B] shadow-[#40369F]/25 hover:shadow-xl hover:shadow-[#40369F]/35 hover:scale-[1.01] active:scale-[0.98] group"
                  : "bg-[#E4E5E7] text-[#9A9DA2] cursor-not-allowed"
              )}
            >
              {verifyOtpMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جارِ التحقق...
                </>
              ) : (
                <>
                  تفعيل الحساب
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Resend Section */}
        <div className="mt-6 text-center">
          {secondsLeft > 0 ? (
            <div className="flex items-center justify-center gap-2 text-[15px] text-[#6C7075]">
              <Clock className="h-4 w-4 text-[#40369F]" />
              <span>يمكنك إعادة إرسال الكود خلال</span>
              <span className="font-bold text-[#40369F] bg-[#F5F6FF] px-3 py-1 rounded-lg min-w-[50px]">
                {secondsLeft}ث
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendOtpMutation.isPending}
              className="text-[15px] text-[#40369F] font-medium hover:text-[#322A7C] transition-all duration-200 hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              {resendOtpMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جارِ الإرسال...
                </>
              ) : (
                "إعادة إرسال الرمز"
              )}
            </button>
          )}
        </div>

        {/* Back to Signup Link */}
        <div className="mt-4 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 text-[14px] text-[#8B8E92] hover:text-[#40369F] transition-colors duration-200 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
            العودة إلى التسجيل
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