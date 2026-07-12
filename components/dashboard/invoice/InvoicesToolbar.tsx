"use client";

import * as React from "react";
import { useRef, useState } from "react";
import { ChevronDown, FileEdit, Filter, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/UseClickOutside";

const FILTER_OPTIONS = ["الكل", "مستحقة الدفع", "مدفوعة", "ملغاة"];

interface InvoicesToolbarProps {
    onCreateInvoice?: () => void;
    onOpenDrafts?: () => void;
    onSearch?: (value: string) => void;
    onFilterChange?: (value: string) => void;
    className?: string;
}

export function InvoicesToolbar({
    onCreateInvoice,
    onOpenDrafts,
    onSearch,
    onFilterChange,
    className,
}: InvoicesToolbarProps) {
    const [filter, setFilter] = useState(FILTER_OPTIONS[0]);
    const [filterOpen, setFilterOpen] = useState(false);
    const filterRef = useRef<any>(null);
    useClickOutside(filterRef, () => setFilterOpen(false), filterOpen);

    return (
        <div className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
            <div className="relative w-full max-w-sm sm:w-72">
                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="بحث"
                    onChange={(event) => onSearch?.(event.target.value)}
                    className="h-10 rounded-lg border-border bg-white pr-9 text-right"
                />
            </div>

            <div className="flex items-center gap-2">
                <div ref={filterRef} className="relative">
                    <button
                        type="button"
                        onClick={() => setFilterOpen((prev) => !prev)}
                        className="flex w-27 h-11  items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-[13px] text-foreground"
                    >
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        {filter}
                        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>

                    {filterOpen && (
                        <div className="absolute left-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-lg border border-border bg-white py-1 shadow-lg">
                            {FILTER_OPTIONS.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                        setFilter(option);
                                        setFilterOpen(false);
                                        onFilterChange?.(option);
                                    }}
                                    className="block w-full px-3 py-2 text-right text-[13px] hover:bg-muted "
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={onOpenDrafts}
                    className="gap-2 rounded-lg w-32 h-11 "
                >
                    <FileEdit className="h-4 w-4" />
                    المسودة
                </Button>

                <Button
                    type="button"
                    onClick={onCreateInvoice}
                    className="gap-2 w-39 h-11 rounded-lg bg-[#463BAF] hover:bg-[#332a80]"
                >
                    <Plus className="h-4 w-4" />
                    إنشاء فاتورة
                </Button>
            </div>
        </div>
    );
}