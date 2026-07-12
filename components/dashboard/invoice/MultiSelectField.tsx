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
}

export function MultiSelectField({
    label,
    value,
    onChange,
    options,
    placeholder = "اختر",
    error,
    className,
}: MultiSelectFieldProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<any>(null);
    useClickOutside(rootRef, () => setOpen(false), open);

    function toggle(optionValue: string) {
        onChange(
            value.includes(optionValue)
                ? value.filter((v) => v !== optionValue)
                : [...value, optionValue]
        );
    }

    const selectedOptions = options.filter((option) => value.includes(option.value));

    return (
        <div className={cn("space-y-1.5", className)}>
            <FieldLabel dropdown> <span className="text-[#232323] text-[18px] mb-2">{label}</span>  </FieldLabel>

            <div ref={rootRef} className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className={cn(
                        "flex h-11 ctm-inp  w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 text-right text-sm",
                        error && "border-red-500"
                    )}
                >
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 text-muted-foreground transition-transform absolute left-3",
                            open && "rotate-180"
                        )}
                    />
                    <span className={cn(selectedOptions.length === 0 && "text-muted-foreground")}>
                        {selectedOptions.length > 0
                            ? `${selectedOptions.length} عناصر مختارة`
                            : placeholder}
                    </span>
                </button>

                {open && (
                    <div className="absolute right-0 top-full z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-white py-1 shadow-lg">
                        {options.map((option) => {
                            const checked = value.includes(option.value);
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => toggle(option.value)}
                                    className="flex w-full items-center justify-between px-3 py-2 text-right text-sm hover:bg-muted"
                                >
                                    {option.label}
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
                            className="flex items-center gap-1.5 rounded-full bg-[#EFEDFB] px-3 py-1.5 text-xs font-medium text-[#40369F]"
                        >
                            {option.label}
                            <button
                                type="button"
                                onClick={() => toggle(option.value)}
                                aria-label={`إزالة ${option.label}`}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}