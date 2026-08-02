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
 import { Separator } from "@base-ui/react";
import { FieldLabel } from "../invoice/FieldLabel";

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
  disabled?: boolean;
  id?: string;
}

export const AmountField = React.forwardRef<HTMLInputElement, AmountFieldProps>(
  (
    {
      label,
      required,
      currency,
      onCurrencyChange,
      currencyOptions,
      amount,
      onAmountChange,
      error,
      className,
      disabled,
      id,
    },
    ref
  ) => {
    const fieldId = id ?? "amount-field";

    return (
      <div className={cn("w-full space-y-2", className)}>
        {/* Label */}
        <FieldLabel htmlFor={fieldId} dropdown>
          <span className="text-[14px] font-semibold text-[#232323] md:text-[17px]">
            {label}
            {required && <span className="text-red-500 mr-1">*</span>}
          </span>
        </FieldLabel>

        {/* Input container with Select */}
        <div
          dir="ltr"
          className={cn(
            "flex h-[47px] w-full items-center",
            "rounded-xl",
            "border",
            "bg-white",
            "px-3",
            "shadow-sm",
            "transition-colors duration-200",
            "hover:border-[#837CC9]",
            "focus-within:border-[#40369F]",
            "focus-within:ring-2",
            "focus-within:ring-[#40369F]/20",
            disabled && "cursor-not-allowed opacity-60",
            error ? "border-red-500" : "border-[#C8C2FC]",
            error && "focus-within:border-red-500",
            error && "focus-within:ring-red-200"
          )}
        >
          <Select
            value={currency}
            onValueChange={(value) => {
              if (value !== null) {
                onCurrencyChange(value);
              }
            }}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                "w-auto",
                "border-0",
                "bg-transparent",
                "px-0",
                "text-[15px] text-[#232323]",
                "shadow-none",
                "focus:ring-0",
                "focus:ring-offset-0",
                "hover:bg-transparent",
                disabled && "cursor-not-allowed opacity-60"
              )}
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

          <Separator orientation="vertical" className="mx-2 h-6" />

          <input
            id={fieldId}
            ref={ref}
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.00"
            disabled={disabled}
            className={cn(
              "flex-1",
              "bg-transparent",
              "text-right",
              "text-[15px]",
              "font-semibold",
              "text-[#232323]",
              "outline-none",
              "placeholder:text-[#9CA3AF]",
              "disabled:cursor-not-allowed",
              "[appearance:textfield]",
              "[&::-webkit-inner-spin-button]:appearance-none",
              "[&::-webkit-outer-spin-button]:appearance-none"
            )}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm font-medium text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

 