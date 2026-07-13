import * as React from "react";

import { cn } from "@/lib/utils";

interface FormSectionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    gridClassName?: string;
}

export function FormSection({ title, children, className, gridClassName }: FormSectionProps) {
    return (
        <div className={cn("space-y-4", className)}>
            <h2 className="text-[22px] font-bold text-[#0F1219]">{title}</h2>
            <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", gridClassName)}>
                {children}
            </div>
        </div>
    );
}