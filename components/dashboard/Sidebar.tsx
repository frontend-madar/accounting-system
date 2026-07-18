"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
    LayoutGrid,
    CircleDollarSign,
    NotebookPen,
    FileText,
    Wallet,
    Users2,
    Banknote,
    Briefcase,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useClickOutside } from "@/hooks/UseClickOutside";

// ---- Types ----
type SubLink = {
    key: string;
    label: string;
    href: string;
};

type NavLink = {
    key: string;
    label: string;
    icon: React.ElementType;
    type: "link";
    href?: string;
    exact?: boolean;
};

type NavDropdown = {
    key: string;
    label: string;
    icon: React.ElementType;
    type: "dropdown";
    children: SubLink[];
};

type NavItem = NavLink | NavDropdown;

const MOBILE_BREAKPOINT = 1024;

const NAV_ITEMS: NavItem[] = [
    { key: "dashboard", label: "لوحة التحكم", icon: LayoutGrid, type: "link", href: "/dashboard", exact: true },
    { key: "credit-accounts", label: "الحسابات الآجلة", icon: CircleDollarSign, type: "link", href: "/dashboard/credit-accounts" },
    { key: "daily-entries", label: "القيود اليومية", icon: NotebookPen, type: "link", href: "/dashboard/daily-entries" },
    { key: "invoices", label: "الفواتير", icon: FileText, type: "link", href: "/dashboard/invoices" },
    {
        key: "expenses",
        label: "المصروفات",
        icon: Wallet,
        type: "dropdown",
        children: [
            { key: "manage-expenses", label: "اضافة مصروفات", href: "/dashboard/expenses/add-expense" },
            { key: "add-expense", label: "  مصروفات", href: "/dashboard/expenses" },
        ],
    },
    {
        key: "employees",
        label: "الموظفين",
        icon: Users2,
        type: "dropdown",
        children: [
            { key: "manage-employees", label: "ادارة الموظفين", href: "/dashboard/employees" },
            { key: "add-employee", label: "اضافة موظف", href: "/dashboard/employees/create" },
        ],
    },
    {
        key: "payroll",
        label: "الرواتب",
        icon: Banknote,
        type: "dropdown",
        children: [
            { key: "salary-list", label: "قائمة المرتبات", href: "/dashboard/payroll" },
            { key: "run-payroll", label: "تشغيل مسير الرواتب", href: "/dashboard/payroll/run" },
        ],
    },
    { key: "vendors", label: "الموردون", icon: Briefcase, type: "link", href: "/dashboard/suppliers" },
];

interface SidebarProps {
    companyName?: string;
    userName?: string;
    userEmail?: string;
    avatarSrc?: string;
}

