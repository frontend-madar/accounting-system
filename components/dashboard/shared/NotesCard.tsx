"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { FieldLabel } from "../invoice/FieldLabel";
import { cn } from "@/lib/utils";

interface NotesCardProps extends React.ComponentProps<"textarea"> {
    title: string;
    description?: string;
    error?: string;
    cardClassName?: string;
}

export const NotesCard = React.forwardRef<HTMLTextAreaElement, NotesCardProps>(
    (
        {
            title,
            description,
            error,
            id,
            className,
            cardClassName,
            ...props
        },
        ref
    ) => {
        const fieldId = id ?? props.name;

        return (
            <Card
                className={cn(
                    "overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-slate-50 shadow-sm transition-all duration-300 hover:shadow-md",
                    cardClassName
                )}
            >
                <div className="border-slate-100 px-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-1.5 rounded-full bg-gradient-to-b from-[#463BAF] to-[#0e065e]" />
                        <div>
                            <FieldLabel htmlFor={fieldId} dropdown={false}>
                                <span className="text-xl font-bold text-slate-900">
                                    {title}
                                </span>
                            </FieldLabel>
                            {description && (
                                <p className="mt-1 text-sm text-slate-500">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <Textarea
                        id={fieldId}
                        ref={ref}
                        aria-invalid={!!error}
                        className={cn(
                            "min-h-[180px] resize-none rounded-2xl border-slate-200 bg-slate-50/50 px-4 py-3 text-base leading-7 placeholder:text-slate-400 transition-all duration-200 focus:border-[#102e4f] focus:bg-white focus:ring-4 focus:ring-[#102e4f]/10",
                            error && "border-red-500 focus:border-red-500 focus:ring-red-200",
                            className
                        )}
                        {...props}
                    />
                    {error && (
                        <p className="mt-2 text-sm font-medium text-red-500">
                            {error}
                        </p>
                    )}
                </div>
            </Card>
        );
    }
);

NotesCard.displayName = "NotesCard";