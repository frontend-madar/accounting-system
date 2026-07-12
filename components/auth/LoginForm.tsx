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

export function LoginForm() {
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
                <h1 className="text-[20px] md:text-[34px] font-bold text-[#171A1F] text-center md:text-right">تسجيل الدخول</h1>
                <p className="mt-2 text-[15px] md:text-[18px] text-[##171A1F] text-center md:text-right">
                    سجل الدخول للوصول إلى لوحة التحكم وإدارة أعمالك بكل سهولة.
                </p>

                <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="sr-only">
                            البريد الالكتروني
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="البريد الالكتروني"
                            autoComplete="email"
                            aria-invalid={!!fieldErrors.email}
                            className={cn("ctm-inp", fieldErrors.email && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {fieldErrors.email && (
                            <p className="text-sm text-red-600">{fieldErrors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="sr-only">
                            كلمة المرور
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="كلمة المرور"
                                autoComplete="current-password"
                                aria-invalid={!!fieldErrors.password}
                                className={cn(
                                    "pl-10 ctm-inp",
                                    fieldErrors.password && "border-red-500 focus-visible:ring-red-500"
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                            >
                                {showPassword ? (
                                    <EyeOff className="md:h-6 md:w-6 h-4 w-4" />
                                ) : (
                                    <Eye className="md:h-6 md:w-6 h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {fieldErrors.password && (
                            <p className="text-sm text-red-600">{fieldErrors.password}</p>
                        )}
                    </div>


                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            "w-full bg-[#40369F] h-[50px] text-[18px] md:text-[20px] hover:bg-indigo-800 focus-visible:ring-indigo-700 flex items-center justify-center gap-2"
                        )}
                    >
                        {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
                        {isSubmitting ? "جارِ تسجيل الدخول..." : "تسجيل الدخول"}
                    </Button>
                </form>

                <div className="relative my-10 flex items-center justify-center">
                    <Separator />
                    <span className="absolute bg-white px-3 text-[18px] text-[#76797C]">
                        أو سجل عبر
                    </span>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                    <Button variant="outline" type="button" className="w-full h-[50px] text-[#1E1F1F] text-[15px] md:text-[18px]">
                        <FacebookIcon className="h-4 w-4" />
                        سجل من خلال فيسبوك
                    </Button>
                    <Button variant="outline" type="button" className="w-full h-[50px] text-[#1E1F1F] text-[15px] md:text-[18px]">
                        <GoogleIcon className="h-7 w-7" />
                        سجل من خلال جوجل
                    </Button>
                </div>

                <p className="mt-6 text-center md:text-[20px] text-[#1E1F1F]">
                    ليس لديك حساب؟{" "}
                    <Link href="/signup" className="font-medium text-[#322A7C] hover:underline">
                        إنشاء حساب
                    </Link>
                </p>
            </div>

            <div className="text-center text-[14px] text-[#585B5F] ">
                بإنشاء حسابك، أنت توافق على  <span className="font-semibold text-[#0F1219]"> شروط الاستخدام وسياسة </span>   <br /> <span className="font-semibold text-[#0F1219]"> الخصوصية </span> الخاصة بالنظام.
            </div>
        </div>
    );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width="33" height="33" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27 13.5825C27 6.08114 20.9558 0 13.5 0C6.0442 0 0 6.08114 0 13.5825C0 20.3619 4.93678 25.9811 11.3906 27V17.5087H7.96289V13.5825H11.3906V10.5901C11.3906 7.18599 13.4061 5.30567 16.4898 5.30567C17.9668 5.30567 19.5117 5.57095 19.5117 5.57095V8.91352H17.8095C16.1324 8.91352 15.6094 9.96054 15.6094 11.0347V13.5825H19.3535L18.755 17.5087H15.6094V27C22.0632 25.9811 27 20.362 27 13.5825Z" fill="#1877F2" />
        </svg>
    );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_147_13074)">
                <path d="M9.40593 0.888051C6.70821 1.82391 4.3817 3.60021 2.76813 5.95604C1.15456 8.31186 0.338972 11.123 0.441174 13.9766C0.543375 16.8303 1.55797 19.5759 3.33594 21.8102C5.11391 24.0446 7.56153 25.6499 10.3193 26.3904C12.5551 26.9673 14.8975 26.9926 17.1452 26.4642C19.1814 26.0068 21.064 25.0285 22.6085 23.625C24.216 22.1196 25.3828 20.2046 25.9835 18.0858C26.6364 15.7816 26.7526 13.3585 26.3231 11.0025H13.7681V16.2106H21.0391C20.8938 17.0412 20.5824 17.834 20.1236 18.5415C19.6647 19.249 19.0678 19.8566 18.3687 20.3281C17.4808 20.9154 16.4799 21.3105 15.4303 21.4882C14.3776 21.6839 13.2978 21.6839 12.2451 21.4882C11.1782 21.2676 10.1689 20.8272 9.28147 20.1952C7.85585 19.186 6.7854 17.7523 6.22288 16.0988C5.65085 14.4142 5.65085 12.5879 6.22288 10.9034C6.6233 9.72257 7.28523 8.64746 8.15929 7.75828C9.15953 6.72205 10.4259 5.98134 11.8194 5.61743C13.2129 5.25352 14.6797 5.28047 16.0589 5.69532C17.1363 6.02605 18.1215 6.6039 18.9361 7.38282C19.7559 6.56719 20.5744 5.74946 21.3914 4.92961C21.8133 4.48875 22.2731 4.06899 22.6887 3.61758C21.4453 2.46054 19.9859 1.56022 18.394 0.968207C15.4951 -0.0843928 12.3231 -0.11268 9.40593 0.888051Z" fill="white" />
                <path d="M9.40555 0.888038C12.3225 -0.113373 15.4944 -0.08583 18.3936 0.966085C19.9858 1.56212 21.4446 2.46677 22.6862 3.62812C22.2643 4.07952 21.8192 4.5014 21.3889 4.94015C20.5705 5.75718 19.7527 6.5714 18.9357 7.3828C18.1212 6.60389 17.1359 6.02604 16.0585 5.6953C14.6798 5.279 13.213 5.25049 11.8191 5.61292C10.4253 5.97534 9.15814 6.71468 8.1568 7.74984C7.28274 8.63901 6.6208 9.71412 6.22039 10.8949L1.84766 7.50937C3.41283 4.40555 6.12283 2.03137 9.40555 0.888038Z" fill="#E33629" />
                <path d="M0.687338 10.8633C0.922367 9.6985 1.31256 8.57047 1.84749 7.5094L6.22023 10.9034C5.6482 12.5879 5.6482 14.4142 6.22023 16.0988C4.76335 17.2238 3.30578 18.3544 1.84749 19.4907C0.508359 16.8251 0.0999457 13.788 0.687338 10.8633Z" fill="#F8BD00" />
                <path d="M13.7675 11.0004H26.3225C26.752 13.3564 26.6358 15.7795 25.9829 18.0836C25.3823 20.2025 24.2154 22.1175 22.6079 23.6229C21.1968 22.5218 19.7793 21.4291 18.3681 20.328C19.0677 19.8561 19.6649 19.2478 20.1237 18.5396C20.5826 17.8313 20.8938 17.0377 21.0386 16.2063H13.7675C13.7654 14.4724 13.7675 12.7364 13.7675 11.0004Z" fill="#587DBD" />
                <path d="M1.8457 19.4906C3.30398 18.3656 4.76156 17.235 6.21844 16.0988C6.78208 17.7529 7.85406 19.1867 9.28125 20.1952C10.1714 20.8243 11.1829 21.2611 12.2513 21.4777C13.3039 21.6734 14.3837 21.6734 15.4364 21.4777C16.486 21.3 17.4869 20.9048 18.3748 20.3175C19.7859 21.4186 21.2034 22.5113 22.6146 23.6123C21.0703 25.0166 19.1878 25.9957 17.1513 26.4537C14.9036 26.9821 12.5612 26.9568 10.3254 26.3798C8.55711 25.9077 6.90541 25.0754 5.47383 23.9351C3.95858 22.7321 2.721 21.216 1.8457 19.4906Z" fill="#319F43" />
            </g>
            <defs>
                <clipPath id="clip0_147_13074">
                    <rect width="27" height="27" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}