"use client";

import * as React from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import { StatPill } from "./StatPill";

export interface FinancePoint {
    label: string;
    value: number;
}

const DEFAULT_DATA: FinancePoint[] = [
    { label: "يناير", value: 108 },
    { label: "فبراير", value: 100 },
    { label: "مارس", value: 96 },
    { label: "ابريل", value: 92 },
    { label: "مايو", value: 90 },
    { label: "يونيو", value: 88 },
    { label: "يوليو", value: 96 },
    { label: "اغسطس", value: 85 },
    { label: "سبتمبر", value: 82 },
    { label: "اكتوبر", value: 80 },
    { label: "نوفمبر", value: 78 },
    { label: "ديسمبر", value: 76 },
];

const PERIOD_OPTIONS = ["يوميا", "اسبوعيا", "شهريا", "سنويا"];

interface FinanceChartCardProps {
    data?: FinancePoint[];
    revenue?: { value: string; change: number };
    expenses?: { value: string; change: number };
    className?: string;
}

export function FinanceChartCard({
    data = DEFAULT_DATA,
    revenue = { value: "5230", change: 2.45 },
    expenses = { value: "5230", change: -4.75 },
    className,
}: FinanceChartCardProps) {
    const [period, setPeriod] = useState("شهريا");
    const [periodOpen, setPeriodOpen] = useState(false);

    return (
        <div className={cn("rounded-2xl shadow-[0px_3px_10.3px_0px_#0000001A] bg-white p-5", className)}>
            <div className="flex flex-wrap md:items-center justify-between gap-3">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <StatPill label="الإيرادات" value={revenue.value} change={revenue.change} />
                    <StatPill label="المصروفات" value={expenses.value} change={expenses.change} />
                </div>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setPeriodOpen((prev) => !prev)}
                        className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[13px] text-foreground"
                    >
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        {period}
                    </button>

                    {periodOpen && (
                        <div className="absolute z-10 left-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-lg border border-border bg-white py-1 shadow-lg">
                            {PERIOD_OPTIONS.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                        setPeriod(option);
                                        setPeriodOpen(false);
                                    }}
                                    className="block w-full px-3 py-2 text-right text-[13px] hover:bg-muted"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 h-64 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
                        <defs>
                            <linearGradient id="financeFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#695BE1" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="#695BE1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#EEF0F6" />
                        <XAxis
                            dataKey="label"
                            reversed
                            tick={{ fontSize: 11, fill: "#9CA3AF" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: "#9CA3AF" }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `$${v}`}
                            width={40}
                        />
                        <Tooltip
                            formatter={(value) => [`﷼ ${value}`, ""]}
                            labelFormatter={(label) => label}
                            contentStyle={{
                                borderRadius: 10,
                                border: "1px solid #EEF0F6",
                                fontSize: 12,
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#40369F"
                            strokeWidth={2}
                            fill="url(#financeFill)"
                            dot={false}
                            activeDot={{ r: 5, fill: "#40369F", stroke: "#fff", strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}