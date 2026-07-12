import { SignupForm } from "@/components/auth/SignupFrom"
import type { Metadata } from "next";
 
export const metadata: Metadata = {
  title: "تسجيل الدخول | أستاذ",
  description: "سجل الدخول للوصول إلى لوحة التحكم وإدارة أعمالك بكل سهولة.",
};

const page = () => {
    return <SignupForm />
    
}

export default page