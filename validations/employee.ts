import { z } from "zod";

export const employeeFormSchema = z.object({
    fullName: z.string().min(1, "الاسم الكامل مطلوب"),
    mobile: z
        .string()
        .min(1, "رقم الجوال مطلوب")
        .regex(/^[0-9+]{8,15}$/, "أدخل رقم جوال صحيح"),
    email: z
        .string()
        .min(1, "البريد الإلكتروني مطلوب")
        .email("أدخل بريد إلكتروني صحيح"),
    birthDate: z.string().min(1, "تاريخ الميلاد مطلوب"),
    nationalId: z
        .string()
        .min(1, "الرقم القومي مطلوب")
        .regex(/^[0-9]{14}$/, "أدخل رقم قومي صحيح مكون من 14 رقم"),
    city: z.string().min(1, "المدينة مطلوبة"),

    department: z.string().min(1, "اختر القسم"),
    jobTitle: z.string().min(1, "المسمى الوظيفي مطلوب"),
    hireDate: z.string().min(1, "تاريخ التعيين مطلوب"),
    employmentType: z.enum(["full_time", "part_time"], {
        message: "اختر نوع التوظيف",
    }),

    basicSalary: z
        .string()
        .min(1, "الراتب الأساسي مطلوب")
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "أدخل قيمة صحيحة",
        }),
    housingAllowance: z
        .string()
        .optional()
        .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
            message: "أدخل قيمة صحيحة",
        }),
    transportAllowance: z
        .string()
        .optional()
        .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
            message: "أدخل قيمة صحيحة",
        }),
    iban: z.string().min(1, "رقم الحساب البنكي مطلوب"),
    bank: z.string().min(1, "اختر البنك"),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export const EMPLOYEE_CURRENCY = "EGP";

export const DEPARTMENT_OPTIONS = [
    { label: "قسم المحاسبة", value: "accounting" },
    { label: "قسم المبيعات", value: "sales" },
    { label: "قسم الموارد البشرية", value: "hr" },
    { label: "قسم تقنية المعلومات", value: "it" },
    { label: "قسم التسويق", value: "marketing" },
];

export const BANK_OPTIONS = [
    { label: "البنك الأهلي المصري", value: "nbe" },
    { label: "بنك مصر", value: "banque_misr" },
    { label: "البنك التجاري الدولي", value: "cib" },
    { label: "بنك القاهرة", value: "banque_du_caire" },
];