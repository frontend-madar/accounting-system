"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  href: string;
  className?: string;
  variant?: "default" | "browse" | "gradient" | "outline";
  showArrow?: boolean;
  badge?: string;
  onNavigate?: () => void;
}

export function NavCard({
  title,
  subtitle,
  icon,
  href,
  className,
  variant = "default",
  showArrow = false,
  badge,
  onNavigate,
}: NavCardProps) {
  const variants = {
    default: {
      card:
        "bg-gradient-to-br from-white via-white to-[#faf8ff] border-[#ebe7f7] hover:border-[#cfc3ff]",
      title: "text-[#111827]",
      subtitle: "text-[#6b7280]",
      icon:
        "bg-gradient-to-br from-[#f4f0ff] to-[#ebe3ff] border-[#ddd3ff] text-[#4f46e5]",
      badge: "bg-[#ede9fe] text-[#4f46e5]",
    },

    browse: {
      card:
        "bg-gradient-to-br from-[#fcfcff] to-[#f5f7ff] border-[#e7ebff] hover:border-[#bfd0ff]",
      title: "text-[#111827]",
      subtitle: "text-[#6b7280]",
      icon:
        "bg-gradient-to-br from-[#eef4ff] to-[#e2ebff] border-[#d8e4ff] text-[#2563eb]",
      badge: "bg-[#dbeafe] text-[#2563eb]",
    },

    gradient: {
      card:
        "bg-gradient-to-br from-[#4338ca] via-[#5b4fe9] to-[#7568ff] border-transparent",
      title: "text-white",
      subtitle: "text-white/80",
      icon:
        "bg-white/15 border-white/20 text-white backdrop-blur-sm",
      badge: "bg-white/15 text-white",
    },

    outline: {
      card:
        "bg-white border-2 border-[#ebe7f7] hover:border-[#6d5dfc]",
      title: "text-[#111827]",
      subtitle: "text-[#6b7280]",
      icon:
        "bg-white border-[#ebe7f7] text-[#6d5dfc]",
      badge: "bg-[#ede9fe] text-[#6d5dfc]",
    },
  };

  const current = variants[variant];

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group relative overflow-hidden rounded-2xl sm:rounded-3xl",
        "flex items-center gap-3 sm:gap-5",
        "min-h-[90px] sm:min-h-[100px] md:min-h-[118px]",
        "px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-5",
        "transition-all duration-500 ease-out",
        "shadow-[0_5px_25px_rgba(0,0,0,.05)]",
        "hover:-translate-y-1",
        "hover:shadow-[0_20px_45px_rgba(0,0,0,.12)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4338ca]/30",
        "active:scale-[0.98] active:transition-transform active:duration-150",
        current.card,
        className
      )}
    >
      {/* Animated Glow - Hidden on mobile for performance */}
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 max-sm:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4338ca]/5 via-transparent to-[#7c3aed]/10" />
      </div>

      {/* Top Accent */}
      <div className="absolute left-4 right-4 sm:left-6 sm:right-6 top-0 h-[2px] sm:h-[3px] scale-x-0 rounded-full bg-gradient-to-r from-[#4338ca] via-[#7c3aed] to-[#8b5cf6] transition-transform duration-500 group-hover:scale-x-100" />

      {/* Decorative Blur - Adjusted for mobile */}
      <div className="absolute -right-8 -top-8 sm:-right-10 sm:-top-10 h-20 w-20 sm:h-28 sm:w-28 rounded-full bg-[#7c3aed]/10 blur-2xl sm:blur-3xl transition-all duration-500 group-hover:scale-125 max-sm:hidden" />

      {/* Content */}
      <div className="relative flex flex-1 flex-col overflow-hidden min-w-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h3
            className={cn(
              "truncate text-base font-bold tracking-tight",
              "sm:text-xl sm:tracking-tight",
              "md:text-2xl",
              current.title
            )}
          >
            {title}
          </h3>

          {badge && (
            <span
              className={cn(
                "rounded-xl px-2 py-0.5 sm:px-3 sm:py-1",
                "text-[9px] sm:text-[10px] md:text-[11px]",
                "font-semibold shadow-sm",
                "transition-transform duration-300 group-hover:scale-105",
                "shrink-0",
                current.badge
              )}
            >
              {badge}
            </span>
          )}
        </div>

        {subtitle && (
          <p
            className={cn(
              "mt-1 sm:mt-1.5 md:mt-2",
              "max-w-full sm:max-w-[90%]",
              "text-xs sm:text-sm",
              "leading-5 sm:leading-6",
              "line-clamp-2 sm:line-clamp-none",
              current.subtitle
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Icon */}
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl",
          "h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16",
          "border",
          "transition-all duration-500",
          "shadow-md sm:shadow-lg",
          "group-hover:rotate-3 sm:group-hover:rotate-6",
          "group-hover:scale-105 sm:group-hover:scale-110",
          current.icon
        )}
      >
        {/* Animated Background - Hidden on mobile */}
        <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 max-sm:hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        </div>

        <div className="relative z-10 transition-transform duration-500 group-hover:scale-105 sm:group-hover:scale-110">
          {icon ? (
            <div className="h-4 w-4 sm:h-5 sm:w-5 md:h-5 md:w-5">
              {icon}
            </div>
          ) : showArrow ? (
            <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
          ) : (
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-500 group-hover:translate-x-1" />
          )}
        </div>

        {/* Ripple */}
        <span className="absolute inset-0 scale-0 rounded-xl sm:rounded-2xl bg-white/20 transition-transform duration-500 group-hover:scale-150" />
      </div>
    </Link>
  );
}