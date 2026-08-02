import { create } from "zustand";

export interface Option {
  label: string;
  value: string;
}

interface ExpenseOptionsState {
  categoryOptions: Option[];
  paymentMethodOptions: Option[];
  accountOptions: Option[];
  setCategoryOptions: (categories: string[]) => void;
  setPaymentMethodOptions: (methods: { id: string; name: string }[]) => void;
  setAccountOptions: (accounts: { id: string; name: string }[]) => void;
}

export const useExpenseOptionsStore = create<ExpenseOptionsState>((set) => ({
  categoryOptions: [],
  paymentMethodOptions: [],
  accountOptions: [],

  setCategoryOptions: (categories) =>
    set({ categoryOptions: categories.map((c) => ({ label: c, value: c })) }),

  setPaymentMethodOptions: (methods) =>
    set({
      paymentMethodOptions: methods.map((p) => ({ label: p.name, value: p.id })),
    }),

  setAccountOptions: (accounts) =>
    set({ accountOptions: accounts.map((a) => ({ label: a.name, value: a.id })) }),
}));