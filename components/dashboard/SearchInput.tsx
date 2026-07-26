import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  query?: string;
  setQuery?: (query: string) => void;
  setPage?: (page: number) => void;
  placeholder?: string;
}

const SearchInput = ({
  query,
  setQuery,
  setPage,
  placeholder,
}: SearchInputProps) => {
  return (
    <div className="relative w-full max-w-sm">
      {/* Search Icon */}
      <Search
        className="
          pointer-events-none
          absolute
          right-4
          top-1/2
          h-5
          w-5
          -translate-y-1/2
          text-[#8B90A0]
        "
      />

      <Input
        type="search"
        placeholder={placeholder || "بحث..."}
        value={query}
        onChange={(e) => {
          setQuery?.(e.target.value);
          setPage?.(1);
        }}
        className={cn(
          "h-12",
          "rounded-2xl",
          "border border-[#D8D2F6]",
          "bg-[#FCFCFE]",
          "pr-12 pl-4",
          "text-right text-[15px]",
          "placeholder:text-[#A0A4AE]",
          "shadow-sm",
          "transition-colors duration-200",
          "focus:border-[#40369F]",
          "focus:ring-2 focus:ring-[#40369F]/10",
          "focus:bg-white"
        )}
      />
    </div>
  );
};

export default SearchInput;