"use client";

import * as React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeStepperInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function CodeStepperInput({
  value,
  onChange,
  className,
}: CodeStepperInputProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-md border border-[#C6C2E6] bg-[#F6F7FB] text-[25px] px-2 py-1 w-fit",
        className
      )}
    >
      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          aria-label="زيادة"
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronUp className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          aria-label="نقصان"
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-14 bg-transparent text-center text-[#101011] text-[17px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );
}