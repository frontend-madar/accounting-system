"use client";

import * as React from "react";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { useClickOutside } from "@/hooks/UseClickOutside";
import { cn } from "@/lib/utils";
import { FieldLabel } from "./FieldLabel";

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
    className?: string;
}

export function SelectField({
    label,
    value,
    onChange,
    options,
    placeholder = "اختر",
    error,
    className,
}: SelectFieldProps) {
    const [open, setOpen] = useState(false);

    const rootRef = useRef<any>(null);

    useClickOutside(rootRef, () => setOpen(false), open);

    const selected = options.find(
        (option) => option.value === value
    );

    return (
        <div className={cn("w-full space-y-2", className)}>

            {/* Label */}
            <FieldLabel dropdown>
                <span className="text-[14px] font-semibold text-[#232323] md:text-[17px]">
                    {label}
                </span>
            </FieldLabel>


            <div
                ref={rootRef}
                className="relative w-full"
            >
                {/* Select Button */}
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className={cn(
                        "flex h-[47px] w-full items-center justify-between",

                        "rounded-xl",

                        "border border-[#C8C2FC]",

                        "bg-white",

                        "px-4",

                        "text-[15px]",

                        "text-right",

                        "shadow-sm",

                        "transition-colors duration-200",

                        "hover:border-[#837CC9]",
                        "hover:bg-[#FAF9FF]",

                        "focus-visible:outline-none",
                        "focus-visible:border-[#40369F]",
                        "focus-visible:ring-2",
                        "focus-visible:ring-[#40369F]/20",

                        error &&
                        "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                    )}
                >
                    <span
                        className={cn(
                            "truncate",
                            !selected && "text-[#9CA3AF]"
                        )}
                    >
                        {selected
                            ? selected.label
                            : placeholder}
                    </span>


                    <span
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#F5F3FF]
                            text-[#40369F]
                        "
                    >
                        <ChevronDown
                            className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                open && "rotate-180"
                            )}
                        />
                    </span>
                </button>


                {/* Dropdown */}
                {open && (
                    <div
                        className="
                            absolute
                            right-0
                            top-full
                            z-50
                            mt-2
                            w-full
                            overflow-hidden
                            rounded-xl
                            border
                            border-[#E4E2E9]
                            bg-white
                            p-1
                            shadow-lg
                        "
                    >
                        <div className="max-h-60 overflow-y-auto">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        "flex w-full items-center justify-between",

                                        "rounded-lg",

                                        "px-3 py-2.5",

                                        "text-right",

                                        "text-sm",

                                        "transition-colors",

                                        "hover:bg-[#F5F3FF]",

                                        option.value === value &&
                                        "bg-[#F5F3FF] text-[#40369F] font-medium"
                                    )}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>


            {/* Error */}
            {error && (
                <p className="text-sm font-medium text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}