"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SecondaryButtonProps {
    text: string;
    icon?: React.ReactNode;
    href?: string;
    className?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

const SecondaryButton = ({
    text,
    icon,
    href,
    className,
    onClick,
    type = "button",
    disabled = false,
}: SecondaryButtonProps) => {
    const buttonClass = cn(
        "inline-flex items-center justify-center gap-2",
        "w-full md:w-[246px]",
        "h-12",
        "rounded-2xl",
        "border border-[#D8D2F6]",
        "bg-white",
        "px-6",
        "text-[16px] md:text-[17px]",
        "font-semibold",
        "text-[#1B1B1B]",
        "shadow-sm",
        "transition-colors duration-200",
        "hover:bg-[#F8F7FF]",
        "hover:border-[#BFB5F2]",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[#40369F]/15",
        disabled && "pointer-events-none opacity-60",
        className
    );

    if (href) {
        return (
            <Link href={href} className={buttonClass} onClick={onClick}>
                {icon && (
                    <span className="flex h-5 w-5 items-center justify-center">
                        {icon}
                    </span>
                )}
                <span>{text}</span>
            </Link>
        );
    }

    return (
        <Button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={buttonClass}
        >
            {icon && (
                <span className="flex h-5 w-5 items-center justify-center">
                    {icon}
                </span>
            )}
            <span>{text}</span>
        </Button>
    );
};

export default SecondaryButton;