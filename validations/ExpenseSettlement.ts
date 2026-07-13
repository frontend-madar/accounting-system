import { z } from "zod";

export const expenseSettlementSchema = z.object({
    expenseCode: z.string().optional(),
    period: z.string().min(1, "الفترة الزمنية مطلوبة"),
    expenseCategory: z.string().min(1, "فئة المصروف مطلوبة"),
    status: z.string().min(1, "الحالة مطلوبة"),
});

export type ExpenseSettlementValues = z.infer<typeof expenseSettlementSchema>;

export const PERIOD_OPTIONS = [
    { value: "last-7-days", label: "آخر 7 أيام" },
    { value: "last-30-days", label: "آخر 30 يوم" },
    { value: "last-3-months", label: "آخر 3 أشهر" },
    { value: "last-6-months", label: "آخر 6 أشهر" },
    { value: "last-year", label: "آخر سنة" },
];

export const EXPENSE_CATEGORY_OPTIONS = [
    { value: "all", label: "جميع الفئات" },
    { value: "travel", label: "السفر والتنقل" },
    { value: "accommodation", label: "الإقامة والفنادق" },
    { value: "meals", label: "الوجبات والترفيه" },
    { value: "office-supplies", label: "المستلزمات المكتبية" },
    { value: "utilities", label: "المرافق والخدمات" },
    { value: "maintenance", label: "الصيانة والإصلاح" },
    { value: "other", label: "أخرى" },
];

export const STATUS_OPTIONS = [
    { value: "all", label: "جميع الحالات" },
    { value: "pending", label: "قيد الانتظار" },
    { value: "approved", label: "معتمد" },
    { value: "rejected", label: "مرفوض" },
    { value: "settled", label: "تم التسوية" },
];



export const expenseFormSchema = z.object({
  currency: z.string().min(1, "اختر العملة"),
  amount: z
    .string()
    .min(1, "المبلغ مطلوب")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "أدخل مبلغ صحيح",
    }),
  expenseDate: z.string().min(1, "تاريخ المصروف مطلوب"),
  category: z.string().min(1, "اختر فئة المصروف"),
  paymentMethod: z.string().min(1, "اختر طريقة الدفع"),
  account: z.string().min(1, "اختر الحساب"),
  vendorName: z.string().min(1, "اسم المورد مطلوب"),
  vendorPhone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^[0-9+]{8,15}$/, "أدخل رقم هاتف صحيح"),
  notes: z.string().optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

export const CURRENCY_OPTIONS = [
  { label: "EGP", value: "EGP" },
  { label: "SAR", value: "SAR" },
  { label: "USD", value: "USD" },
];


export const PAYMENT_METHOD_OPTIONS = [
  { label: "محفظة إلكترونية", value: "e_wallet" },
  { label: "تحويل بنكي", value: "bank_transfer" },
  { label: "كاش", value: "cash" },
];

export const ACCOUNT_OPTIONS = [
  { label: "الحساب البنكي", value: "bank_account" },
  { label: "الخزنة الرئيسية", value: "main_safe" },
];