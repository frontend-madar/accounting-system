import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "البريد الإلكتروني مطلوب")
        .email("صيغة البريد الإلكتروني غير صحيحة"),
    password: z
        .string()
        .min(1, "كلمة المرور مطلوبة")
        .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export const signupSchema = z.object({
    businessName: z.string().min(1, "الاسم التجاري مطلوب").min(2, "الاسم التجاري قصير جدًا"),
    email: z.string().min(1, "البريد الإلكتروني مطلوب").email("صيغة البريد الإلكتروني غير صحيحة"),
    phone: z
        .string()
        .min(1, "رقم الهاتف مطلوب")
        .min(8, "رقم الهاتف غير صحيح"),
    password: z.string().min(1, "كلمة المرور مطلوبة").min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});