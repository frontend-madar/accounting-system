import { z } from "zod";

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

export const SERVICE_OPTIONS = [
    { value: "istanbul-program", label: "برنامج اسطنبول" },
    { value: "dubai-program", label: "برنامج دبي" },
    { value: "umrah-program", label: "برنامج العمرة" },
];

export const COUNTRY_OPTIONS = [
    { value: "saudi-arabia", label: "السعودية" },
    { value: "uae", label: "الامارات" },
    { value: "kuwait", label: "الكويت" },
];

export const INCLUDES_OPTIONS = [
    { value: "tours", label: "الجولات السياحية" },
    { value: "pickup", label: "الاستقبال والتوصيل" },
    { value: "stay-transfers", label: "الإقامة والانتقالات للفنادق" },
    { value: "flights", label: "تذاكر الطيران" },
];

export const NOTE_OPTIONS = [
    { value: "remaining-balance", label: "باقي المبلغ" },
    { value: "advance-payment", label: "دفعة مقدمة" },
    { value: "other", label: "أخرى" },
];

export const CLIENT_OPTIONS = [
    { value: "10242", label: "10242 — محمد العنزي" },
    { value: "10243", label: "10243 — سارة القحطاني" },
    { value: "10244", label: "10244 — خالد الدوسري" },
];

const invoicePaymentSchema = z.object({
    paidAmount: z.string().min(1, "ادخل المبلغ"),
    paymentDate: z.string().min(1, "اختر تاريخ الدفع"),
});

export const invoiceFormSchema = z.object({
  clientId: z.string().min(1, "اختر العميل"),
  invoiceNumber: z.string().min(1),
  employeeId: z.string().min(1, "اختر الموظف"),
  phoneNumber: z.string().optional(),
  service: z.string().min(1, "اختر الخدمة"),
  includes: z.array(z.string()),
  currency: z.string().min(1, "اختر العملة"),
  totalPrice: z.number().min(0),
  status: z.string().min(1, "اختر الحالة"),
  notes: z.string().optional(),
  payments: z.array(invoicePaymentSchema).optional(),
});

export const STATUS_OPTIONS = [
  { label: "مكتملة", value: "مكتملة" },
  { label: "كنسل", value: "كنسل" },
  { label: "باقي الدفع", value: "باقي الدفع" },
];