"use client";

import * as React from "react";
import { useRef, useState, useMemo } from "react";
import { ChevronDown, Plus, Search } from "lucide-react";

import { useClickOutside } from "@/hooks/UseClickOutside";
import { cn } from "@/lib/utils";
import { FieldLabel } from "../invoice/FieldLabel";

export interface SelectOption {
  value: string;
  label: string;
}

interface CreatableSelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  className?: string;
  createLabel?: string;
}

export function CreatableSelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "اختر أو اكتب قيمة جديدة",
  error,
  className,
  createLabel = "إضافة",
}: CreatableSelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const rootRef = useRef<any>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useClickOutside(
    rootRef,
    () => {
      setOpen(false);
      setSearch("");
    },
    open
  );

  const selected = options.find((option) => option.value === value);
  // A value that doesn't match any known option is a user-created entry —
  // still show it as the current selection on the trigger.
  const displayLabel = selected?.label ?? value;

  const normalizedSearch = search.trim();

  const filteredOptions = useMemo(() => {
    if (!normalizedSearch) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedSearch.toLowerCase())
    );
  }, [options, normalizedSearch]);

  const hasExactMatch = options.some(
    (option) => option.label.toLowerCase() === normalizedSearch.toLowerCase()
  );

  function handleOpen() {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        // Focus the search input once the dropdown mounts.
        setTimeout(() => searchRef.current?.focus(), 0);
      } else {
        setSearch("");
      }
      return next;
    });
  }

  function handleSelect(nextValue: string) {
    onChange(nextValue);
    setOpen(false);
    setSearch("");
  }

  function handleCreate() {
    if (!normalizedSearch) return;
    handleSelect(normalizedSearch);
  }

  return (
    <div className={cn("w-full space-y-2", className)}>
      {/* Label */}
      <FieldLabel dropdown>
        <span className="text-[14px] font-semibold text-[#232323] md:text-[17px]">
          {label}
        </span>
      </FieldLabel>

      <div ref={rootRef} className="relative w-full">
        {/* Select Button */}
        <button
          type="button"
          onClick={handleOpen}
          className={cn(
            "flex h-[47px] w-full items-center justify-between",
            "rounded-xl",
            "border border-[#C8C2FC]",
            "bg-white",
            "px-4",
            "text-[15px]",
            "text-right",
            "shadow-sm",
            "transition-colors duration-200",
            "hover:border-[#837CC9]",
            "hover:bg-[#FAF9FF]",
            "focus-visible:outline-none",
            "focus-visible:border-[#40369F]",
            "focus-visible:ring-2",
            "focus-visible:ring-[#40369F]/20",
            error &&
              "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
          )}
        >
          <span className={cn("truncate", !displayLabel && "text-[#9CA3AF]")}>
            {displayLabel || placeholder}
          </span>

          <span
            className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#F5F3FF]
                            text-[#40369F]
                        "
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </span>
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="
                            absolute
                            right-0
                            top-full
                            z-50
                            mt-2
                            w-full
                            overflow-hidden
                            rounded-xl
                            border
                            border-[#E4E2E9]
                            bg-white
                            p-1
                            shadow-lg
                        "
          >
            {/* Search / create input */}
            <div className="flex items-center gap-2 rounded-lg border border-[#E4E2E9] bg-[#FAF9FF] px-3 py-2 mb-1">
              <Search className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (filteredOptions.length > 0) {
                      handleSelect(filteredOptions[0].value);
                    } else {
                      handleCreate();
                    }
                  }
                }}
                placeholder="ابحث أو اكتب فئة جديدة..."
                className="w-full bg-transparent text-sm text-right outline-none placeholder:text-[#9CA3AF]"
              />
            </div>

            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length === 0 && !normalizedSearch ? (
                <div className="px-3 py-4 text-center text-sm text-[#9CA3AF]">
                  لايوجد
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "flex w-full items-center justify-between",
                      "rounded-lg",
                      "px-3 py-2.5",
                      "text-right",
                      "text-sm",
                      "transition-colors",
                      "hover:bg-[#F5F3FF]",
                      option.value === value &&
                        "bg-[#F5F3FF] text-[#40369F] font-medium"
                    )}
                  >
                    {option.label}
                  </button>
                ))
              )}

              {/* Create-new row — shown whenever there's typed text that
                  doesn't already match an existing option exactly. */}
              {normalizedSearch && !hasExactMatch && (
                <button
                  type="button"
                  onClick={handleCreate}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-right text-sm font-medium text-[#40369F] transition-colors hover:bg-[#F5F3FF]"
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  {createLabel} "{normalizedSearch}"
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
    </div>
  );
}