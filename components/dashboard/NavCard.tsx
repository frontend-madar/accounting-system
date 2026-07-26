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
        "group relative overflow-hidden rounded-3xl",
        "flex items-center justify-between gap-5",
        "min-h-[118px]",
        "px-6 py-5",
        "transition-all duration-500 ease-out",
        "shadow-[0_5px_25px_rgba(0,0,0,.05)]",
        "hover:-translate-y-1",
        "hover:shadow-[0_20px_45px_rgba(0,0,0,.12)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4338ca]/30",
        current.card,
        className
      )}
    >
      {/* Animated Glow */}
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4338ca]/5 via-transparent to-[#7c3aed]/10" />
      </div>

      {/* Top Accent */}
      <div className="absolute left-6 right-6 top-0 h-[3px] scale-x-0 rounded-full bg-gradient-to-r from-[#4338ca] via-[#7c3aed] to-[#8b5cf6] transition-transform duration-500 group-hover:scale-x-100" />

      {/* Decorative Blur */}
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#7c3aed]/10 blur-3xl transition-all duration-500 group-hover:scale-125" />

      {/* Content */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-3">
          <h3
            className={cn(
              "truncate text-xl font-bold tracking-tight sm:text-2xl",
              current.title
            )}
          >
            {title}
          </h3>

          {badge && (
            <span
              className={cn(
                "rounded-xl px-3 py-1 text-[11px] font-semibold shadow-sm transition-transform duration-300 group-hover:scale-105",
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
              "mt-2 max-w-[90%] text-sm leading-6",
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
          "relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border",
          "transition-all duration-500",
          "shadow-lg",
          "group-hover:rotate-6",
          "group-hover:scale-110",
          current.icon
        )}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        </div>

        <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
          {icon ? (
            icon
          ) : showArrow ? (
            <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
          ) : (
            <ChevronRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1" />
          )}
        </div>

        {/* Ripple */}
        <span className="absolute inset-0 scale-0 rounded-2xl bg-white/20 transition-transform duration-500 group-hover:scale-150" />
      </div>
    </Link>
  );
}