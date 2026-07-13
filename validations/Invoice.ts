import { z } from "zod";

export const invoiceFormSchema = z.object({
    // بيانات العميل
    clientId: z.string().min(1, "اختر العميل"),
    clientName: z.string().min(1, "اسم العميل مطلوب"),
    clientPhone: z
        .string()
        .min(1, "رقم الجوال مطلوب")
        .min(9, "رقم الجوال غير صحيح"),
    invoiceNumber: z.string().min(1, "رقم الفاتورة مطلوب"),

    // بيانات الموظف
    employeeName: z.string().min(1, "اسم الموظف مطلوب"),
    employeePhone: z
        .string()
        .min(1, "رقم الهاتف مطلوب")
        .min(9, "رقم الهاتف غير صحيح"),

    // تفاصيل الخدمة
    service: z.string().min(1, "اختر الخدمة"),
    includes: z.array(z.string()).min(1, "اختر عنصرًا واحدًا على الأقل"),
    quantity: z.number().min(1, "العدد يجب أن يكون 1 على الأقل"),
    paymentDate: z.string().min(1, "تاريخ الدفع مطلوب"),

    // تفاصيل السعر
    totalPrice: z.number().min(0, "السعر الاجمالي غير صحيح"),
    paidAmount: z.number().min(0, "المبلغ المدفوع غير صحيح"),
    notes: z.string().optional(),
});


export const clientFormSchema = z.object({
    clientType: z.enum(["individual", "commercial"]),
    clientName: z.string().min(1, "اسم العميل مطلوب"),
    clientPhone: z.string().min(1, "رقم الجوال مطلوب").min(9, "رقم الجوال غير صحيح"),
    clientEmail: z.string().email("البريد الإلكتروني غير صحيح"),
    clientCountry: z.string().min(1, "الدولة مطلوبة"),
    clientCity: z.string().min(1, "المدينة مطلوبة"),

    taxId: z.string().optional(),
    idNumber: z.string().optional(),
    commercialRecord: z.string().optional(),

});


export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
export type ClientFormValues = z.infer<typeof clientFormSchema>;

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