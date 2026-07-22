"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useResendOtp, useVerifyOtp } from "@/hooks/use-auth";

const RESEND_INTERVAL_SECONDS = 60;

export function VerifyOtp() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_INTERVAL_SECONDS);

  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  console.log(resendOtpMutation)

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || otp.length !== 6) return;
    verifyOtpMutation.mutate({ email, otp });
  }

  function handleResend() {
    if (!email || secondsLeft > 0) return;
    resendOtpMutation.mutate({ email }, { onSuccess: () => setSecondsLeft(RESEND_INTERVAL_SECONDS) });
  }

  return (
    <div className="w-full md:p-5 flex flex-col justify-between">
      <div className="bg-white rounded-xl p-5 mt-10">
        <h1 className="text-[20px] md:text-[34px] font-bold text-[#171A1F] text-center md:text-right">تحقق من بريدك الإلكتروني</h1>
        <p className="mt-2 text-[15px] md:text-[18px] text-[#171A1F] text-center md:text-right">
          أرسلنا رمز تحقق مكونًا من 6 أرقام إلى بريدك الإلكتروني. أدخل الرمز لتفعيل حسابك.
        </p>
        <p className="mt-2 text-[15px] font-semibold mt-5 md:text-[20px] text-[#171A1F] text-center md:text-right">
          {email}{" "}
          <Link href="/signup" className="text-[#40369F] hover:underline">تغيير البريد الإلكتروني</Link>
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp" className="sr-only">إدخال الرمز</Label>
            <Input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="إدخال الرمز"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="ctm-inp"
            />
          </div>

          <Button
            type="submit"
            disabled={verifyOtpMutation.isPending || otp.length !== 6}
            className="w-full bg-[#40369F] h-[50px] text-[18px] md:text-[20px] hover:bg-indigo-800 focus-visible:ring-indigo-700 flex items-center justify-center gap-2"
          >
            {verifyOtpMutation.isPending && <Loader2 className="h-5 w-5 animate-spin" />}
            {verifyOtpMutation.isPending ? "جارِ التحقق..." : "تفعيل الحساب"}
          </Button>
        </form>

        <p className="mt-5 text-[15px] md:text-[20px] text-[#585959] text-center">
          {secondsLeft > 0 ? (
            <>يمكنك إعادة إرسال الكود خلال <span className="text-[#000619]">{secondsLeft}ث</span></>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendOtpMutation.isPending}
              className="text-[#40369F] font-medium hover:underline disabled:opacity-50"
            >
              {resendOtpMutation.isPending ? "جارِ الإرسال..." : "إعادة إرسال الرمز"}
            </button>
          )}
        </p>
      </div>

      <div className="text-center text-[14px] text-[#585B5F]">
        بإنشاء حسابك، أنت توافق على <span className="font-semibold text-[#0F1219]">شروط الاستخدام وسياسة</span> <br />
        <span className="font-semibold text-[#0F1219]">الخصوصية</span> الخاصة بالنظام.
      </div>
    </div>
  );
}