"use client";

import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { FieldLabel } from "./invoice/FieldLabel";
import { ar } from "date-fns/locale";
import { format } from "date-fns";

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
    const selectedDate = value ? new Date(value) : undefined;

    return (
        <div className="space-y-1.5 w-full">
            <FieldLabel htmlFor={fieldId} dropdown={false}>
                <span className="text-[#232323] text-[14px] md:text-[18px] mb-2">
                    {label}
                </span>
            </FieldLabel>

            <Popover>
                <PopoverTrigger className="w-full">
                    <Button
                        id={fieldId}
                        type="button"
                        variant="outline"
                        disabled={disabled}
                        aria-invalid={!!error}
                        className={cn(
                            "ctm-inp w-full justify-between font-normal  bg-transparent",
                            !selectedDate && "text-muted-foreground",
                            error && "border-red-500 focus-visible:ring-red-500",
                            className
                        )}
                    >
                        <span>
                            {selectedDate ? format(selectedDate, "dd/MM/yyyy") : placeholder}
                        </span>
                        <CalendarIcon className="h-4 w-4 shrink-0 text-gray-500" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                            if (date) onChange(format(date, "yyyy-MM-dd"));
                        }}
                        locale={ar}
                    />
                </PopoverContent>
            </Popover>

            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}