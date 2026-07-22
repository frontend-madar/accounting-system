// components/DevToolsBlocker.tsx
'use client';
import { useEffect } from 'react';

export default function DevToolsBlocker() {
    useEffect(() => {
        const disableRightClick = (e: MouseEvent) => e.preventDefault();

        const disableKeys = (e: KeyboardEvent) => {
            // F12
            if (e.key === 'F12') e.preventDefault();
            // Ctrl+Shift+I / J / C (inspect, console, element picker)
            if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
                e.preventDefault();
            }
            // Ctrl+U (view source)
            if (e.ctrlKey && e.key.toUpperCase() === 'U') e.preventDefault();
        };

        document.addEventListener('contextmenu', disableRightClick);
        document.addEventListener('keydown', disableKeys);

        return () => {
            document.removeEventListener('contextmenu', disableRightClick);
            document.removeEventListener('keydown', disableKeys);
        };
    }, []);

    return null;
}