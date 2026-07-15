import { LucideIcon } from "lucide-react";

export interface BookingDetail {
  id: string;
  location: string;
  type: string;
  price: number;
}

export interface DailyEntry {
  id: string;
  customerCode: string;
  employee: string;
  customer: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  bookings: BookingDetail[];
  totalCost: number;
  editableCode: number;
  paidAmount: number;
  paymentDate: string;
  paymentMethod: string;
  remaining: number;
  closedDate: string;
}

export type ExpenseIconKey = "total" | "count" | "month";

export interface ExpenseStat {
  id: string;
  label: string;
  value: string | number;
  currency?: string;
  icon: ExpenseIconKey;
  iconColor: string;
  iconBg: string;
}

export interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  department: string;
  jobTitle: string;
  hireDate: string;
  salary: number;
  attachmentsCount: number;
}

export type ExpenseRecordStatus = "paid" | "draft";

export interface ExpenseRecord {
  id: string;
  expenseNumber: string;
  date: string;
  category: string;
  categoryColor: string;
  vendor: string;
  paymentMethod: string;
  amount: number;
  status: ExpenseRecordStatus;
  attachmentsCount: number;
}

export type NotificationType =
  | "salary_paid"
  | "salary_pending"
  | "expense_created";

export interface NotificationItemData {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  unread?: boolean;
}

export interface NotificationGroupData {
  id: string;
  label: string;
  items: NotificationItemData[];
}


export type ServiceType =
  | "انتقالات"
  | "استقبال كوش"
  | "جولات"
  | "استقبال"
  | "فنادق";

export interface Vendor {
  id: string;
  vendorName: string;
  clientName: string;
  clientNumber: string;
  travelDate: string;
  returnDate: string;
  serviceType: ServiceType;
  servicePrice: number;
  paidAmount: number;
  remainingAmount: number;
}