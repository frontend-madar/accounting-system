import { z } from "zod";

export const expenseSettlementSchema = z.object({
  expenseCode: z.string().optional(),
  period: z.string().min(1, "الفترة الزمنية مطلوبة"),
  expenseCategory: z.string().min(1, "فئة المصروف مطلوبة"),
  status: z.string().min(1, "الحالة مطلوبة"),
});

export type ExpenseSettlementValues = z.infer<typeof expenseSettlementSchema>;

 
export const STATUS_OPTIONS = [
  { value: "مدفوع", label: "مدفوع" },
  { value: "مسودة", label: "مسودة" },
];
 

export const expenseFormSchema = z.object({
  currency: z.string().min(1, "العملة مطلوبة"),
  amount: z.string().min(1, "المبلغ مطلوب"),
  expenseDate: z.string().min(1, "تاريخ المصروف مطلوب"),
  category: z.string().min(1, "فئة المصروف مطلوبة"),
  paymentMethod: z.string().min(1, "طريقة الدفع مطلوبة"),
  account: z.string().min(1, "الحساب مطلوب"),
  status: z.string().min(1, "الحالة مطلوبة"),   // <-- add this
  vendorName: z.string().optional(),
  vendorPhone: z.string().optional(),
  notes: z.string().optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;