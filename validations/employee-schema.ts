import { z } from "zod";

export const EMPLOYEE_CURRENCY = "SAR";

export const DEPARTMENT_OPTIONS = [
  { label: "المالية", value: "finance" },
  { label: "المبيعات", value: "sales" },
  { label: "الموارد البشرية", value: "hr" },
  { label: "تقنية المعلومات", value: "it" },
  { label: "التسويق", value: "marketing" },
  { label: "العمليات", value: "operations" },
];

export const BANK_OPTIONS = [
  { label: "الأهلي السعودي", value: "SNB" },
  { label: "الراجحي", value: "AL_RAJHI" },
  { label: "الرياض", value: "RIYAD_BANK" },
  { label: "ساب", value: "SAB" },
  { label: "البلاد", value: "BANK_ALBILAD" },
];

export const employeeFormSchema = z.object({
  fullName: z.string().min(1, "الاسم مطلوب"),
  mobile: z.string().min(1, "رقم الجوال مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  birthDate: z.string().min(1, "تاريخ الميلاد مطلوب"),
  nationalId: z.string().min(1, "الرقم القومي مطلوب"),
  city: z.string().min(1, "المدينة مطلوبة"),
  country: z.string().min(1, "الدولة مطلوبة"),
  department: z.string().min(1, "القسم مطلوب"),
  jobTitle: z.string().min(1, "المسمى الوظيفي مطلوب"),
  hireDate: z.string().min(1, "تاريخ التعيين مطلوب"),
  employmentType: z.enum(["full_time", "part_time"]),
  basicSalary: z.string().min(1, "الراتب الأساسي مطلوب"),
  housingAllowance: z.string().optional(),
  transportAllowance: z.string().optional(),
  iban: z.string().min(1, "رقم الحساب البنكي مطلوب"),
  bank: z.string().min(1, "البنك مطلوب"),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;