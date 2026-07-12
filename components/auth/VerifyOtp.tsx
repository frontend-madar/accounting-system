"use client";

import * as React from "react";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { loginSchema } from "@/validations/auth";
import { z } from "zod";
import { toast } from "sonner";


type LoginFormValues = z.infer<typeof loginSchema>;
type FieldErrors = Partial<Record<keyof LoginFormValues, string>>;


async function simulateLogin(values: LoginFormValues): Promise<{ ok: boolean; message?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (values.email === "test@example.com" && values.password === "123456") {
        return { ok: true };
    }
    return { ok: false, message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
}

export function VerifyOtp() {
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [success, setSuccess] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSuccess(false);

        const formData = new FormData(event.currentTarget);
        const raw = {
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? ""),
        };

        const result = loginSchema.safeParse(raw);

        if (!result.success) {
            const errors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof LoginFormValues;
                if (!errors[key]) errors[key] = issue.message;
            }
            setFieldErrors(errors);
            return;
        }

        setFieldErrors({});
        setIsSubmitting(true);

        try {
            const response = await simulateLogin(result.data);
            if (response.ok) {
                toast.success("تم تسجيل الدخول بنجاح!");
            } else {
                toast.error(response.message ?? "حدث خطأ أثناء تسجيل الدخول");
            }
        } catch {
            toast.error("تعذر الاتصال بالخادم، حاول مرة أخرى");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full md:p-5 flex flex-col justify-between">
            <div className="bg-white rounded-xl p-5 mt-10">
                <h1 className="text-[20px] md:text-[34px] font-bold text-[#171A1F] text-center md:text-right">  تحقق من بريدك الإلكتروني  </h1>
                <p className="mt-2 text-[15px] md:text-[18px] text-[#171A1F] text-center md:text-right">
                     أرسلنا رمز تحقق مكونًا من 6 أرقام إلى بريدك الإلكتروني. أدخل الرمز لتفعيل حسابك.
                </p>
                <p className="mt-2 text-[15px] font-semibold mt-5 md:text-[20px] text-[#171A1F] text-center md:text-right">
                     email@company.com <Link href='/signup' className="text-[#40369F] hover:underline" > تغيير البريد الإلكتروني </Link>
                </p>

                <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="otp" className="sr-only">
                           إدخال الرمز
                        </Label>
                        <Input
                            id="otp"
                            name="otp"
                            type="text"
                            placeholder="إدخال الرمز"
                            className={cn("ctm-inp", )}
                        />
                         
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            "w-full bg-[#40369F] h-[50px] text-[18px] md:text-[20px] hover:bg-indigo-800 focus-visible:ring-indigo-700 flex items-center justify-center gap-2"
                        )}
                    >
                        {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
                        {isSubmitting ? "جارِ تسجيل  ..." : "تسجيل  "}
                    </Button>
                </form>
                 

                 <p className=" mt-5 text-[15px] md:text-[20px] text-[#585959] text-center ">
                    يمكنك إعادة إرسال الكود خلال <span className="text-[#000619]" > 20ث </span>
                </p>
            </div>

            <div className="text-center text-[14px] text-[#585B5F] ">
                بإنشاء حسابك، أنت توافق على  <span className="font-semibold text-[#0F1219]"> شروط الاستخدام وسياسة </span>   <br /> <span className="font-semibold text-[#0F1219]"> الخصوصية </span> الخاصة بالنظام.
            </div>
        </div>
    );
}

 