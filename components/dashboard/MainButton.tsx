"use client"
import Link from 'next/link';
import { Button } from '../ui/button'
import { cn } from '@/lib/utils';

interface MainButtonProps {
  text: string;
  icon?: React.ReactNode;
  href?: string;
  className?: string;
  disabled?: boolean;
  type?: "submit" | "button";
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
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
  variant = 'primary',
  size = 'md',
  loading = false,
  onClick
}: MainButtonProps) => {

  // Base styles
  const baseStyles = "gap-2 flex text-white items-center justify-center font-semibold transition-all duration-300 rounded-xl";

  // Size variants
  const sizeStyles = {
    sm: "h-[38px] px-4 text-[14px]",
    md: "h-[47px] px-6 text-[16px] md:text-[18px]",
    lg: "h-[56px] px-8 text-[17px] md:text-[19px]"
  };

  // Variant styles
  const variantStyles = {
    primary: "bg-gradient-to-r from-[#40369F] to-[#322A7C] hover:from-[#322A7C] hover:to-[#2A226B] focus-visible:ring-4 focus-visible:ring-[#40369F]/30 shadow-lg shadow-[#40369F]/25   hover:shadow-[#40369F]/35",
    secondary: "bg-[#6C7075] hover:bg-[#5C5F63] focus-visible:ring-4 focus-visible:ring-[#6C7075]/30 shadow-lg shadow-[#6C7075]/20",
    outline: "bg-transparent border-2 border-[#40369F] text-[#40369F] hover:bg-[#40369F] hover:text-white focus-visible:ring-4 focus-visible:ring-[#40369F]/20",
    ghost: "bg-transparent text-[#40369F] hover:bg-[#F5F6FF] focus-visible:ring-4 focus-visible:ring-[#40369F]/10"
  };

  // Loading state
  const LoadingSpinner = () => (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  // Disabled styles
  const disabledStyles = "opacity-60 cursor-not-allowed hover:scale-100";

  // Width styles (if not full width)
  const widthStyles = "md:w-[246px] w-full";

  const buttonContent = (
    <>
      {loading && <LoadingSpinner />}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{loading ? 'جاري...' : text}</span>
    </>
  );

  const combinedClassName = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    !disabled && !loading && "hover:scale-[1.02] active:scale-[0.98]",
    (disabled || loading) && disabledStyles,
    widthStyles,
    className
  );

  // Render as Link
  if (href) {
    return (
      <Link
        href={href}
        className={combinedClassName}
        onClick={onClick}
      >
        {buttonContent}
      </Link>
    );
  }

  // Render as Button
  return (
    <Button
      type={type}
      disabled={disabled || loading}
      className={combinedClassName}
      onClick={onClick}
    >
      {buttonContent}
    </Button>
  );
};

export default MainButton;