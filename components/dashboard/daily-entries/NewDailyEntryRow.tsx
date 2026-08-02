"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";

import { TableCell, TableRow } from "@/components/ui/table";
import { SelectField } from "../invoice/SelectField";
import { InvoiceTextField } from "../invoice/TextField";
import { DateField } from "../Datefield";
import { useCreateDailyEntry } from "@/hooks/use-daily-entry";
import { useClients } from "@/hooks/use-client";
import { useEmployees } from "@/hooks/use-employee";
import { useCurrencyStore } from "@/store/currency.store";
import { useSyncCurrencies } from "@/hooks/useSyncCurrencies";
import type { CreateDailyEntryPayload } from "@/types/daily-entry.types";

interface NewDailyEntryRowProps {
  onCancel: () => void;
  onCreated: () => void;
}

export function NewDailyEntryRow({ onCancel, onCreated }: NewDailyEntryRowProps) {
  useSyncCurrencies();
  const currencyOptions = useCurrencyStore((s) => s.currencyOptions);

  const { data: clientsRes } = useClients({ limit: 100 });
  const { data: employeesRes } = useEmployees({ limit: 100 });
  const { mutate: createDailyEntry, isPending } = useCreateDailyEntry();

  const clientList = useMemo(() => clientsRes?.data?.data || [], [clientsRes]);
  const employeeList = useMemo(() => employeesRes?.data?.data || [], [employeesRes]);

  const clientOptions = useMemo(
    () => clientList.map((c) => ({ label: c.name, value: c.id })),
    [clientList]
  );

  const employeeOptions = useMemo(
    () => employeeList.map((e) => ({ label: e.fullName, value: e.id })),
    [employeeList]
  );

  const [form, setForm] = useState({
    clientId: "",
    employeeId: "",
    checkIn: "",
    checkOut: "",
    destination: "",
    currency: "",
    bookingPlace: "",
    serviceType: "",
    bookingPrice: "",
    totalCost: "",
    paidAmount: "",
    paymentDate: "",
    paymentMethod: "",
  });

  useEffect(() => {
    if (currencyOptions.length > 0 && !form.currency) {
      setForm((f) => ({ ...f, currency: currencyOptions[0].value }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyOptions]);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSave() {
    const selectedClient = clientList.find((c) => c.id === form.clientId);
    const selectedEmployee = employeeList.find((e) => e.id === form.employeeId);

    if (
      !selectedClient ||
      !selectedEmployee ||
      !form.checkIn ||
      !form.checkOut ||
      !form.destination ||
      !form.currency ||
      !form.totalCost
    ) {
      return;
    }

    const payload: CreateDailyEntryPayload = {
      clientName: selectedClient.name,
      employeeName: selectedEmployee.fullName,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      currency: form.currency,
      destination: form.destination,
      totalCost: parseFloat(form.totalCost) || 0,
      paidAmount: parseFloat(form.paidAmount) || 0,
      paymentDate: form.paymentDate,
      paymentMethod: form.paymentMethod,
      bookingLines:
        form.bookingPlace && form.serviceType && form.bookingPrice
          ? [
              {
                bookingPlace: form.bookingPlace,
                serviceType: form.serviceType,
                bookingPrice: parseFloat(form.bookingPrice) || 0,
              },
            ]
          : [],
    };

    createDailyEntry(payload, {
      onSuccess: () => onCreated(),
    });
  }

  return (
    <TableRow className="border-b border-[#EDEDF2] bg-[#FBFAFF]">
      <TableCell />
      <TableCell className="text-center text-muted-foreground">-</TableCell>
      <TableCell className="min-w-[160px]">
        <SelectField
          label=""
          placeholder="اختر الموظف"
          value={form.employeeId}
          onChange={(value) => update("employeeId", value)}
          options={employeeOptions}
        />
      </TableCell>
      <TableCell className="min-w-[160px]">
        <SelectField
          label=""
          placeholder="اختر العميل"
          value={form.clientId}
          onChange={(value) => update("clientId", value)}
          options={clientOptions}
        />
      </TableCell>
      <TableCell className="min-w-[150px]">
        <DateField
          label=""
          value={form.checkIn}
          onChange={(value) => update("checkIn", value)}
        />
      </TableCell>
      <TableCell className="min-w-[150px]">
        <DateField
          label=""
          value={form.checkOut}
          onChange={(value) => update("checkOut", value)}
        />
      </TableCell>
      <TableCell className="min-w-[140px]">
        <InvoiceTextField
          label=""
          placeholder="الوجهة"
          value={form.destination}
          onChange={(e) => update("destination", e.target.value)}
        />
      </TableCell>
      <TableCell className="min-w-[140px]">
        <InvoiceTextField
          label=""
          placeholder="مكان الحجز"
          value={form.bookingPlace}
          onChange={(e) => update("bookingPlace", e.target.value)}
        />
      </TableCell>
      <TableCell className="min-w-[140px]">
        <InvoiceTextField
          label=""
          placeholder="نوع الحجز"
          value={form.serviceType}
          onChange={(e) => update("serviceType", e.target.value)}
        />
      </TableCell>
      <TableCell className="min-w-[110px]">
        <InvoiceTextField
          label=""
          placeholder="0"
          type="number"
          value={form.bookingPrice}
          onChange={(e) => update("bookingPrice", e.target.value)}
        />
      </TableCell>
      <TableCell className="min-w-[160px]">
        <div className="flex items-center gap-1">
          <InvoiceTextField
            label=""
            placeholder="0"
            type="number"
            value={form.totalCost}
            onChange={(e) => update("totalCost", e.target.value)}
          />
          <div className="w-28">
            <SelectField
              label=""
              placeholder="العملة"
              value={form.currency}
              onChange={(value) => update("currency", value)}
              options={currencyOptions}
            />
          </div>
        </div>
      </TableCell>
      <TableCell className="min-w-[110px]">
        <InvoiceTextField
          label=""
          placeholder="0"
          type="number"
          value={form.paidAmount}
          onChange={(e) => update("paidAmount", e.target.value)}
        />
      </TableCell>
      <TableCell className="min-w-[150px]">
        <DateField
          label=""
          value={form.paymentDate}
          onChange={(value) => update("paymentDate", value)}
        />
      </TableCell>
      <TableCell className="min-w-[140px]">
        <InvoiceTextField
          label=""
          placeholder="طريقة الدفع"
          value={form.paymentMethod}
          onChange={(e) => update("paymentMethod", e.target.value)}
        />
      </TableCell>
      <TableCell className="text-center text-muted-foreground">-</TableCell>
      <TableCell>
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="text-[#1E9E4C] hover:opacity-80 disabled:opacity-50"
            title="حفظ"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="text-[#E0472C] hover:opacity-80 disabled:opacity-50"
            title="إلغاء"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}