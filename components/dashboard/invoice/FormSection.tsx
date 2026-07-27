import * as React from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface FormSectionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    gridClassName?: string;
}

export function FormSection({
    title,
    children,
    className,
    gridClassName,
}: FormSectionProps) {
    return (
        <Card
            className={cn(
                "group rounded-3xl",
                "border border-slate-200/70",
                "bg-gradient-to-br from-white via-white to-slate-50",
                "shadow-sm transition-all duration-300",
                "hover:shadow-lg",
                className
            )}
        >
            <CardContent className="p-6 md:p-8 ">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <div className="h-10 w-1.5 rounded-full bg-gradient-to-b from-[#463BAF] to-[#0e065e]" />

                    <h2 className="text-xl font-bold   text-slate-900 md:text-2xl">
                        {title}
                    </h2>

                </div>

                {/* Fields */}
                <div
                    className={cn(
                        "grid grid-cols-1 gap-6",
                        "md:grid-cols-2",
                        "xl:grid-cols-3",
                        "2xl:grid-cols-4",
                        gridClassName
                    )}
                >
                    {children}
                </div>
            </CardContent>
        </Card>
    );
}