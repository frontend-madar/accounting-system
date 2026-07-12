"use client";

import { useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/UseClickOutside";

export interface RowAction {
    label: string;
    onSelect: () => void;
    destructive?: boolean;
}

interface RowActionsMenuProps {
    actions: RowAction[];
    className?: string;
}

export function RowActionsMenu({ actions, className }: RowActionsMenuProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<any>(null);
    useClickOutside(rootRef, () => setOpen(false), open);

    return (
        <div ref={rootRef} className={cn("relative", className)}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-label="خيارات إضافية"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
            >
                <MoreHorizontal className="h-4 w-4" />
            </button>

            {open && actions.length > 0 && (
                <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-white py-1 shadow-lg">
                    {actions.map((action) => (
                        <button
                            key={action.label}
                            type="button"
                            onClick={() => {
                                action.onSelect();
                                setOpen(false);
                            }}
                            className={cn(
                                "block w-full px-3 py-2 text-right text-[13px] hover:bg-muted",
                                action.destructive ? "text-rose-600" : "text-foreground"
                            )}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}