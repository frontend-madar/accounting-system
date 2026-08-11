"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SecondaryButtonBaseProps {
    text: string;
    icon?: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

interface SecondaryButtonAsLink
    extends SecondaryButtonBaseProps,
    Omit<React.ComponentPropsWithoutRef<"a">, keyof SecondaryButtonBaseProps | "type"> {
    href: string;
    onClick?: () => void;
    type?: never;
}

interface SecondaryButtonAsButton
    extends SecondaryButtonBaseProps,
    Omit<React.ComponentPropsWithoutRef<"button">, keyof SecondaryButtonBaseProps | "type"> {
    href?: undefined;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
}

type SecondaryButtonProps = SecondaryButtonAsLink | SecondaryButtonAsButton;

const SecondaryButton = React.forwardRef<
    HTMLButtonElement | HTMLAnchorElement,
    SecondaryButtonProps
>((props, ref) => {
    const {
        text,
        icon,
        href,
        className,
        onClick,
        disabled = false,
        ...rest
    } = props;

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
            <Link
                href={href}
                className={buttonClass}
                onClick={onClick}
                ref={ref as React.Ref<HTMLAnchorElement>}
                {...(rest as Omit<React.ComponentPropsWithoutRef<"a">, "href" | "className" | "onClick">)}
            >
                {icon && (
                    <span className="flex h-5 w-5 items-center justify-center">
                        {icon}
                    </span>
                )}
                <span>{text}</span>
            </Link>
        );
    }

    const { type = "button" } = props as SecondaryButtonAsButton;

    return (
        <Button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={buttonClass}
            ref={ref as React.Ref<HTMLButtonElement>}
            {...(rest as Omit<React.ComponentPropsWithoutRef<"button">, "type" | "disabled" | "className" | "onClick">)}
        >
            {icon && (
                <span className="flex h-5 w-5 items-center justify-center">
                    {icon}
                </span>
            )}
            {text && <span>{text}</span>}
        </Button>
    );
});

SecondaryButton.displayName = "SecondaryButton";

export default SecondaryButton;