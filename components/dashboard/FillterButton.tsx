"use client";

import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const DEFAULT_FILTERS = ["الكل", "الأحدث", "الأقدم"];

interface FilterButtonProps {
  options?: string[];
  selectedFilter?: string;
  onFilterChange?: (value: string) => void;
  className?: string;
}

const FilterButton = ({
  options = DEFAULT_FILTERS,
  selectedFilter: controlledSelected,
  onFilterChange,
  className = "",
}: FilterButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState(options[0] || "فلتر");

  const selectedFilter = controlledSelected !== undefined ? controlledSelected : internalSelected;

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleSelect = (value: string) => {
    if (onFilterChange) {
      onFilterChange(value);
    } else {
      setInternalSelected(value);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        className="group flex items-center gap-3 w-full h-12 rounded-2xl px-5 border border-[#DCD5FF] bg-gradient-to-br from-white to-[#FAF8FF] shadow-[0_6px_18px_rgba(0,0,0,.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7B61FF] hover:shadow-[0_14px_32px_rgba(123,97,255,.15)]"
      >
        <span className="font-semibold text-[15px] text-[#222]">
          {selectedFilter}
        </span>

        <ChevronDown
          className={`ml-auto h-4 w-4 text-[#6D5DF6] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`absolute left-0 top-full z-50 mt-3 w-56 origin-top-right rounded-2xl border border-[#ECE8FF] bg-white/95 backdrop-blur-xl shadow-[0_20px_45px_rgba(0,0,0,.12)] transition-all duration-300
          ${isOpen ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 scale-95 -translate-y-2 invisible"}`}
      >
        {/* Fixed height container with scroll */}
        <div className="max-h-52 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-[#6D5DF6] scrollbar-track-[#F6F4FF]">
          {options.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleSelect(item)}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-right transition-all duration-200 ${
                selectedFilter === item
                  ? "bg-gradient-to-r from-[#6D5DF6] to-[#8B7BFF] text-white shadow-md"
                  : "hover:bg-[#F6F4FF] text-[#444]"
              }`}
            >
              <span className="font-medium">{item}</span>

              {selectedFilter === item && (
                <Check className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterButton;