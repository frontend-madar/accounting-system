"use client";

import * as React from "react";
import { ChevronLeft, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavCardProps {
    title: string;
    /** Only used by the "browse" variant. */
    subtitle?: string;
    icon: React.ReactNode;
    className?: string;
    href: string
}

export function NavCard({
    title,
    subtitle,
    icon,
    className,
    href
}: NavCardProps) {

    return (
        <Link
            href={href}
            className={cn(
                "flex w-full h-[95px] items-center gap-3 justify-between rounded-2xl shadow-[0px_2px_8px_0px_#0000000F] bg-white px-4 py-3.5 text-right shadow-sm transition-colors hover:border-[#40369F]/30",
                className
            )}
        >


            <div>
                <p className="text-[24px] font-bold text-[#0F1219]">{title}</p>
                {subtitle && (
                    <p className="mt-0.5 text-[14px] text-[#676A6E]">{subtitle}</p>
                )}
            </div>

            <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-[#F2ECFD]", 
                subtitle && "bg-[#F4F7FE]"
            )}>
                {icon ?? <ChevronLeft className="h-4 w-4" />}
            </span>
        </Link>
    );
}