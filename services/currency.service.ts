import { api } from "@/lib/axios";
import type { GetCurrenciesResponse } from "@/types/currency.types";

export const currencyService = {
  getCurrencies: () =>
    api.get<GetCurrenciesResponse>("/currencies").then((res) => res.data),
};