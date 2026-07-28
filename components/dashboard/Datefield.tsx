"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { FieldLabel } from "./invoice/FieldLabel";

interface DateFieldProps {
    label: string;
    placeholder?: string;
    /** ISO date string, e.g. "2026-07-14" */
    value?: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
    id?: string;
    className?: string;
}

export function DateField({
    label,
    placeholder = "يوم/شهر/سنة",
    value,
    onChange,
    error,
    disabled,
    id,
    className,
}: DateFieldProps) {
    const fieldId = id ?? label;

    const selectedDate = value
        ? new Date(value)
        : undefined;

    return (
        <div className="w-full space-y-2">
            {/* Label */}
            <FieldLabel htmlFor={fieldId} dropdown={false}>
                <span className="text-[14px] font-semibold text-[#232323] md:text-[17px]">
                    {label}
                </span>
            </FieldLabel>

            <Popover>
                <PopoverTrigger
                    className="w-full"
                    render={
                        <Button
                            id={fieldId}
                            type="button"
                            variant="outline"
                            disabled={disabled}
                            aria-invalid={!!error}
                            className={cn(
                                "flex h-[47px] w-full items-center justify-between",
                                "rounded-xl",
                                "border border-[#C8C2FC]",
                                "bg-white",
                                "px-4",
                                "text-[15px] font-normal",
                                "text-[#232323]",
                                "shadow-sm",
                                "transition-colors",
                                "hover:bg-[#FAF9FF]",
                                "hover:border-[#837CC9]",
                                "focus-visible:border-[#40369F]",
                                "focus-visible:ring-2",
                                "focus-visible:ring-[#40369F]/20",
                                !selectedDate && "text-[#9CA3AF]",
                                error &&
                                "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200",
                                disabled && "cursor-not-allowed opacity-60",
                                className
                            )}
                        >
                            <span>
                                {selectedDate
                                    ? format(selectedDate, "dd/MM/yyyy")
                                    : placeholder}
                            </span>

                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F3FF] text-[#40369F]">
                                <CalendarIcon className="h-4 w-4" />
                            </span>
                        </Button>
                    }
                />

                <PopoverContent
                    align="start"
                    className=" w-auto rounded-xl border border-[#E4E2E9] bg-white p-2 shadow-lg " >
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                            if (date) {
                                onChange(format(date, "yyyy-MM-dd"));
                            }
                        }}
                        locale={ar}
                        className="rounded-lg"
                    />
                </PopoverContent>
            </Popover>

            {error && (
                <p className="text-sm font-medium text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}