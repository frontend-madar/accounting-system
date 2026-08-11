import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  query?: string;
  setQuery?: (query: string) => void;
  setPage?: (page: number) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput = ({
  query,
  setQuery,
  setPage,
  placeholder,
  className,
}: SearchInputProps) => {
  return (
    <div className={cn("relative w-full", className)}>
      {/* Search Icon */}
      <Search
        className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9CA3AF] transition-colors duration-200 group-focus-within:text-[#40369F]"
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
          "h-[47px] w-full",
          "rounded-xl",
          "border border-[#C8C2FC]",
          "bg-white",
          "pr-12 pl-4",
          "text-right text-[15px] text-[#232323]",
          "placeholder:text-[#9CA3AF]",
          "shadow-sm",
          "transition-colors duration-200",
          "hover:border-[#837CC9]",
          "focus-visible:border-[#40369F]",
          "focus-visible:ring-2",
          "focus-visible:ring-[#40369F]/20",
          "focus-visible:outline-none",
          "placeholder:text-right",
        )}
      />
    </div>
  );
};

export default SearchInput;