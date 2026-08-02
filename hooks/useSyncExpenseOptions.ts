import { useEffect } from "react";
import {
  useExpenseAccounts,
  useExpenseCategories,
  useExpensePaymentMethods,
} from "@/hooks/useExpenses";
import { useExpenseOptionsStore } from "@/store/expense.store";
 
export function useSyncExpenseOptions() {
  const { data: categoriesRes, isLoading: loadingCategories } = useExpenseCategories();
  const { data: paymentMethodsRes, isLoading: loadingPaymentMethods } = useExpensePaymentMethods();
  const { data: accountsRes, isLoading: loadingAccounts } = useExpenseAccounts();

  const setCategoryOptions = useExpenseOptionsStore((s) => s.setCategoryOptions);
  const setPaymentMethodOptions = useExpenseOptionsStore((s) => s.setPaymentMethodOptions);
  const setAccountOptions = useExpenseOptionsStore((s) => s.setAccountOptions);

  useEffect(() => {
    if (categoriesRes?.data) setCategoryOptions(categoriesRes.data);
  }, [categoriesRes, setCategoryOptions]);

  useEffect(() => {
    if (paymentMethodsRes?.data) setPaymentMethodOptions(paymentMethodsRes.data);
  }, [paymentMethodsRes, setPaymentMethodOptions]);

  useEffect(() => {
    if (accountsRes?.data) setAccountOptions(accountsRes.data);
  }, [accountsRes, setAccountOptions]);

  return {
    isLoading: loadingCategories || loadingPaymentMethods || loadingAccounts,
  };
}