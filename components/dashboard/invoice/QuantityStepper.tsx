import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { FieldLabel } from "./FieldLabel";

interface QuantityStepperProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    error?: string;
    className?: string;
}

export function QuantityStepper({
    label,
    value,
    onChange,
    min = 1,
    max = 99,
    error,
    className,
}: QuantityStepperProps) {
    return (
        <div className={cn("w-full space-y-2", className)}>
            <FieldLabel>
                <span className="text-[14px] font-semibold text-[#232323] md:text-[17px]">
                    {label}
                </span>
            </FieldLabel>

            <div
                className={cn(
                    "flex h-[47px] w-full items-center justify-between",
                    "rounded-xl",
                    "border border-[#C8C2FC]",
                    "bg-white",
                    "px-2",
                    "shadow-sm",
                    "transition-all duration-200",
                    "hover:border-[#837CC9]",
                    "focus-within:border-[#40369F]",
                    "focus-within:ring-2",
                    "focus-within:ring-[#40369F]/20",
                    error &&
                    "border-red-500 focus-within:border-red-500 focus-within:ring-red-200"
                )}
            >
                <button
                    type="button"
                    onClick={() => onChange(Math.min(max, value + 1))}
                    aria-label="زيادة"
                    className={cn(
                        "flex h-8 w-8 items-center justify-center",
                        "rounded-lg",
                        "text-[#40369F]",
                        "transition-colors duration-200",
                        "hover:bg-[#40369F]/10",
                        "active:scale-95"
                    )}
                >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                </button>

                <span className="min-w-[40px] text-center text-[15px] font-semibold text-[#232323]">
                    {value}
                </span>

                <button
                    type="button"
                    onClick={() => onChange(Math.max(min, value - 1))}
                    aria-label="إنقاص"
                    className={cn(
                        "flex h-8 w-8 items-center justify-center",
                        "rounded-lg",
                        "text-[#40369F]",
                        "transition-colors duration-200",
                        "hover:bg-[#40369F]/10",
                        "active:scale-95"
                    )}
                >
                    <Minus className="h-4 w-4 stroke-[2.5]" />
                </button>
            </div>

            {error && (
                <p className="text-sm font-medium text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}