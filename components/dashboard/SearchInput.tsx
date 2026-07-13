import { Search } from 'lucide-react';
import React from 'react'
import { Input } from '../ui/input';

const SearchInput = ({query , setQuery , setPage}: {query? : string , setQuery? : (query : string) => void , setPage? : (page : number) => void}) => {
    return (
        <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search"
                placeholder="بحث"
                value={query}
                onChange={(event) => {
                    setQuery?.(event.target.value);
                    setPage?.(1);
                }}
                className="h-[40px] md:h-[47px] border-[#C8C2FC] pr-9 text-right"
            />
        </div>
    )
}

export default SearchInput