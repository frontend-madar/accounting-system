import * as z from "zod";

export const creditAccountFormSchema = z.object({
  clientName: z.string().min(1, "اسم العميل مطلوب"),
  employeeName: z.string().min(1, "اسم الموظف المسؤول مطلوب"),
  invoiceNumber: z.string().min(1, "رقم الفاتورة مطلوب"),
  paymentDate: z.string().min(1, "تاريخ الدفع مطلوب"),
  currency: z.string().min(1, "العملة مطلوبة"),
  totalAmount: z.string().min(1, "المبلغ الكلي مطلوب"),
  paidAmount: z.string().min(1, "المبلغ المدفوع مطلوب"),
  remainingAmount: z.string().optional(),
  paymentMethod: z.string().min(1, "طريقة الدفع مطلوبة"),
  status: z.string().min(1, "الحالة مطلوبة"),
});

export type CreditAccountFormValues = z.infer<typeof creditAccountFormSchema>;

export const CUSTOMER_OPTIONS = [
    { label: "أحمد محمد", value: "ahmed_mohamed" },
    { label: "محمود علي", value: "mahmoud_ali" },
];

export const EMPLOYEE_OPTIONS = [
    { label: "موظف 1", value: "employee_1" },
    { label: "موظف 2", value: "employee_2" },
];

export const CURRENCY_OPTIONS = [
    { label: "EGP جنيه مصري", value: "EGP" },
    { label: "USD دولار أمريكي", value: "USD" },
    { label: "SAR ريال سعودي", value: "SAR" },
];

export const PAYMENT_DATE_OPTIONS = [
    { label: "اليوم", value: "today" },
    { label: "غداً", value: "tomorrow" },
    { label: "بعد أسبوع", value: "next_week" },
];

export const TOTAL_AMOUNT_OPTIONS = [
    { label: "EGP 15,000", value: "15000" },
    { label: "EGP 20,000", value: "20000" },
];

export const PAYMENT_METHOD_OPTIONS = [
    { label: "كاش", value: "cash" },
    { label: "تحويل بنكي", value: "bank_transfer" },
    { label: "فيزا", value: "visa" },
];

export const STATUS_OPTIONS = [
    { label: "مكتملة", value: "completed" },
    { label: "كنسل", value: "cancelled" },
];
