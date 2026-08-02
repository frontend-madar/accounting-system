import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldLabel } from "./FieldLabel";

interface InvoiceTextFieldProps extends React.ComponentProps<"input"> {
    label: string;
    error?: string;
    dropdown?: boolean;
}

export const InvoiceTextField = React.forwardRef<
    HTMLInputElement,
    InvoiceTextFieldProps
>(
    (
        {
            label,
            error,
            dropdown,
            id,
            className,
            disabled,
            type = "text",
            ...props
        },
        ref
    ) => {
        const fieldId = id ?? props.name;

        return (
            <div className="w-full space-y-2">
                {/* Label */}
                <FieldLabel
                    htmlFor={fieldId}
                    dropdown={dropdown}
                >
                    <span className="text-[14px] font-semibold text-[#232323] md:text-[17px]">
                        {label}
                    </span>
                </FieldLabel>

                {/* Input */}
                <Input
                    id={fieldId}
                    ref={ref}
                     type={type}
                    disabled={disabled}
                    aria-invalid={!!error}
                    className={cn(
                        "h-[47px] w-full",
                        "rounded-xl",
                        "border border-[#C8C2FC]",
                        "bg-white",
                        "px-4",
                        "text-[15px] text-[#232323]",
                        "placeholder:text-[#9CA3AF]",
                        "shadow-sm",
                        "transition-colors duration-200",
                        "hover:border-[#837CC9]",
                        "focus-visible:border-[#40369F]",
                        "focus-visible:ring-2",
                        "focus-visible:ring-[#40369F]/20",
                        disabled &&
                        "cursor-not-allowed opacity-60",
                        error &&
                        "border-red-500",
                        error &&
                        "focus-visible:border-red-500",
                        error &&
                        "focus-visible:ring-red-200",
                        className
                    )}
                    {...props}
                />

                {/* Error */}
                {error && (
                    <p className="text-sm font-medium text-red-500">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

InvoiceTextField.displayName = "InvoiceTextField";