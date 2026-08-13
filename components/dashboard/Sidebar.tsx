"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
    ChevronDown,
    ChevronUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useClickOutside } from "@/hooks/UseClickOutside";
import { DailyLimitsIcon, DashboardIcon, DropLineIcon, DropLineTwoIcon, EmployeesIcon, ExpemsessIcon, ForwardAccountsIcon, InvitePersonIcon, IvoicesIcons, LogoutIcon, SalariesIcon, SuppliersIcon, ToggelSidebar } from "@/icons";
import { InviteFrom } from "../auth/InviteFrom";
import { useUiStore } from "@/store/ui-store";
import { useProfileStore } from "@/store/profile.store";

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
    { key: "dashboard", label: "لوحة التحكم", icon: DashboardIcon, type: "link", href: "/dashboard", exact: true },
    { key: "credit-accounts", label: "الحسابات الآجلة", icon: ForwardAccountsIcon, type: "link", href: "/dashboard/credit-accounts" },
    { key: "daily-entries", label: "القيود اليومية", icon: DailyLimitsIcon, type: "link", href: "/dashboard/daily-entries" },
    { key: "invoices", label: "الفواتير", icon: IvoicesIcons, type: "link", href: "/dashboard/invoices" },
    {
        key: "expenses",
        label: "المصروفات",
        icon: ExpemsessIcon,
        type: "dropdown",
        children: [
            { key: "manage-expenses", label: "اضافة مصروفات", href: "/dashboard/expenses/add-expense" },
            { key: "add-expense", label: "  مصروفات", href: "/dashboard/expenses" },
        ],
    },
    {
        key: "employees",
        label: "الموظفين",
        icon: EmployeesIcon,
        type: "dropdown",
        children: [
            { key: "manage-employees", label: "ادارة الموظفين", href: "/dashboard/employees" },
            { key: "add-employee", label: "اضافة موظف", href: "/dashboard/employees/create" },
            { key: "reports", label: "التقارير", href: "/dashboard/employees/reports" },
        ],
    },
    {
        key: "payroll",
        label: "الرواتب",
        icon: SalariesIcon,
        type: "dropdown",
        children: [
            { key: "salary-list", label: "قائمة المرتبات", href: "/dashboard/payroll" },
            { key: "run-payroll", label: "تشغيل مسير الرواتب", href: "/dashboard/payroll/run" },
        ],
    },
    { key: "vendors", label: "الموردون", icon: SuppliersIcon, type: "link", href: "/dashboard/suppliers" },
];

interface SidebarProps {
    companyName?: string;
    userName?: string;
    userEmail?: string;
    avatarSrc?: string;
}

// Shared transition classes for any label/text block that should fade + shrink
// smoothly in sync with the sidebar's own width transition (duration-300),
// instead of snapping via `hidden` (display:none can't be animated).
const collapsibleLabel = (visible: boolean, extra?: string) =>
    cn(
        "overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
        visible ? "opacity-100 max-w-[220px]" : "opacity-0 max-w-0",
        extra
    );

// Gap between icon and label must collapse to 0 alongside the label itself —
// otherwise a collapsed (zero-width) label still leaves its `gap-*` behind,
// nudging the icon off-center in the collapsed rail.
const collapsibleGap = (visible: boolean) => (visible ? "gap-3" : "gap-0");

/** Small floating label shown on hover when the sidebar is collapsed, so the
 * item's meaning isn't lost just because the text is hidden. Only rendered
 * (not just hidden) when collapsed, to avoid needless DOM/listeners while expanded. */
function CollapsedTooltip({ label }: { label: string }) {
    return (
        <span
            className="pointer-events-none absolute right-full top-1/2 z-50 mr-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#1B1464] px-2.5 py-1.5 text-[13px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
        >
            {label}
        </span>
    );
}

