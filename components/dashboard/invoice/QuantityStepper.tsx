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
        <div className={cn("space-y-1.5", className)}>
            <FieldLabel> <span className="text-[#232323] text-[18px] mb-2">{label}</span>  </FieldLabel>
            <div
                className={cn(
                    "flex h-[44px] ctm-inp  items-center justify-between rounded-lg border border-input px-2",
                    error && "border-red-500"
                )}
            >
                <button
                    type="button"
                    onClick={() => onChange(Math.min(max, value + 1))}
                    aria-label="زيادة"
                    className="flex h-7 w-7   items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                >
                    <Plus className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium">{value}</span>
                <button
                    type="button"
                    onClick={() => onChange(Math.max(min, value - 1))}
                    aria-label="إنقاص"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                >
                    <Minus className="h-4 w-4" />
                </button>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}