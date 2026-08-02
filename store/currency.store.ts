import { create } from "zustand";

export interface CurrencyOption {
  label: string;
  value: string;
}

interface CurrencyStore {
  currencies: string[];
  currencyOptions: CurrencyOption[];
  setCurrencies: (currencies: string[]) => void;
}

export const useCurrencyStore = create<CurrencyStore>((set) => ({
  currencies: [],
  currencyOptions: [],
  setCurrencies: (currencies) =>
    set({
      currencies,
      currencyOptions: currencies.map((c) => ({ label: c, value: c })),
    }),
}));