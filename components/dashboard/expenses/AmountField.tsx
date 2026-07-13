"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface Option {
  label: string;
  value: string;
}

interface AmountFieldProps {
  label: string;
  required?: boolean;
  currency: string;
  onCurrencyChange: (value: string) => void;
  currencyOptions: Option[];
  amount: string;
  onAmountChange: (value: string) => void;
  error?: string;
  className?: string;
}

export function AmountField({
  label,
  required,
  currency,
  onCurrencyChange,
  currencyOptions,
  amount,
  onAmountChange,
  error,
  className,
}: AmountFieldProps) {
  return (
    <div dir="rtl" className={cn(className)}>
      <label className="mb-2 flex items-center gap-1 text-[18px] text-[#232323]">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div
        dir="ltr"
        className={cn(
          "flex h-12 items-center rounded-lg border px-3",
          error ? "border-red-500" : "border-[#C0C0C0]"
        )}
      >
        <Select value={currency} onValueChange={onCurrencyChange}>
          <SelectTrigger
            className="w-auto text-[#000619]  text-[20px] border-0 bg-transparent px-0 shadow-none focus:ring-0 focus:ring-offset-0"
          >
            <SelectValue />
          </SelectTrigger>
          
          <SelectContent align="start">
            {currencyOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <input
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0.00"
          className="flex-1 bg-transparent text-right text-[20px] font-semibold text-[#232323] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>

      {error && <p className="mt-1 text-[13px] text-red-500">{error}</p>}
    </div>
  );
}