export function Sidebar({
    companyName = "اسم الشركة",
    userName = "mohamed ali",
    userEmail = "Company@Force.com",
    avatarSrc = "/user.png",
}: SidebarProps) {
    const pathname = usePathname();

    // Auto-open the dropdown whose child matches the current path
    const initialOpen = NAV_ITEMS.find(
        (item) =>
            item.type === "dropdown" &&
            item.children.some((sub) => pathname === sub.href || pathname.startsWith(sub.href + "/"))
    )?.key ?? null;

    const [openDropdown, setOpenDropdown] = useState<string | null>(initialOpen);
    const [isExpanded, setIsExpanded] = useState(true);
    const sidebarRef = useRef<any>(null);

    // Tracks whether we were already below the breakpoint, so we only force
    // a collapse the moment we *cross into* mobile size — a manual toggle
    // afterwards (e.g. opening it on a tablet) won't get immediately undone
    // by another resize event while still under the breakpoint.
    const wasMobileRef = useRef(false);

    React.useEffect(() => {
        function handleResize() {
            const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

            if (isMobile && !wasMobileRef.current) {
                setIsExpanded(false);
            }

            wasMobileRef.current = isMobile;
        }

        // Run once on mount so initial load respects the current size too.
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useClickOutside(sidebarRef, () => {
        if (typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT) {
            setIsExpanded(false);
        }
    }, isExpanded);

    function toggleDropdown(key: string) {
        setOpenDropdown((prev) => (prev === key ? null : key));
    }

    return (
        <aside
            ref={sidebarRef}
            className={cn(
                "relative flex h-full flex-col overflow-hidden rounded-2xl text-white bg-[#695BE1] bg-[linear-gradient(180deg,_#25198A_0%,_rgba(37,25,138,0.35)_104.8%,_rgba(37,25,138,0)_169.64%)] transition-all duration-300 ease-in-out shrink-0",
                isExpanded ? "w-[283px]" : "w-[80px]"
            )}
        >
            {/* decorative background pattern */}
            <Image
                src="/menu-bg.png"
                alt=""
                fill
                priority
                className="pointer-events-none select-none object-cover opacity-20"
            />

            {/* content sits above the pattern */}
            <div className="relative z-10 flex h-full flex-col">
                {/* header / company switcher */}
                <div className="p-3">
                    <div className={cn("bg-[#0E1B6B99] flex items-center justify-between gap-3 h-[65px] px-3 rounded-xl", !isExpanded ? "justify-center" : "justify-between")} >
                        <div className={cn("flex items-center gap-2", !isExpanded && "hidden")}>
                            <span className="flex-1 text-center text-[17px] font-semibold">
                                {companyName}
                            </span>
                            <ChevronDown className="h-4 w-4" />
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="focus:outline-none hover:opacity-80 transition-opacity"
                        >
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                                <path d="M16.9173 4.08333V23.9167M25.6673 14C25.6673 9.625 25.6673 7.4375 24.5532 5.9045C24.1934 5.40936 23.758 4.97392 23.2628 4.61417C21.7298 3.5 19.5412 3.5 15.1673 3.5H12.834C8.45898 3.5 6.27148 3.5 4.73848 4.61417C4.24344 4.97357 3.808 5.40861 3.44815 5.90333C2.33398 7.4375 2.33398 9.62617 2.33398 14C2.33398 18.3738 2.33398 20.5625 3.44815 22.0955C3.80791 22.5906 4.24335 23.0261 4.73848 23.3858C6.27148 24.5 8.46015 24.5 12.834 24.5H15.1673C19.5423 24.5 21.7298 24.5 23.2628 23.3858C23.758 23.0261 24.1934 22.5906 24.5532 22.0955C25.6673 20.5625 25.6673 18.3738 25.6673 14Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                                <path d="M22.1673 8.16699H20.4173M22.1673 12.8337H20.4173M9.33398 11.667L10.7655 12.9002C11.3663 13.4193 11.6673 13.6783 11.6673 14.0003C11.6673 14.3223 11.3663 14.5813 10.7655 15.1005L9.33398 16.3337" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                    </div>
                </div>

                {/* nav */}
                <nav className="flex-1 overflow-y-auto px-3 py-5">
                    <ul className="space-y-1">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.key}>
                                {item.type === "link" ? (
                                    <Link
                                        href={item.href ?? "#"}
                                        type="Link"
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[15px] transition-colors",
                                            !isExpanded ? "justify-center" : "justify-start",
                                            "hover:bg-[#0E1B6B99]",
                                            item.href && (
                                                item.exact
                                                    ? pathname === item.href
                                                    : pathname === item.href || pathname.startsWith(item.href + "/")
                                            )
                                                ? "bg-[#0E1B6B99]"
                                                : ""
                                        )}
                                    >
                                        <item.icon className="h-5 w-5 shrink-0" />
                                        <span className={cn("flex-1 text-right", !isExpanded && "hidden")}>{item.label}</span>
                                    </Link>
                                ) : (
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => toggleDropdown(item.key)}
                                            className={cn(
                                                "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[15px] transition-colors hover:bg-[#0E1B6B99]",
                                                !isExpanded ? "justify-center" : "justify-start",
                                                item.type === "dropdown" &&
                                                    item.children.some(
                                                        (sub) => pathname === sub.href || pathname.startsWith(sub.href + "/")
                                                    )
                                                    ? "bg-[#0E1B6B99]"
                                                    : ""
                                            )}
                                        >
                                            <item.icon className="h-5 w-5 shrink-0" />
                                            <span className={cn("flex-1 text-right", !isExpanded && "hidden")}>{item.label}</span>
                                            <span className={cn(!isExpanded && "hidden")}>
                                                {openDropdown === item.key ? (
                                                    <ChevronUp className="h-4 w-4 shrink-0" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4 shrink-0" />
                                                )}
                                            </span>
                                        </button>

                                        {/* sub-links */}
                                        <div
                                            className={cn(
                                                "grid overflow-hidden relative transition-[grid-template-rows] duration-300 ease-in-out",
                                                openDropdown === item.key
                                                    ? "grid-rows-[1fr]"
                                                    : "grid-rows-[0fr]"
                                            )}
                                        >
                                            <div className={cn("absolute top-2 right-5", !isExpanded && "hidden")} >
                                                <svg width="11" height="62" viewBox="0 0 11 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10 4V9.5C10 15.0228 5.52285 19.5 0 19.5" stroke="white" strokeWidth="0.5" />
                                                    <path d="M10 0V51C10 56.5228 5.52285 61 0 61" stroke="white" strokeWidth="0.5" />
                                                </svg>
                                            </div>

                                            <div className="min-h-0">
                                                <ul className="relative mr-6 mt-1 space-y-1 pr-4">
                                                    {item.children.map((sub) => (
                                                        <li key={sub.key}>
                                                            <Link
                                                                type="Link"
                                                                href={sub.href}
                                                                className={cn(
                                                                    "block w-full rounded-lg px-3 py-2.5 text-right text-[14px] transition-colors",
                                                                    "hover:bg-[#0E1B6B99]",
                                                                    pathname === sub.href
                                                                        ? "bg-[#0E1B6B99]"
                                                                        : "",
                                                                    !isExpanded && "hidden"
                                                                )}
                                                            >
                                                                {sub.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* footer / current user */}
                <div className={cn("flex items-center gap-3 px-5 py-4 border-t border-white/10", !isExpanded ? "justify-center" : "justify-start")}>
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        <Image src={avatarSrc} alt={userName} fill className="object-cover" />
                    </div>
                    <div className={cn("min-w-0 text-right", !isExpanded && "hidden")}>
                        <p className="truncate text-[16px] font-medium">{userName}</p>
                        <p className="truncate text-[16px] font-medium opacity-80">{userEmail}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;