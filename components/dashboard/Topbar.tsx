"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, ChevronDown, ChevronLeft, Search, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import SearchInput from "./SearchInput";
import { TopbarHomeIcon, TopbarNotificationIcon } from "@/icons";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/auth-store";

interface LanguageOption {
    code: string;
    label: string;
    flag: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
    { code: "sa", label: "العربية (السعودية)", flag: "/ksa.png" },
    { code: "eg", label: "العربية (مصر)", flag: "/egypt.png" },
];

interface TopbarProps {
    title: string;
    avatarSrc?: string;
    searchPlaceholder?: string;
    onSearch?: (value: string) => void;
    hasNotification?: boolean;
    className?: string;
    path?: string;
    search?: boolean
    middleNestedLink?: string,
    middleNestedLinkPath?: string,
    nestedLink?: string,
    nestedLinkPath?: string,
    /** Language code to select initially. Defaults to the first option (Saudi Arabia). */
    defaultLanguage?: string;
    /** Called with the selected language's code whenever the user picks one. */
    onLanguageChange?: (code: string) => void;
}

export function Topbar({
    title,
    avatarSrc = "/user.png",
    searchPlaceholder = "بحث",
    onSearch,
    hasNotification = true,
    className,
    path,
    search,
    nestedLink,
    nestedLinkPath,
    middleNestedLink,
    middleNestedLinkPath,
    defaultLanguage = LANGUAGE_OPTIONS[0].code,
    onLanguageChange,
}: TopbarProps) {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);

    const userName = user?.businessName || user?.businessName || "المستخدم";
    const userEmail = user?.email || "user@example.com";

    const [language, setLanguage] = useState<LanguageOption>(
        LANGUAGE_OPTIONS.find((option) => option.code === defaultLanguage) ??
            LANGUAGE_OPTIONS[0]
    );

    function handleLanguageSelect(option: LanguageOption) {
        setLanguage(option);
        onLanguageChange?.(option.code);
    }

    function handleLogout() {
        logout();
        router.push("/login");
    }

    return (
        <header
            className={cn(
                "flex items-center justify-center  md:justify-between gap-4 rounded-2xl  ctm-shadow bg-white px-5 py-3",
                className
            )}
        >
            {!path && (
                <div className="flex items-center gap-3" >
                    <h1 className="shrink-0 hidden md:block text-[16px] md:text-[24px] font-semibold text-[#0F1219]">{title}</h1>
                </div>
            )}

            {path && (
                <div className="hidden md:flex items-center md:gap-3 " >
                    <div className="flex items-center gap-1" >
                         <TopbarHomeIcon />
                         <Link href={'/dashboard'} className="text-[#B1B2B4] text-[12px] md:text-[18px]"> الرئيسية  </Link>
                    </div>

                  
                    <Link href={''} className="text-[#B1B2B4] text-[12px] md:text-[18px] flex items-center gap-1"> <ChevronLeft className="text-[#B1B2B4]" /> {path} </Link>
                    {middleNestedLink && (
                        <Link href={middleNestedLinkPath ?? '/dashboard'} className="text-[#B1B2B4] text-[12px] md:text-[18px] flex items-center gap-1"> <ChevronLeft className="text-[#B1B2B4]" /> {middleNestedLink} </Link>
                    )}
                    {nestedLink && (
                        <Link href={nestedLinkPath ?? '/dashboard'} className="text-[#0F1219] text-[12px] md:text-[18px] flex items-center gap-1"> <ChevronLeft className="text-[#0F1219]" /> {nestedLink} </Link>
                    )}
                </div>
            )}

            <div className="flex items-center gap-3">
                {search && (
                    <div className="relative hidden md:block ">
                        <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder={searchPlaceholder}
                            onChange={(event) => onSearch?.(event.target.value)}
                            className="h-10 w-[300px] rounded-xl border-border bg-muted/40 pr-9 text-right"
                        />
                    </div>

                )}

                {/* Language */}
                <DropdownMenu>
                    <DropdownMenuTrigger
                        aria-label="اللغة / الدولة"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border sm:h-10 sm:w-10"
                    >
                        <Image
                            src={language.flag}
                            alt={language.label}
                            width={25}
                            height={20}
                            className="h-auto w-5 sm:w-[25px]"
                        />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48">
                        {LANGUAGE_OPTIONS.map((option) => (
                            <DropdownMenuItem
                                key={option.code}
                                onSelect={() => handleLanguageSelect(option)}
                                className="flex items-center gap-2"
                            >
                                <Image
                                    src={option.flag}
                                    alt={option.label}
                                    width={20}
                                    height={16}
                                    className="h-auto w-5 rounded-sm border border-border"
                                />
                                <span className="text-[14px] text-[#0F1219]">
                                    {option.label}
                                </span>
                                {option.code === language.code && (
                                    <Check className="mr-auto h-4 w-4 text-[#463BAF]" />
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Notifications */}
                <Link
                    href={'/dashboard/notifications'}
                    aria-label="الإشعارات"
                    className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground sm:h-10 sm:w-10"
                >
                   <TopbarNotificationIcon />

                    {hasNotification && (
                        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white sm:right-2.5 sm:top-2.5" />
                    )}
                </Link>

                {/* User */}
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="flex shrink-0 items-center gap-1 sm:gap-1.5 outline-none"
                        aria-label="حساب المستخدم"
                    >
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />

                        <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                            <AvatarImage src={avatarSrc} alt={userName} />
                            <AvatarFallback>{userName.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="font-normal flex flex-col gap-1.5 p-2">
                                <p className="text-sm font-medium leading-none text-[#0F1219]">{userName}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {userEmail}
                                </p>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer flex items-center gap-2 p-2"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="font-medium">تسجيل الخروج</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>


            </div>
        </header>
    );
}