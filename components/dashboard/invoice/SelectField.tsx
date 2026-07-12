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

    const selected = options.find((option) => option.value === value);

    return (
        <div className={cn("space-y-1.5", className)}>
            <FieldLabel dropdown>
                <span className="text-[#232323] text-[18px] mb-2">{label}</span>
            </FieldLabel>

            <div ref={rootRef} className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className={cn(
                        "flex h-11 w-full items-center ctm-inp justify-between rounded-lg border border-input bg-transparent px-3 text-right text-sm",
                        error && "border-red-500"
                    )}
                >
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 text-muted-foreground transition-transform absolute left-3",
                            open && "rotate-180"
                        )}
                    />
                    <span className={cn(!selected && "text-muted-foreground")}>
                        {selected ? selected.label : placeholder}
                    </span>
                </button>

                {open && (
                    <div className="absolute right-0 top-full z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-white py-1 shadow-lg">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                }}
                                className={cn(
                                    "block w-full px-3 py-2 text-right text-sm hover:bg-muted",
                                    option.value === value && "bg-muted font-medium"
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}