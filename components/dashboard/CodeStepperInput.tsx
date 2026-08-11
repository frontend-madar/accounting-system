"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CodeStepperInputProps {
  value: number;
  onChange: (value: number) => void;
  isLoading?: boolean;
  currency?: string;
  step?: number;
  className?: string;
}

export function CodeStepperInput({
  value: initialValue,
  onChange,
  isLoading = false,
  currency = "",
  step = 1,
  className,
}: CodeStepperInputProps) {
  const [localValue, setLocalValue] = React.useState(initialValue);
  const [isDirty, setIsDirty] = React.useState(false);

  // Sync with prop changes (when data reloads after save)
  React.useEffect(() => {
    setLocalValue(initialValue);
    setIsDirty(false);
  }, [initialValue]);

  function handleIncrement() {
    const newValue = Math.max(0, localValue + step);
    setLocalValue(newValue);
    setIsDirty(true);
  }

  function handleDecrement() {
    const newValue = Math.max(0, localValue - step);
    setLocalValue(newValue);
    setIsDirty(true);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = Number(event.target.value) || 0;
    setLocalValue(Math.max(0, newValue));
    setIsDirty(true);
  }

  function handleSave() {
    if (isDirty) {
      onChange(localValue);
      setIsDirty(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleSave();
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-11 items-center gap-1.5 rounded-2xl border border-[#D8D2F6] bg-[#FCFCFE] px-4 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-[13px]">جاري التحديث...</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="inline-flex h-11 items-center gap-1 rounded-2xl border border-[#D8D2F6] bg-[#FCFCFE] pr-1.5 pl-1 shadow-sm transition-all duration-200 hover:border-[#B9B1EC] focus-within:border-[#40369F] focus-within:ring-2 focus-within:ring-[#40369F]/10">
        {currency && (
          <span className="shrink-0 pl-1 text-[12px] font-medium text-[#8B90A0]">
            {currency}
          </span>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-xl text-[#40369F] hover:bg-[#EFEBFB] hover:text-[#40369F]"
          onClick={handleDecrement}
          disabled={localValue <= 0}
          aria-label="نقصان"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>

        <Input
          type="number"
          min={0}
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="h-8 w-16 border-none bg-transparent p-0 text-center text-[15px] font-semibold text-[#232323] shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-xl text-[#40369F] hover:bg-[#EFEBFB] hover:text-[#40369F]"
          onClick={handleIncrement}
          aria-label="زيادة"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </Button>
      </div>

      {isDirty && (
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          className="h-10 rounded-xl bg-[#40369F] px-4 text-white hover:bg-[#2F2585] transition-colors"
        >
          حفظ
        </Button>
      )}
    </div>
  );
}