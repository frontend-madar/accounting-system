import { z } from "zod";

export const CURRENCY_OPTIONS = [
    { label: "جنيه مصري (EGP)", value: "EGP" },
    { label: "دولار أمريكي (USD)", value: "USD" },
    { label: "يورو (EUR)", value: "EUR" },
    { label: "ريال سعودي (SAR)", value: "SAR" },
];

export const VENDOR_SERVICE_TYPE_OPTIONS = [
    { label: "انتقالات", value: "transfer" },
    { label: "استقبال كوش", value: "reception_kosha" },
    { label: "جولات", value: "tours" },
    { label: "استقبال", value: "reception" },
    { label: "فنادق", value: "hotels" },
];

const PHONE_REGEX = /^01[0125][0-9]{8}$/;
const NUMBER_REGEX = /^\d+(\.\d+)?$/;

export const vendorFormSchema = z
    .object({
        clientName: z
            .string()
            .min(1, "اسم العميل مطلوب"),
        clientNumber: z
            .string()
            .min(1, "رقم العميل مطلوب")
            .regex(/^\d+$/, "رقم العميل يجب أن يحتوي على أرقام فقط"),
        vendorName: z
            .string()
            .min(1, "اسم المورد مطلوب")
            .min(3, "اسم المورد يجب ألا يقل عن 3 أحرف"),
        serviceType: z
            .string()
            .min(1, "نوع الخدمة مطلوب"),
        vendorPhone: z
            .string()
            .min(1, "رقم الهاتف مطلوب")
            .regex(PHONE_REGEX, "رقم الهاتف غير صحيح"),
        travelDate: z
            .string()
            .min(1, "تاريخ السفر مطلوب"),
        currency: z
            .string()
            .min(1, "العملة مطلوبة"),
        servicePrice: z
            .string()
            .min(1, "سعر الخدمة مطلوب")
            .regex(NUMBER_REGEX, "سعر الخدمة يجب أن يكون رقمًا")
            .refine((val) => Number(val) > 0, "سعر الخدمة يجب أن يكون أكبر من صفر"),
        paidAmount: z
            .string()
            .min(1, "المبلغ المدفوع مطلوب")
            .regex(NUMBER_REGEX, "المبلغ المدفوع يجب أن يكون رقمًا")
            .refine((val) => Number(val) >= 0, "المبلغ المدفوع يجب ألا يكون سالبًا"),
        remainingAmount: z
            .string()
            .regex(NUMBER_REGEX, "المتبقي يجب أن يكون رقمًا")
            .optional()
            .or(z.literal("")),
        notes: z.string().optional(),
    })
    .refine((data) => Number(data.paidAmount) <= Number(data.servicePrice), {
        message: "المبلغ المدفوع لا يمكن أن يتجاوز سعر الخدمة",
        path: ["paidAmount"],
    });

export type VendorFormValues = z.infer<typeof vendorFormSchema>;