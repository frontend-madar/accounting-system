"use client";

import * as React from "react";
import { useState } from "react";
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
};

type NavDropdown = {
    key: string;
    label: string;
    icon: React.ElementType;
    type: "dropdown";
    children: SubLink[];
};

type NavItem = NavLink | NavDropdown;


const NAV_ITEMS: NavItem[] = [
    { key: "dashboard", label: "لوحة التحكم", icon: LayoutGrid, type: "link", href: "/dashboard" },
    { key: "credit-accounts", label: "الحسابات الآجلة", icon: CircleDollarSign, type: "link", href: "/dashboard/credit-accounts" },
    { key: "daily-entries", label: "القيود اليومية", icon: NotebookPen, type: "link", href: "/dashboard/daily-entries" },
    { key: "invoices", label: "الفواتير", icon: FileText, type: "link", href: "/dashboard/invoices" },
    {
        key: "expenses",
        label: "المصروفات",
        icon: Wallet,
        type: "dropdown",
        children: [
            { key: "manage-expenses", label: "إدارة المصروفات", href: "/expenses/manage" },
            { key: "add-expense", label: "اضافة مصروفات", href: "/expenses/add" },
        ],
    },
    {
        key: "employees",
        label: "الموظفين",
        icon: Users2,
        type: "dropdown",
        children: [
            { key: "manage-employees", label: "ادارة الموظفين", href: "/employees/manage" },
            { key: "add-employee", label: "اضافة موظف", href: "/employees/add" },
        ],
    },
    {
        key: "payroll",
        label: "الرواتب",
        icon: Banknote,
        type: "dropdown",
        children: [
            { key: "run-payroll", label: "تشغيل مسير الرواتب", href: "/payroll/run" },
            { key: "salary-list", label: "قائمة المرتبات", href: "/payroll/list" },
        ],
    },
    { key: "vendors", label: "الموردون", icon: Briefcase, type: "link" },
];

// Colors pulled straight from the spec — kept as constants so both the
// active-state background and the outer panel gradient stay in one place.
const ACTIVE_BG = "#0E1B6B99";

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
    // which dropdown is expanded — only one open at a time, matching the design
    const [openDropdown, setOpenDropdown] = useState<string | null>("employees");
    // which leaf item is currently selected/highlighted
    const [activeKey, setActiveKey] = useState<string>("add-employee");

    function toggleDropdown(key: string) {
        setOpenDropdown((prev) => (prev === key ? null : key));
    }

    return (
        <aside
            className="relative flex h-full w-[283px] flex-col overflow-hidden rounded-2xl text-white bg-[#695BE1] bg-[linear-gradient(180deg,_#25198A_0%,_rgba(37,25,138,0.35)_104.8%,_rgba(37,25,138,0)_169.64%)]"
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
                    <div className="bg-[#0E1B6B99] flex items-center justify-between  gap-3 h-[65px] px-3 rounded-xl" >
                        <div className="flex items-center gap-2">
                            <span className="flex-1 text-center text-[17px] font-semibold">
                                {companyName}
                            </span>
                            <ChevronDown className="h-4 w-4  " />
                        </div>

                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.9173 4.08333V23.9167M25.6673 14C25.6673 9.625 25.6673 7.4375 24.5532 5.9045C24.1934 5.40936 23.758 4.97392 23.2628 4.61417C21.7298 3.5 19.5412 3.5 15.1673 3.5H12.834C8.45898 3.5 6.27148 3.5 4.73848 4.61417C4.24344 4.97357 3.808 5.40861 3.44815 5.90333C2.33398 7.4375 2.33398 9.62617 2.33398 14C2.33398 18.3738 2.33398 20.5625 3.44815 22.0955C3.80791 22.5906 4.24335 23.0261 4.73848 23.3858C6.27148 24.5 8.46015 24.5 12.834 24.5H15.1673C19.5423 24.5 21.7298 24.5 23.2628 23.3858C23.758 23.0261 24.1934 22.5906 24.5532 22.0955C25.6673 20.5625 25.6673 18.3738 25.6673 14Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                            <path d="M22.1673 8.16699H20.4173M22.1673 12.8337H20.4173M9.33398 11.667L10.7655 12.9002C11.3663 13.4193 11.6673 13.6783 11.6673 14.0003C11.6673 14.3223 11.3663 14.5813 10.7655 15.1005L9.33398 16.3337" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

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
                                        onClick={() => setActiveKey(item.key)}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[15px] transition-colors",
                                            "hover:bg-[#0E1B6B99]",
                                            activeKey === item.key ? "bg-[#0E1B6B99]" : ""
                                        )}
                                       
                                    >
                                        <item.icon className="h-5 w-5 shrink-0" />
                                        <span className="flex-1 text-right">{item.label}</span>
                                    </Link>
                                ) : (
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                toggleDropdown(item.key)
                                                setActiveKey(item.key)
                                            }}
                                             
                                            className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[15px]   transition-colors hover:bg-[#0E1B6B99]",
                                                 activeKey === item.key ? "bg-[#0E1B6B99]" : ""
                                            )}
                                        >

                                            <item.icon className="h-5 w-5 shrink-0" />
                                            <span className="flex-1 text-right">{item.label}</span>
                                            {openDropdown === item.key ? (
                                                <ChevronUp className="h-4 w-4 shrink-0 " />
                                            ) : (
                                                <ChevronDown className="h-4 w-4 shrink-0 " />
                                            )}
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
 
                                            <div className="absolute top-2 right-5" >
                                                <svg width="11" height="62" viewBox="0 0 11 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10 4V9.5C10 15.0228 5.52285 19.5 0 19.5" stroke="white" strokeWidth="0.5" />
                                                    <path d="M10 0V51C10 56.5228 5.52285 61 0 61" stroke="white" strokeWidth="0.5" />
                                                </svg>
                                            </div>

                                            <div className="min-h-0">
                                                <ul className="relative mr-6 mt-1 space-y-1 pr-4">
                                                    {item.children.map((sub) => (
                                                        <li key={sub.key}>
                                                            <button
                                                                type="button"
                                                                onClick={() => setActiveKey(sub.key)}
                                                                className={cn(
                                                                    "block w-full rounded-lg px-3 py-2.5 text-right text-[14px] transition-colors",
                                                                    "hover:bg-[#0E1B6B99]",
                                                                     activeKey === sub.key ? "bg-[#0E1B6B99]" : ""

                                                                )}
                                                                 
                                                            >
                                                                {sub.label}
                                                            </button>
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
                <div className="flex items-center gap-3    px-5 py-4">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        <Image src={avatarSrc} alt={userName} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 text-right">
                        <p className="truncate text-[16px] font-medium">{userName}</p>
                        <p className="truncate text-[16px] font-medium ">{userEmail}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;