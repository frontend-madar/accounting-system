"use client";

import * as React from "react";
import { useRef, useState } from "react";
import { ChevronDown, FileEdit, Filter, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/UseClickOutside";
import SearchInput from "../SearchInput";
import FillterButton from "../FillterButton";
import MainButton from "../MainButton";

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
             <SearchInput />

            <div className="flex items-center gap-2">
                <div ref={filterRef} className="relative">
                    <FillterButton />

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

                <MainButton text="إنشاء فاتورة" icon={<Plus className="h-4 w-4" />} />
            </div>
        </div>
    );
}