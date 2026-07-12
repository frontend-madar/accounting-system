"use client";

import * as React from "react";
import { MoreVertical } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { cn } from "@/lib/utils";

export interface InvoiceStatusSlice {
    key: string;
    label: string;
    value: number;
    color: string;
}

const DEFAULT_DATA: InvoiceStatusSlice[] = [
    { key: "paid", label: "مدفوعة", value: 34, color: "#EDE9FE" },
    { key: "unpaid", label: "غير مدفوعة", value: 12, color: "#83818C" },
    { key: "partial", label: "مدفوعة جزئيًا", value: 22, color: "#8571FE" },
];

interface InvoicesStatusCardProps {
    title?: string;
    data?: InvoiceStatusSlice[];
    className?: string;
}

export function InvoicesStatusCard({
    title = "حالة الفواتير",
    data = DEFAULT_DATA,
    className,
}: InvoicesStatusCardProps) {
    return (
        <div
            className={cn(
                "rounded-2xl shadow-[0px_3px_10.3px_0px_#0000001A] bg-white p-5",
                className
            )}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-[24px] font-semibold text-[#0F1219]">{title}</h3>
                <button
                    type="button"
                    aria-label="خيارات إضافية"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                >
                    <MoreVertical className="h-4 w-4" />
                </button>
            </div>

            <div className="relative mx-auto mt-2 h-48 w-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="label"
                            innerRadius="72%"
                            outerRadius="100%"
                            paddingAngle={3}
                            cornerRadius={8}
                            startAngle={90}
                            endAngle={-270}
                        >
                            {data.map((slice) => (
                                <Cell key={slice.key} fill={slice.color} stroke="none" />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* percentage labels placed around the ring */}
                {data.map((slice, index) => (
                    <span
                        key={slice.key}
                        className="absolute text-[13px] font-medium text-foreground"
                        style={ringLabelPosition(index, data.length)}
                    >
                        {slice.value}%
                    </span>
                ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {data.map((slice) => (
                    <div key={slice.key} className="flex items-center gap-1.5">
                        <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: slice.color }}
                        />
                        <span className="text-[12px] text-muted-foreground">{slice.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/** Rough label placement around the donut — good enough for 3–4 slices. */
function ringLabelPosition(index: number, total: number): React.CSSProperties {
    const positions: React.CSSProperties[] = [
        { top: "8%", left: "78%" },
        { bottom: "10%", left: "40%" },
        { top: "45%", left: "-4%" },
        { bottom: "40%", right: "-4%" },
    ];
    return positions[index % positions.length];
}