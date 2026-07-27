export type ExpenseCurrency = "SAR" | "EGP" | "AED" | "USD" | "EUR" | "GBP";

export interface PaymentMethod {
  id: string;
  name: string;
  createdAt: string;
}

export interface ExpenseAccount {
  id: string;
  name: string;
  createdAt: string;
}

export interface ExpensePeriod {
  label: string;
  value: string; // e.g. "2026-07"
}

export interface ExpenseRecord {
  id: string;
  code: string;
  userId: string;
  amount: number;
  currency: ExpenseCurrency;
  expenseDate: string;
  category: string;
  paymentMethodId: string;
  accountId: string;
  payeePhone: string | null;
  documentUrl: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod?: { id: string; name: string };
  account?: { id: string; name: string };
}

export interface GetExpensesParams {
  page?: number;
  limit?: number;
  code?: string;
  status?: string;
  category?: string;
  period?: string;
  sortBy?: "expenseDate" | "amount" | "createdAt" | string;
  sortOrder?: "asc" | "desc";
}

export interface GetExpensesResponse {
  success: boolean;
  message: string;
  data: {
    data: ExpenseRecord[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetExpenseByIdResponse {
  success: boolean;
  message: string;
  data: ExpenseRecord;
}

export interface GetExpenseCategoriesResponse {
  success: boolean;
  message: string;
  data: string[];
}

export interface GetPaymentMethodsResponse {
  success: boolean;
  message: string;
  data: PaymentMethod[];
}

export interface GetExpenseAccountsResponse {
  success: boolean;
  message: string;
  data: ExpenseAccount[];
}

export interface GetExpensePeriodsResponse {
  success: boolean;
  message: string;
  data: ExpensePeriod[];
}

export interface CreateExpensePayload {
  amount: number;
  currency: ExpenseCurrency;
  expenseDate: string; // "2026-07-25"
  category: string;
  paymentMethodId: string;
  accountId: string;
  status: string;
  payeePhone?: string;
  notes?: string;
  document?: File | null;
}

export type UpdateExpensePayload = Partial<CreateExpensePayload>;

export interface CreateExpenseResponse {
  success: boolean;
  message: string;
  data: ExpenseRecord;
}

export type UpdateExpenseResponse = CreateExpenseResponse;

export interface ExpenseDashboardStats {
  monthExpenses: number;
  monthCount: number;
  totalExpenses: number;
}

export interface GetExpenseDashboardResponse {
  success: boolean;
  message: string;
  data: ExpenseDashboardStats;
}