export function Sidebar({
    companyName = "اسم الشركة",
    userName = "mohamed ali",
    userEmail = "Company@Force.com",
    avatarSrc = "/user.png",
}: SidebarProps) {
    const pathname = usePathname();
    const profile = useProfileStore((s) => s.profile);

    const displayUserName = profile?.name || userName;
    const displayUserEmail = profile?.email || userEmail;
    const displayAvatarSrc = profile?.avatar || avatarSrc;

    // Auto-open the dropdown whose child matches the current path
    const initialOpen = NAV_ITEMS.find(
        (item) =>
            item.type === "dropdown" &&
            item.children.some((sub) => pathname === sub.href || pathname.startsWith(sub.href + "/"))
    )?.key ?? null;

    const [openDropdown, setOpenDropdown] = useState<string | null>(initialOpen);
    const [isExpanded, setIsExpanded] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isMobileScreen, setIsMobileScreen] = useState(false);
    const sidebarRef = useRef<any>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const { isMobileSidebarOpen, setMobileSidebarOpen } = useUiStore();

    // On mobile, content visibility follows the mobile drawer's open state
    // (isExpanded is a desktop-only collapse toggle and gets forced to
    // false the moment we cross into mobile width — see the resize
    // handler below — so it can't be used to decide text visibility here).
    const showContent = isMobileScreen ? isMobileSidebarOpen : isExpanded;

    // Tracks whether we were already below the breakpoint, so we only force
    // a collapse the moment we *cross into* mobile size — a manual toggle
    // afterwards (e.g. opening it on a tablet) won't get immediately undone
    // by another resize event while still under the breakpoint.
    const wasMobileRef = useRef(false);

    React.useEffect(() => {
        function handleResize() {
            const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
            setIsMobileScreen(isMobile);

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
            setMobileSidebarOpen(false);
        }
    }, isMobileSidebarOpen);

    const [showInvite, setShowInvite] = useState(false);


    useEffect(() => {
        if (!showUserMenu) return;
        function handleOutsideClick(e: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setShowUserMenu(false);
            }
        }
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [showUserMenu]);

    function toggleDropdown(key: string) {
        setOpenDropdown((prev) => (prev === key ? null : key));
    }

    // When the rail is collapsed, a dropdown parent has nowhere to show its
    // children (they only render while showContent is true) — so clicking
    // one first expands the sidebar, then opens that dropdown, instead of
    // silently doing nothing.
    function handleDropdownClick(key: string) {
        if (!showContent) {
            if (isMobileScreen) {
                setMobileSidebarOpen(true);
            } else {
                setIsExpanded(true);
            }
            setOpenDropdown(key);
            return;
        }
        toggleDropdown(key);
    }

    // Closes the mobile drawer after an actual navigation (link click) —
    // desktop expand/collapse state is untouched. Dropdown toggle buttons
    // don't call this since they don't navigate anywhere.
    function handleNavigate() {
        if (isMobileScreen) {
            setMobileSidebarOpen(false);
        }
    }

    return (
        <>
            {/* Backdrop overlay for mobile screen */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden",
                    isMobileScreen && isMobileSidebarOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                )}
                onClick={() => setMobileSidebarOpen(false)}
            />

            <aside
                ref={sidebarRef}
                className={cn(
                    "flex flex-col rounded-2xl text-white bg-[#695BE1] bg-[linear-gradient(180deg,_#25198A_0%,_rgba(37,25,138,0.35)_104.8%,_rgba(37,25,138,0)_169.64%)] transition-all duration-300 ease-in-out shrink-0 z-50 lg:z-1",
                    "fixed top-4 bottom-4 right-4 lg:relative lg:top-0 lg:bottom-0 lg:right-0 lg:h-full",
                    isMobileScreen
                        ? (isMobileSidebarOpen ? "translate-x-0 w-[283px]" : "translate-x-[120%]")
                        : (isExpanded ? "translate-x-0 w-[283px]" : "translate-x-0 w-[80px]")
                )}
            >
                {/* decorative background pattern */}
                <Image
                    src="/menu-bg.png"
                    alt=""
                    fill
                    priority
                    sizes="283px"
                    className="pointer-events-none select-none object-cover rounded-2xl opacity-20"
                />

                {/* content sits above the pattern */}
                <div className="relative z-10 flex h-full flex-col">
                    {/* header / company switcher */}
                    <div className="p-3">
                        <div
                            className={cn(
                                "bg-[#0E1B6B99] flex items-center h-[65px] px-3 rounded-xl transition-all duration-300 ease-in-out",
                                collapsibleGap(showContent),
                                !showContent ? "justify-center" : "justify-between"
                            )}
                        >
                            <div className={collapsibleLabel(showContent, "flex items-center gap-2")}>
                                <span className="flex-1 text-center text-[17px] font-semibold">
                                    {companyName}
                                </span>
                                <ChevronDown className="h-4 w-4 shrink-0" />
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    if (isMobileScreen) {
                                        setMobileSidebarOpen(!isMobileSidebarOpen);
                                    } else {
                                        setIsExpanded(!isExpanded);
                                    }
                                }}
                                className="focus:outline-none hover:opacity-80 transition-opacity shrink-0"
                            >
                                <ToggelSidebar />
                            </button>

                        </div>
                    </div>

                    {/* nav */}
                    <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
                        <ul className="space-y-1">
                            {NAV_ITEMS.map((item) => (
                                <li key={item.key}>
                                    {item.type === "link" ? (
                                        <Link
                                            href={item.href ?? "#"}
                                            type="Link"
                                            onClick={handleNavigate}
                                            className={cn(
                                                "group relative flex w-full items-center rounded-lg px-3 py-3 text-[15px] transition-all duration-300 ease-in-out",
                                                collapsibleGap(showContent),
                                                !showContent ? "justify-center" : "justify-start",
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
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center [&>svg]:h-5 [&>svg]:w-5">
                                                <item.icon className="h-5 w-5" />
                                            </span>
                                            <span className={collapsibleLabel(showContent, "flex-1 text-right")}>{item.label}</span>
                                            {!showContent && !isMobileScreen && <CollapsedTooltip label={item.label} />}
                                        </Link>
                                    ) : (
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => handleDropdownClick(item.key)}
                                                className={cn(
                                                    "group relative flex w-full items-center rounded-lg px-3 py-3 text-[15px] transition-all duration-300 ease-in-out hover:bg-[#0E1B6B99]",
                                                    collapsibleGap(showContent),
                                                    !showContent ? "justify-center" : "justify-start",
                                                    item.type === "dropdown" &&
                                                        item.children.some(
                                                            (sub) => pathname === sub.href || pathname.startsWith(sub.href + "/")
                                                        )
                                                        ? "bg-[#0E1B6B99]"
                                                        : ""
                                                )}
                                            >
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center [&>svg]:h-5 [&>svg]:w-5">
                                                    <item.icon className="h-5 w-5" />
                                                </span>
                                                <span className={collapsibleLabel(showContent, "flex-1 text-right")}>{item.label}</span>
                                                <span className={collapsibleLabel(showContent, "shrink-0")}>
                                                    {openDropdown === item.key ? (
                                                        <ChevronUp className="h-4 w-4 shrink-0" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 shrink-0" />
                                                    )}
                                                </span>
                                                {!showContent && !isMobileScreen && <CollapsedTooltip label={item.label} />}
                                            </button>

                                            {/* sub-links */}
                                            <div
                                                className={cn(
                                                    "grid overflow-hidden relative transition-[grid-template-rows] duration-300 ease-in-out",
                                                    openDropdown === item.key && showContent
                                                        ? "grid-rows-[1fr]"
                                                        : "grid-rows-[0fr]"
                                                )}
                                            >
                                                <div className={cn("absolute top-2 right-5 transition-opacity duration-300 ease-in-out", !showContent ? "opacity-0" : "opacity-100")} >
                                                    {item.children.length === 2 ? <DropLineTwoIcon /> : <DropLineIcon />}
                                                </div>

                                                <div className="min-h-0">
                                                    <ul className="relative mr-6 mt-1 space-y-1 pr-4">
                                                        {item.children.map((sub) => (
                                                            <li key={sub.key}>
                                                                <Link
                                                                    type="Link"
                                                                    href={sub.href}
                                                                    onClick={handleNavigate}
                                                                    className={cn(
                                                                        "block w-full rounded-lg px-3 py-2.5 text-right text-[14px] transition-all duration-300 ease-in-out",
                                                                        "hover:bg-[#0E1B6B99]",
                                                                        pathname === sub.href
                                                                            ? "bg-[#0E1B6B99]"
                                                                            : "",
                                                                        !showContent ? "opacity-0 pointer-events-none" : "opacity-100"
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
                    <div ref={userMenuRef} className="relative">
                        {/* Popup */}
                        <div
                            className={cn(
                                "absolute bottom-full mb-2 left-2 w-[260px] p-4 shadow-[0px_1px_10px_0px_#00000040] bg-white rounded-xl z-50 transition-all duration-200 ease-out",
                                showUserMenu
                                    ? "opacity-100 translate-y-0 pointer-events-auto"
                                    : "opacity-0 translate-y-2 pointer-events-none"
                            )}
                        >
                            <div onClick={() => setShowInvite(true)} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                <InvitePersonIcon />
                                <p className="text-[18px] font-medium text-[#1E2128]">دعوة اشخاص</p>
                            </div>
                            <div className="my-2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                            <Link
                                href="/"
                                className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors group"
                                onClick={() => {
                                    setShowUserMenu(false);
                                    handleNavigate();
                                }}
                            >
                                <LogoutIcon />
                                <p className="text-[18px] font-medium text-[#B01212] group-hover:text-red-700 transition-colors">
                                    تسجيل خروج
                                </p>
                            </Link>
                        </div>

                        {/* Trigger */}
                        <div
                            onClick={() => setShowUserMenu((v) => !v)}
                            className={cn(
                                "group relative flex items-center px-5 py-4 border-t border-white/10 cursor-pointer hover:bg-white/5 transition-colors",
                                collapsibleGap(showContent),
                                !showContent ? "justify-center" : "justify-start"
                            )}
                        >
                            <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden">
                                <Image src={displayAvatarSrc} alt={displayUserName} fill sizes="40px" className="object-cover" />
                            </div>
                            <div className={collapsibleLabel(showContent, "min-w-0 text-right")}>
                                <p className="truncate text-[16px] font-medium">{displayUserName}</p>
                                <p className="truncate text-[16px] font-medium opacity-80">{displayUserEmail}</p>
                            </div>
                            {!showContent && !isMobileScreen && <CollapsedTooltip label={displayUserName} />}
                        </div>
                    </div>

                    {showInvite && <InviteFrom onClose={() => setShowInvite(false)} />}

                </div>
            </aside>
        </>
    );
}

export default Sidebar;