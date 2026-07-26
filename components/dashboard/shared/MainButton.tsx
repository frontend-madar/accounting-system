"use client";

import Link from "next/link";
 import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MainButtonProps {
  text: string;
  icon?: React.ReactNode;
  href?: string;
  className?: string;
  disabled?: boolean;
  type?: "submit" | "button";
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  onClick?: () => void;
}

const MainButton = ({
  text,
  icon,
  href,
  className,
  disabled = false,
  type = "submit",
  variant = "primary",
  size = "md",
  loading = false,
  onClick,
}: MainButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-colors duration-200 whitespace-nowrap";

  const sizeStyles = {
    sm: "h-10 px-5 text-sm",
    md: "h-12 px-6 text-[16px] md:text-[17px]",
    lg: "h-14 px-8 text-[18px]",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#40369F] to-[#5648C7] text-white border border-transparent shadow-md hover:brightness-95",

    secondary:
      "bg-[#6C7075] text-white border border-transparent shadow-sm hover:bg-[#5C5F63]",

    outline:
      "bg-white border border-[#CFC8F7] text-[#40369F] shadow-sm hover:bg-[#F8F7FF] hover:border-[#40369F]",

    ghost:
      "bg-transparent text-[#40369F] hover:bg-[#F5F6FF]",
  };

  const disabledStyles =
    "opacity-60 cursor-not-allowed pointer-events-none";

  const widthStyles = "w-full md:w-[246px]";

  const LoadingSpinner = () => (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-20"
      />
      <path
        fill="currentColor"
        className="opacity-80"
        d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z"
      />
    </svg>
  );

  const content = (
    <>
      {loading && <LoadingSpinner />}
      {!loading && icon && <span className="shrink-0">{icon}</span>}
      <span>{loading ? "جاري..." : text}</span>
    </>
  );

  const classes = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    widthStyles,
    (disabled || loading) && disabledStyles,
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <Button
      type={type}
      disabled={disabled || loading}
      className={classes}
      onClick={onClick}
    >
      {content}
    </Button>
  );
};

export default MainButton;