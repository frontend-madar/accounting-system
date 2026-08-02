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
        className="
        group
        flex
        items-center
        gap-3
        h-12
        rounded-2xl
        px-5
        border
        border-[#DCD5FF]
        bg-gradient-to-br
        from-white
        to-[#FAF8FF]
        shadow-[0_6px_18px_rgba(0,0,0,.06)]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-[#7B61FF]
        hover:shadow-[0_14px_32px_rgba(123,97,255,.15)]
      "
      >
        {/* Icon */}
        <div
          className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-xl
          bg-gradient-to-br
          from-[#F3EFFF]
          to-[#E9E1FF]
          transition-all
          duration-300
          group-hover:scale-105
          group-hover:rotate-6
        "
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 15 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.14648 7.5C3.51682 7.49999 3.82626 7.50026 4.08008 7.51758C4.34422 7.53562 4.59404 7.57461 4.83594 7.6748C5.39728 7.90744 5.84363 8.35364 6.07617 8.91504C6.17628 9.1569 6.21538 9.4068 6.2334 9.6709C6.25068 9.92457 6.25001 10.2335 6.25 10.6035V10.6465C6.25001 11.0165 6.25068 11.3254 6.2334 11.5791C6.21538 11.8432 6.17628 12.0931 6.07617 12.335C5.84363 12.8964 5.39728 13.3426 4.83594 13.5752C4.59404 13.6754 4.34422 13.7144 4.08008 13.7324C3.97905 13.7393 3.86893 13.7416 3.75 13.7441V15.625C3.75 15.9702 3.47018 16.25 3.125 16.25C2.77997 16.2498 2.5 15.9701 2.5 15.625V13.7441C2.38133 13.7416 2.27173 13.7393 2.1709 13.7324C1.90665 13.7144 1.65703 13.6754 1.41504 13.5752C0.853565 13.3426 0.407381 12.8964 0.174805 12.335C0.0746582 12.0931 0.0356006 11.8432 0.0175782 11.5791C0.000290744 11.3254 -6.09053e-06 11.0165 5.96046e-08 10.6465V10.6035C-6.09057e-06 10.2335 0.000290732 9.92457 0.0175782 9.6709C0.0356006 9.40675 0.0746579 9.15694 0.174805 8.91504C0.407381 8.35355 0.853565 7.90741 1.41504 7.6748C1.65703 7.57457 1.90665 7.53561 2.1709 7.51758C2.42474 7.50026 2.73412 7.49999 3.10449 7.5H3.14648Z"
              fill="#6D5DF6"
            />
          </svg>
        </div>

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
        className={`
          absolute
          left-0
          top-full
          z-50
          mt-3
          w-56
          origin-top-right
          rounded-2xl
          border
          border-[#ECE8FF]
          bg-white/95
          backdrop-blur-xl
          shadow-[0_20px_45px_rgba(0,0,0,.12)]
          transition-all
          duration-300
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0 visible"
              : "opacity-0 scale-95 -translate-y-2 invisible"
          }
        `}
      >
        <div className="p-2">
          {options.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleSelect(item)}
              className={`
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                px-4
                py-3
                text-right
                transition-all
                duration-200

                ${
                  selectedFilter === item
                    ? "bg-gradient-to-r from-[#6D5DF6] to-[#8B7BFF] text-white shadow-md"
                    : "hover:bg-[#F6F4FF] text-[#444]"
                }
              `}
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