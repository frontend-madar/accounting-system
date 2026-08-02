import { z } from "zod";

export const CURRENCY_OPTIONS = [
  { value: "SAR", label: "ريال سعودي" },
  { value: "EGP", label: "جنيه مصري" },
  { value: "AED", label: "درهم إماراتي" },
  { value: "USD", label: "دولار أمريكي" },
  { value: "EUR", label: "يورو" },
  { value: "GBP", label: "جنيه إسترليني" },
];

export const STATUS_OPTIONS = [
  { value: "مكتملة", label: "مكتملة" },
  { value: "كنسل", label: "كنسل" },
  { value: "باقي الدفع", label: "باقي الدفع" },
];

const paymentSchema = z.object({
  amount: z.string().min(1, "ادخل المبلغ"),
  paymentDate: z.string().min(1, "اختر تاريخ الدفع"),
  paymentMethod: z.string().min(1, "اختر طريقة الدفع"),
});

export const creditAccountFormSchema = z.object({
  clientId: z.string().min(1, "اختر العميل"),
  employeeId: z.string().min(1, "اختر الموظف"),
  travelDate: z.string().min(1, "اختر تاريخ السفر"),
  invoiceNumber: z.string().min(1, "ادخل رقم الفاتورة"),
  currency: z.string().min(1, "اختر العملة"),
  totalAmount: z.string().min(1, "ادخل السعر الاجمالي"),
  status: z.string().min(1, "اختر الحالة"),
  payments: z.array(paymentSchema).optional(),
});

export type CreditAccountFormValues = z.infer<typeof creditAccountFormSchema>;