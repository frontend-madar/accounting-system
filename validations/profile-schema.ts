import { z } from "zod";

export const profileSchema = z
  .object({
    name: z.string().min(1, "الاسم الكامل مطلوب"),
    phone: z.string().min(1, "رقم الجوال مطلوب"),
    departments: z.array(z.string()).min(1, "قسم واحد على الأقل مطلوب"),
    oldPassword: z.string().optional().or(z.literal("")),
    newPassword: z.string().optional().or(z.literal("")),
    confirmNewPassword: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const hasAnyPassword =
      Boolean(data.oldPassword) ||
      Boolean(data.newPassword) ||
      Boolean(data.confirmNewPassword);

    if (hasAnyPassword) {
      if (!data.oldPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "كلمة المرور الحالية مطلوبة",
          path: ["oldPassword"],
        });
      }

      if (!data.newPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "كلمة المرور الجديدة مطلوبة",
          path: ["newPassword"],
        });
      } else if (data.newPassword.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل",
          path: ["newPassword"],
        });
      }

      if (!data.confirmNewPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "تأكيد كلمة المرور مطلوب",
          path: ["confirmNewPassword"],
        });
      } else if (data.newPassword && data.confirmNewPassword !== data.newPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "كلمة المرور وتأكيدها غير متطابقين",
          path: ["confirmNewPassword"],
        });
      }
    }
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;
