"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SelectFilterOption {
    label: string;
    value: string;
}

interface SelectFilterProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectFilterOption[];
    className?: string;
}

export function SelectFilter({
    value,
    onChange,
    options,
    className,
}: SelectFilterProps) {
    return (
        <Select
            value={value}
            onValueChange={(newValue) => {
                if (newValue !== null) {
                    onChange(newValue);
                }
            }}
        >
            <SelectTrigger
                className={`h-11 min-w-[110px] rounded-lg border-border bg-white text-[14px] ${className ?? ""}`}
            >
                <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}