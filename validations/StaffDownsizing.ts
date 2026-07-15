import { z } from "zod";

export const staffDownsizingSchema = z.object({
  searchName: z.string().optional(),
  department: z.string().optional(),
  branch: z.string().optional(),
});

export type StaffDownsizingValues = z.infer<typeof staffDownsizingSchema>;

export const STAFF_DOWNSIZING_DEPARTMENT_OPTIONS = [
  { label: "جميع الاقسام", value: "all" },
  { label: "قسم المبيعات", value: "sales" },
  { label: "قسم الموارد البشرية", value: "hr" },
  { label: "قسم المحاسبة", value: "accounting" },
  { label: "قسم تقنية المعلومات", value: "it" },
];

export const STAFF_DOWNSIZING_BRANCH_OPTIONS = [
  { label: "جميع الفروع", value: "all" },
  { label: "الفرع الرئيسي", value: "main_branch" },
  { label: "فرع القاهرة", value: "cairo_branch" },
  { label: "فرع الإسكندرية", value: "alex_branch" },
];