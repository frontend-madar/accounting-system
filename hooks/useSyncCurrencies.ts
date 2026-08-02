"use client";

import { useEffect } from "react";
import { useCurrencies } from "./use-currency";
import { useCurrencyStore } from "@/store/currency.store";

/** Fetches currencies once and syncs them into the shared Zustand store. */
export function useSyncCurrencies() {
  const { data } = useCurrencies();
  const setCurrencies = useCurrencyStore((s) => s.setCurrencies);

  useEffect(() => {
    if (data?.data) {
      setCurrencies(data.data);
    }
  }, [data, setCurrencies]);
}