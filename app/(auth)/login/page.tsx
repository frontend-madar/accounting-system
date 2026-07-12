import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";
 
export const metadata: Metadata = {
  title: "تسجيل الدخول | أستاذ",
  description: "سجل الدخول للوصول إلى لوحة التحكم وإدارة أعمالك بكل سهولة.",
};

export default function LoginPage() {
  return <LoginForm />;
}