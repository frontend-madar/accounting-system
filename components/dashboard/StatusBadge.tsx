"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export type InvoiceStatus = "completed" | "partial" | "cancelled";

export const STATUS_CONFIG: Record<
    InvoiceStatus,
    { label: string; bg: string; text: string; dot: string }
> = {
    completed: {
        label: "مكتملة",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
    },
    partial: {
        label: "باقي دفع",
        bg: "bg-slate-100",
        text: "text-slate-600",
        dot: "bg-slate-400",
    },
    cancelled: {
        label: "كنسل",
        bg: "bg-amber-50",
        text: "text-amber-600",
        dot: "bg-amber-500",
    },
};

interface StatusBadgeProps {
    value: InvoiceStatus;
    /** Called with the newly picked status. Omit to render a read-only badge. */
    onChange?: (status: InvoiceStatus) => void;
    className?: string;
}

export function StatusBadge({ value, onChange, className }: StatusBadgeProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const config = STATUS_CONFIG[value];
    const editable = Boolean(onChange);

    useEffect(() => {
        if (!open) return;
        function handleClickOutside(event: MouseEvent) {
            if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <div ref={rootRef} className={cn("relative inline-block", className)}>
            <button
                type="button"
                disabled={!editable}
                onClick={() => setOpen((prev) => !prev)}
                className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors",
                    config.bg,
                    config.text,
                    editable && "hover:brightness-95"
                )}
            >
                <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
                {config.label}
                {editable && <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {open && editable && (
                <div className="absolute left-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-lg border border-border bg-white py-1 shadow-lg">
                    {(Object.keys(STATUS_CONFIG) as InvoiceStatus[]).map((key) => {
                        const option = STATUS_CONFIG[key];
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => {
                                    onChange?.(key);
                                    setOpen(false);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-right text-[13px] text-foreground hover:bg-muted"
                            >
                                <span className={cn("h-1.5 w-1.5 rounded-full", option.dot)} />
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}