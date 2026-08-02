import { useQuery } from "@tanstack/react-query";
import { currencyService } from "@/services/currency.service";

export const CURRENCIES_QUERY_KEY = "currencies";

export function useCurrencies() {
  return useQuery({
    queryKey: [CURRENCIES_QUERY_KEY],
    queryFn: () => currencyService.getCurrencies(),
    staleTime: Infinity, // currency list rarely changes within a session
  });
}