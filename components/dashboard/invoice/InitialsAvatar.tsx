
import { cn } from "@/lib/utils";

const PALETTE = [
    { bg: "bg-emerald-100", text: "text-emerald-700" },
    { bg: "bg-rose-100", text: "text-rose-700" },
    { bg: "bg-sky-100", text: "text-sky-700" },
    { bg: "bg-amber-100", text: "text-amber-700" },
    { bg: "bg-violet-100", text: "text-violet-700" },
];

function colorForName(name: string) {
    const code = name.charCodeAt(0) || 0;
    return PALETTE[code % PALETTE.length];
}

interface InitialsAvatarProps {
    name: string;
    size?: "sm" | "md";
    className?: string;
}

export function InitialsAvatar({ name, size = "md", className }: InitialsAvatarProps) {
    const initial = name.trim().charAt(0) || "?";
    const color = colorForName(name);

    return (
        <span
            className={cn(
                "flex shrink-0 items-center justify-center rounded-lg font-semibold",
                color.bg,
                color.text,
                size === "md" ? "h-11 w-11 text-lg" : "h-6 w-6 text-xs rounded-full",
                className
            )}
        >
            {initial}
        </span>
    );
}