"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimeFieldProps {
  label: string;
  value?: Date;
  onChange: (date?: Date) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function DateTimeField({
  label,
  value,
  onChange,
  error,
  disabled,
  className,
}: DateTimeFieldProps) {
  const handleTimeChange = (time: string) => {
    if (!value) return;

    const [hours, minutes] = time.split(":").map(Number);

    const newDate = new Date(value);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);

    onChange(newDate);
  };

  return (
    <div dir="rtl" className={cn("w-full space-y-2", className)}>
      <label className="block text-[15px] font-semibold text-[#232323] md:text-[17px]">
        {label}
      </label>

      <Popover>
        <PopoverTrigger className={'w-full'}  disabled={disabled}>
          <button
            type="button"
            className={cn(
              "relative flex h-[52px] w-full items-center rounded-xl border bg-white px-4 text-right transition-all",
              disabled && "cursor-not-allowed opacity-70",
              error
                ? "border-red-500"
                : "border-[#D8D2F6] hover:border-[#BEB6F3] focus:border-[#40369F]"
            )}
          >
            <div className="ml-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F3FF] text-[#40369F]">
              <CalendarIcon className="h-4 w-4" />
            </div>

            <span
              className={cn(
                "flex-1 text-left text-[15px]",
                value ? "text-[#232323]" : "text-[#9CA3AF]"
              )}
            >
              {value
                ? format(value, "dd MMMM yyyy - hh:mm a", {
                    locale: ar,
                  })
                : "اختر التاريخ والوقت"}
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-auto rounded-2xl p-0"
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              if (!date) return;

              if (value) {
                date.setHours(value.getHours());
                date.setMinutes(value.getMinutes());
              }

              onChange(date);
            }}
            locale={ar}
          />

          <div className="border-t p-4">
            <input
              type="time"
              className="h-10 w-full rounded-lg border px-3"
              value={
                value
                  ? `${String(value.getHours()).padStart(2, "0")}:${String(
                      value.getMinutes()
                    ).padStart(2, "0")}`
                  : ""
              }
              onChange={(e) => handleTimeChange(e.target.value)}
            />
          </div>
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-sm font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}