import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface FieldLabelProps {
    htmlFor?: string;
    children: React.ReactNode;
    /** Shows a small chevron above the label — used for select/date fields. */
    dropdown?: boolean;
    className?: string;
}

export function FieldLabel({ htmlFor, children, dropdown, className }: FieldLabelProps) {
    return (
        <div className={cn("flex items-center justify-between ", className)}>
            <label htmlFor={htmlFor} className="text-[13px] font-medium text-muted-foreground">
                {children}
            </label>
            {/* {dropdown && <ChevronDown className="h-4 w-4 text-muted-foreground" />} */}
        </div>
    );
}