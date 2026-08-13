import * as React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { StatePillIcon } from "@/icons";

interface StatPillProps {
    label: string;
    value: string;
    /** Percentage change, e.g. -4.75 or 2.45. Sign controls color + arrow. */
    change: number;
    className?: string;
}

export function StatPill({ label, value, change, className }: StatPillProps) {
    const isPositive = change >= 0;

    return (
        <div
            className={cn(
                "flex items-end justify-between w-[189px] h-[69px] gap-2 rounded-xl shadow-[0px_2px_16px_0px_#7090B02E] bg-white px-3 py-2",
                className
            )}
        >
            <div>
                <p className="text-[12px] text-[#161B74]">{label}</p>
                <p className="text-[20px] font-semibold text-[#1B2559] flex flex-row-reverse gap-2 items-center"> <span>

                <StatePillIcon />

                </span> <span style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}>{value}</span></p>
            </div>
            <span
                className={cn(
                    "flex items-center justify-center gap-0.5 w-[59px] h-[24px] rounded-full px-1.5 py-0.5 text-[13px] font-medium",
                    isPositive
                        ? "bg-[#05CD991A] text-[#05CD99]"
                        : "bg-[#E31A1A1A] text-[#E31A1A]"
                )}
            >
                 
                {Math.abs(change)}%
            </span>
        </div>
    );
}