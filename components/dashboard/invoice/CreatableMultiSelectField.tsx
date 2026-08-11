"use client";

import * as React from "react";
import { useRef, useState, useMemo } from "react";
import { ChevronDown, Plus, Search, X, Loader2 } from "lucide-react";

import { useClickOutside } from "@/hooks/UseClickOutside";
import { cn } from "@/lib/utils";
import { FieldLabel } from "./FieldLabel";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface CreatableMultiSelectFieldProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  error?: string;
  className?: string;
  createLabel?: string;
  /** Called when the user submits a brand-new option. Should resolve once the
   *  option is persisted — the created value is then auto-selected. */
  onCreateOption?: (name: string) => Promise<void> | void;
  isCreating?: boolean;
}

export function CreatableMultiSelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "اختر الأقسام أو أضف قسمًا جديدًا",
  error,
  className,
  createLabel = "إضافة قسم",
  onCreateOption,
  isCreating = false,
}: CreatableMultiSelectFieldProps) {
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

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

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
        setTimeout(() => searchRef.current?.focus(), 0);
      } else {
        setSearch("");
      }
      return next;
    });
  }

  function toggleValue(optValue: string) {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  }

  function removeValue(optValue: string) {
    onChange(value.filter((v) => v !== optValue));
  }

  async function handleCreate() {
    if (!normalizedSearch || !onCreateOption) return;
    await onCreateOption(normalizedSearch);
    // Assumes the newly created department's value === its typed name,
    // matching how department names are used elsewhere in this codebase.
    if (!value.includes(normalizedSearch)) {
      onChange([...value, normalizedSearch]);
    }
    setSearch("");
    searchRef.current?.focus();
  }

  return (
    <div className={cn("w-full space-y-2", className)}>
      <FieldLabel dropdown>
        <span className="text-[14px] font-semibold text-[#232323] md:text-[17px]">
          {label}
        </span>
      </FieldLabel>

      <div ref={rootRef} className="relative w-full">
        {/* Field / trigger */}
        <button
          type="button"
          onClick={handleOpen}
          className={cn(
            "flex min-h-[47px] w-full items-center justify-between gap-2",
            "rounded-xl",
            "border border-[#C8C2FC]",
            "bg-white",
            "px-3 py-2",
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
          <div className="flex flex-1 flex-wrap items-center gap-1.5">
            {selectedOptions.length === 0 ? (
              <span className="text-[#9CA3AF]">{placeholder}</span>
            ) : (
              selectedOptions.map((opt) => (
                <span
                  key={opt.value}
                  className="flex items-center gap-1 rounded-lg bg-[#F5F3FF] px-2 py-1 text-[13px] font-medium text-[#40369F]"
                >
                  {opt.label}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeValue(opt.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        removeValue(opt.value);
                      }
                    }}
                    className="rounded-full p-0.5 hover:bg-[#E4E0FB]"
                  >
                    <X className="h-3 w-3" />
                  </span>
                </span>
              ))
            )}
          </div>

          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5F3FF] text-[#40369F]">
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
          <div className="absolute right-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-[#E4E2E9] bg-white p-1 shadow-lg">
            {/* Search / create input */}
            <div className="mb-1 flex items-center gap-2 rounded-lg border border-[#E4E2E9] bg-[#FAF9FF] px-3 py-2">
              <Search className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (filteredOptions.length > 0 && !hasExactMatch) {
                      toggleValue(filteredOptions[0].value);
                      setSearch("");
                    } else if (normalizedSearch && !hasExactMatch) {
                      handleCreate();
                    }
                  }
                }}
                placeholder="ابحث أو اكتب اسم قسم جديد..."
                disabled={isCreating}
                className="w-full bg-transparent text-sm text-right outline-none placeholder:text-[#9CA3AF] disabled:opacity-60"
              />
            </div>

            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length === 0 && !normalizedSearch ? (
                <div className="px-3 py-4 text-center text-sm text-[#9CA3AF]">
                  لايوجد
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const checked = value.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleValue(option.value)}
                      className={cn(
                        "flex w-full items-center justify-between",
                        "rounded-lg",
                        "px-3 py-2.5",
                        "text-right",
                        "text-sm",
                        "transition-colors",
                        "hover:bg-[#F5F3FF]",
                        checked && "bg-[#F5F3FF] text-[#40369F] font-medium"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded border",
                          checked
                            ? "border-[#40369F] bg-[#40369F]"
                            : "border-[#C8C2FC] bg-white"
                        )}
                      >
                        {checked && (
                          <svg
                            viewBox="0 0 12 12"
                            className="h-2.5 w-2.5 fill-white"
                          >
                            <path d="M4.5 8.5L2 6l-.7.7L4.5 10 10 4.5 9.3 3.8z" />
                          </svg>
                        )}
                      </span>
                      {option.label}
                    </button>
                  );
                })
              )}

              {/* Create-new row */}
              {onCreateOption && normalizedSearch && !hasExactMatch && (
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-right text-sm font-medium text-[#40369F] transition-colors hover:bg-[#F5F3FF] disabled:opacity-60"
                >
                  {isCreating ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 shrink-0" />
                  )}
                  {createLabel} "{normalizedSearch}"
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
    </div>
  );
}