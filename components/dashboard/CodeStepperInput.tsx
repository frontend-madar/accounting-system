"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeStepperInputProps {
  value: number;
  onChange: (value: number) => void;
  isLoading?: boolean;
  currency?: string;
  className?: string;
}

export function CodeStepperInput({
  value,
  onChange,
  isLoading = false,
  currency = "EGP",
  className,
}: CodeStepperInputProps) {
  return (
    <div
      className={cn(
        "group relative flex h-12 items-center gap-2 rounded-2xl px-3",
        "border border-[#D8D2F6]",
        "bg-[#FCFCFE]",
        "shadow-sm",
        "transition-all duration-200",
        "hover:border-[#B9B1EC]",
        "focus-within:border-[#40369F] focus-within:ring-2 focus-within:ring-[#40369F]/10",
        isLoading && "pointer-events-none opacity-70",
        className
      )}
    >
      {currency && (
        <span className="shrink-0 text-[12px] font-medium text-[#8B90A0]">
          {currency}
        </span>
      )}

      <input
        type="number"
        value={value}
        disabled={isLoading}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className={cn(
          "w-10 min-w-0 flex-1",
          "text-center text-[16px] font-semibold text-[#232323]",
          "outline-none disabled:cursor-not-allowed",
          "[appearance:textfield]",
          "[&::-webkit-inner-spin-button]:appearance-none",
          "[&::-webkit-outer-spin-button]:appearance-none"
        )}
      />

      {isLoading ? (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-[#40369F]" />
        </div>
      ) : (
        <div className="flex shrink-0 flex-col overflow-hidden rounded-lg border border-[#E8E5F8] bg-white">
          <button
            type="button"
            onClick={() => onChange(value + 1)}
            aria-label="زيادة"
            className={cn(
              "flex h-5 w-6 items-center justify-center",
              "text-[#8B90A0] transition-colors duration-150",
              "hover:bg-[#F3F2FF] hover:text-[#40369F] active:bg-[#EBE9FE]",
              "border-b border-[#E8E5F8]"
            )}
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onChange(Math.max(0, value - 1))}
            aria-label="نقصان"
            className={cn(
              "flex h-5 w-6 items-center justify-center",
              "text-[#8B90A0] transition-colors duration-150",
              "hover:bg-[#F3F2FF] hover:text-[#40369F] active:bg-[#EBE9FE]"
            )}
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}