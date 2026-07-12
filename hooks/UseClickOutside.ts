import { useEffect, RefObject } from "react";

export function useClickOutside(ref: RefObject<HTMLElement>, onOutsideClick: () => void, active: boolean) {
    useEffect(() => {
        if (!active) return;

        function handleClick(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onOutsideClick();
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [active, ref, onOutsideClick]);
}