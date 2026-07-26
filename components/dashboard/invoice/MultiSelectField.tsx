"use client";

import * as React from "react";
import { useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { FieldLabel } from "./FieldLabel";
import { SelectOption } from "./SelectField";
import { useClickOutside } from "@/hooks/UseClickOutside";

interface MultiSelectFieldProps {
    label: string;
    value: string[];
    onChange: (value: string[]) => void;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
    className?: string;
    disabled?: boolean;
}

export function MultiSelectField({
    label,
    value = [],
    onChange,
    options,
    placeholder = "اختر",
    error,
    className,
    disabled,
}: MultiSelectFieldProps) {

    const [open, setOpen] = useState(false);

    const rootRef = useRef<HTMLDivElement>(null);

    function toggle(optionValue: string) {
        onChange(
            value.includes(optionValue)
                ? value.filter((v) => v !== optionValue)
                : [...value, optionValue]
        );
    }

    const selectedOptions = options.filter(
        (option) =>
            value.includes(option.value)
    );

    return (
        <div className={cn("w-full space-y-2", className)}>
            <FieldLabel dropdown>
                <span className="text-[14px] font-semibold text-[#232323] md:text-[17px]">
                    {label}
                </span>
            </FieldLabel>

            <div ref={rootRef} className="relative">
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setOpen((prev) => !prev)}
                    aria-invalid={!!error}
                    className={cn(
                        "relative flex h-[47px] w-full items-center rounded-xl border border-[#C8C2FC] bg-white px-4 text-right text-[15px] text-[#232323] shadow-sm transition-all duration-200 hover:border-[#837CC9] focus-visible:outline-none focus-visible:border-[#40369F] focus-visible:ring-2 focus-visible:ring-[#40369F]/20",
                        error && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200",
                        disabled && "cursor-not-allowed opacity-60"
                    )}
                >
                    <span className={cn("truncate", selectedOptions.length === 0 && "text-[#9CA3AF]")}>
                        {selectedOptions.length > 0 ? `${selectedOptions.length} عناصر مختارة` : placeholder}
                    </span>

                    <ChevronDown className={cn("absolute left-4 h-5 w-5 text-[#9CA3AF] transition-transform duration-200", open && "rotate-180 text-[#40369F]")} />
                </button>

                {open && (
                    <div className="absolute right-0 top-[52px] z-50 w-full overflow-hidden rounded-xl border border-[#E5E7EB] bg-white py-1 shadow-lg">
                        {options.map((option) => {
                            const checked = value.includes(option.value);
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => toggle(option.value)}
                                    className={cn(
                                        "flex w-full items-center justify-between px-4 py-2.5 text-right text-sm transition-colors",
                                        checked ? "bg-[#EFEDFB] text-[#40369F]" : "text-[#232323] hover:bg-[#F8F7FF]"
                                    )}
                                >
                                    <span>{option.label}</span>
                                    {checked && <Check className="h-4 w-4 text-[#40369F]" />}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                    {selectedOptions.map((option) => (
                        <span
                            key={option.value}
                            className="flex items-center gap-2 rounded-full bg-[#EFEDFB] px-3 py-1.5 text-xs font-semibold text-[#40369F]"
                        >
                            {option.label}
                            <button
                                type="button"
                                onClick={() => toggle(option.value)}
                                className="transition hover:text-red-500"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {error && (
                <p className="text-sm font-medium text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}