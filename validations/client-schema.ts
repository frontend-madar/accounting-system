import { z } from "zod";


export const clientFormSchema = z.object({
    clientType: z.enum(["individual", "business"]),
    clientName: z.string().min(1, "اسم العميل مطلوب"),
    clientPhone: z.string().min(1, "رقم الجوال مطلوب").min(9, "رقم الجوال غير صحيح"),
    clientEmail: z.string().email("البريد الإلكتروني غير صحيح"),
    clientCountry: z.string().min(1, "الدولة مطلوبة"),
    clientCity: z.string().min(1, "المدينة مطلوبة"),
    currency: z.string().min(1, "العملة مطلوبة"),

    taxId: z.string().optional(),
    idNumber: z.string().optional(),
    commercialRecord: z.string().optional(),
    notes: z.string().optional(),

});


export const clientFilterSchema = z.object({
    clientType: z.enum(["individual", "business", ""]).optional(),
    name: z.string().optional(),
    mobile: z.string().optional(),
    email: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    currency: z.string().optional(),
});

export type ClientFilterValues = z.infer<typeof clientFilterSchema>;

export const CLIENT_CURRENCY_OPTIONS = [
    { label: "ريال سعودي (SAR)", value: "SAR" },
    { label: "دولار أمريكي (USD)", value: "USD" },
    { label: "جنيه مصري (EGP)", value: "EGP" },
    { label: "درهم إماراتي (AED)", value: "AED" },
];


export type ClientFormValues = z.infer<typeof clientFormSchema>;