import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldLabel } from "./FieldLabel";

interface InvoiceTextFieldProps extends React.ComponentProps<"input"> {
    label: string;
    error?: string;
    dropdown?: boolean;
}

export const InvoiceTextField = React.forwardRef<HTMLInputElement, InvoiceTextFieldProps>(
    ({ label, error, dropdown, id, className, ...props }, ref) => {
        const fieldId = id ?? props.name;

        return (
            <div className="space-y-1.5">
                <FieldLabel htmlFor={fieldId} dropdown={dropdown} >
                    <span className="text-[#232323] text-[14px] md:text-[18px] mb-2">{label}</span>
                </FieldLabel>
                <Input
                    id={fieldId}
                    ref={ref}
                    aria-invalid={!!error}
                    className={cn(
                        "ctm-inp",
                        error && "border-red-500 focus-visible:ring-red-500",
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-xs text-red-600">{error}</p>}
            </div>
        );
    }
);

InvoiceTextField.displayName = "InvoiceTextField";