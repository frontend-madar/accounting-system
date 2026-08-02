import { z } from "zod";

const bookingLineSchema = z.object({
  bookingPlace: z.string().min(1, "ادخل مكان الحجز"),
  serviceType: z.string().min(1, "ادخل نوع الحجز"),
  bookingPrice: z.string().min(1, "ادخل سعر الحجز"),
});

export const dailyEntryFormSchema = z.object({
  clientId: z.string().min(1, "اختر العميل"),
  employeeId: z.string().min(1, "اختر الموظف"),
  checkIn: z.string().min(1, "اختر تاريخ الوصول"),
  checkOut: z.string().min(1, "اختر تاريخ المغادرة"),
  destination: z.string().min(1, "ادخل الوجهة"),
  currency: z.string().min(1, "اختر العملة"),
  totalCost: z.string().min(1, "ادخل اجمالي التكلفة"),
  paidAmount: z.string().optional(),
  paymentDate: z.string().optional(),
  paymentMethod: z.string().optional(),
  bookingLines: z.array(bookingLineSchema).min(1, "أضف حجز واحد على الأقل"),
});

export type DailyEntryFormValues = z.infer<typeof dailyEntryFormSchema>;