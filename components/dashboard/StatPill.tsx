import * as React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

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

                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_101_14058)">
                            <path d="M9.95866 15.9463C9.67314 16.5835 9.48441 17.2751 9.41211 18.0003L15.4542 16.7075C15.7397 16.0704 15.9283 15.3787 16.0008 14.6534L9.95866 15.9463Z" fill="#1B2559" />
                            <path d="M15.4534 12.8339C15.739 12.1968 15.9277 11.5051 16 10.7799L11.2934 11.7875V9.85051L15.4533 8.96067C15.7388 8.32356 15.9276 7.63187 15.9999 6.90664L11.2933 7.91339V0.947429C10.5721 1.35503 9.93157 1.89758 9.41093 2.53756V8.31625L7.5286 8.71898V0C6.80741 0.407453 6.16692 0.950151 5.64627 1.59013V9.12156L1.43455 10.0224C1.14904 10.6595 0.960165 11.3512 0.887719 12.0765L5.64627 11.0585V13.4978L0.546551 14.5887C0.261035 15.2258 0.0723042 15.9175 0 16.6427L5.33798 15.5008C5.77252 15.4099 6.146 15.1513 6.38881 14.7954L7.36777 13.3345V13.3342C7.46939 13.1831 7.5286 13.0008 7.5286 12.8045V10.6558L9.41093 10.2531V14.127L15.4533 12.8336L15.4534 12.8339Z" fill="#1B2559" />
                        </g>
                        <defs>
                            <clipPath id="clip0_101_14058">
                                <rect width="16" height="18" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>

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