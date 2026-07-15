import * as React from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface FormSectionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    gridClassName?: string;
}

export function FormSection({ title, children, className, gridClassName }: FormSectionProps) {
    return (
        <Card className={cn("space-y-4 bg-[#eeeeee60] border  py-5   ", className)}>
            <CardContent >
                <h2 className="text-[18px] md:text-[22px] font-bold text-[#0F1219]">{title}</h2>
                <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", gridClassName)}>
                    {children}
                </div>
            </CardContent>
        </Card>
    );
}