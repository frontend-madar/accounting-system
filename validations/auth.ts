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

export const DEPARTMENT_OPTIONS = [
  "software",
  "Marketing",
  "Sales",
  "Design",
  "Finance",
  "HR",
  "Operations",
] as const;

export const signupSchema = z.object({
  businessName: z.string().min(2, "الاسم التجاري مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  countryCode: z.string().min(1, "كود الدولة مطلوب"),
  phone: z.string().min(6, "رقم الهاتف غير صالح"),
  password: z
    .string()
    .min(8, "٨ أحرف على الأقل")
    .regex(/[A-Z]/, "حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "رقم واحد على الأقل")
    .regex(/[^A-Za-z0-9]/, "رمز خاص واحد على الأقل"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email("بريد إلكتروني غير صالح"),
    otp: z.string().min(4, "رمز التحقق غير صالح"),
    password: z
      .string()
      .min(8, "٨ أحرف على الأقل")
      .regex(/[A-Z]/, "حرف كبير واحد على الأقل")
      .regex(/[0-9]/, "رقم واحد على الأقل")
      .regex(/[^A-Za-z0-9]/, "رمز خاص واحد على الأقل"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirm_password"],
  });


export const inviteAccountantSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
});

// validations/auth.ts — add this

export const acceptInvitationSchema = z
  .object({
    token: z.string().min(1),
    email: z.string().email(),
    name: z.string().min(1, "الاسم مطلوب"),
    phone: z.string().min(1, "رقم الهاتف مطلوب"),
    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور وتأكيدها غير متطابقين",
    path: ["confirmPassword"],
  });