import { z } from "zod";
import { SUPPLIER_CURRENCIES } from "@/types/supplier.types";

export const SUPPLIER_CURRENCY_OPTIONS = [
    { label: "ريال سعودي (SAR)", value: "SAR" },
    { label: "جنيه مصري (EGP)", value: "EGP" },
    { label: "درهم إماراتي (AED)", value: "AED" },
    { label: "دولار أمريكي (USD)", value: "USD" },
    { label: "يورو (EUR)", value: "EUR" },
    { label: "جنيه إسترليني (GBP)", value: "GBP" },
];

export const SUPPLIER_SERVICE_TYPE_OPTIONS = [
    { label: "انتقالات", value: "انتقالات" },
    { label: "استقبال كوش", value: "استقبال كوش" },
    { label: "جولات", value: "جولات" },
    { label: "استقبال", value: "استقبال" },
    { label: "فنادق", value: "فنادق" },
];

const PHONE_REGEX = /^\+?\d{8,15}$/;

export const supplierFormSchema = z
    .object({
        supplierName: z
            .string()
            .min(1, "اسم المورد مطلوب")
            .min(3, "اسم المورد يجب ألا يقل عن 3 أحرف"),
        supplierPhone: z
            .string()
            .min(1, "رقم هاتف المورد مطلوب")
            .regex(PHONE_REGEX, "رقم الهاتف غير صحيح"),
        clientName: z.string().min(1, "الرجاء اختيار العميل"),
        serviceTypes: z
            .array(z.string())
            .min(1, "الرجاء اختيار نوع خدمة واحد على الأقل"),
        travelDate: z.string().min(1, "تاريخ السفر مطلوب"),
        returnDate: z.string().min(1, "تاريخ العودة مطلوب"),
        currency: z.enum(SUPPLIER_CURRENCIES, {
            message: "العملة مطلوبة",
        }),
        servicePrice: z
            .string()
            .min(1, "سعر الخدمة مطلوب")
            .regex(/^\d+(\.\d+)?$/, "سعر الخدمة يجب أن يكون رقمًا")
            .refine((val) => Number(val) > 0, "سعر الخدمة يجب أن يكون أكبر من صفر"),
        amountPaid: z
            .string()
            .min(1, "المبلغ المدفوع مطلوب")
            .regex(/^\d+(\.\d+)?$/, "المبلغ المدفوع يجب أن يكون رقمًا")
            .refine((val) => Number(val) >= 0, "المبلغ المدفوع يجب ألا يكون سالبًا"),
    })
    .refine((data) => new Date(data.returnDate) >= new Date(data.travelDate), {
        message: "تاريخ العودة يجب أن يكون بعد تاريخ السفر",
        path: ["returnDate"],
    })
    .refine((data) => Number(data.amountPaid) <= Number(data.servicePrice), {
        message: "المبلغ المدفوع لا يمكن أن يتجاوز سعر الخدمة",
        path: ["amountPaid"],
    });

export type SupplierFormValues = z.infer<typeof supplierFormSchema>;