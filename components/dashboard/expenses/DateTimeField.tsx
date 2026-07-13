"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateTimeFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function DateTimeField({
  label,
  value,
  onChange,
  error,
}: DateTimeFieldProps) {
  return (
    <div dir="rtl">
      <label className="mb-2 block text-[18px] text-[#232323]">{label}</label>
      <div
        className={cn(
          "flex h-12 items-center gap-2 rounded-lg border px-3",
          error ? "border-red-500" : "border-[#C0C0C0]"
        )}
      >
        <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-[16px] text-[#232323] outline-none [color-scheme:light]"
        />
      </div>
      {error && <p className="mt-1 text-[13px] text-red-500">{error}</p>}
    </div>
  );
}