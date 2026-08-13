"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, ChevronLeft, Search, LogOut, Menu, Home, Loader2 } from "lucide-react";

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
import { useLogout } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { TopbarNotificationIcon } from "@/icons";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";
import { useUnreadNotificationsCount } from "@/hooks/use-notification";
import { useGetProfile } from "@/hooks/use-profile";
import { useProfileStore } from "@/store/profile.store";
import { Button } from "../ui/button";

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
    title?: string;
    avatarSrc?: string;
    searchPlaceholder?: string;
    onSearch?: (value: string) => void;
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
    isNested?: boolean
}

export function Topbar({
    title,
    avatarSrc = "/user.png",
    onSearch,
    className,
    path,
    defaultLanguage = LANGUAGE_OPTIONS[0].code,
    onLanguageChange,
    isNested
}: TopbarProps) {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const { data: profileResponse } = useGetProfile();
    const profile = useProfileStore((s) => s.profile) || profileResponse?.data;

    const { mutate: logout, isPending: isLoggingOut } = useLogout();
    const toggleMobileSidebar = useUiStore((s) => s.toggleMobileSidebar);


    const { data: unreadRes } = useUnreadNotificationsCount();
    const unreadCount = unreadRes?.data?.count ?? 0;

    const userName = profile?.name || user?.businessName || "المستخدم";
    const userEmail = profile?.email || user?.email || "user@example.com";
    const userAvatar = profile?.avatar || avatarSrc || "/user.png";

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
    }

    return (
        <header
            className={cn(
                "flex items-center justify-center  md:justify-between gap-4 rounded-2xl  ctm-shadow bg-white px-5 py-3",
                className
            )}
        >

            {title && (<h1 className="shrink-0 hidden md:block text-[16px] md:text-[20px] font-semibold text-[#0F1219]">{title}</h1>)}

            {isNested && (
                <div className="md:flex items-center  hidden  " >

                    <Link href={'/dashboard'} className="hidden md:flex items-center gap-1 text-[#B1B2B4] transition duration-300 cursor-pointer hover:text-[#463BAF]" >
                        <Home />
                        <div className=" text-[12px] md:text-[18px]"> الرئيسية  </div>
                    </Link>

                    {path && (<div>

                        <div className="text-[#463BAF] text-[12px] md:text-[18px] flex items-center gap-1"> <ChevronLeft /> {path} </div>
                    </div>)}

                </div>
            )}

            <div className="flex items-center gap-3">



                <Button
                    type="button"
                    onClick={toggleMobileSidebar}
                    className="lg:hidden p-2 rounded-lg bg-transparent hover:bg-gray-100 transition-colors  flex h-9 w-9 items-center justify-center rounded-full border border-border"
                >
                    <Menu className="rounded-full text-[#0F1219]" />
                </Button>

                {/* Language */}
                {/* <DropdownMenu>
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
                </DropdownMenu> */}

                {/* Notifications */}
                <Link
                    href={'/dashboard/notifications'}
                    aria-label="الإشعارات"
                    className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground sm:h-10 sm:w-10"
                >
                    <TopbarNotificationIcon />

                    {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-red-700 px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-white sm:-right-1.5 sm:-top-1.5">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
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
                            <AvatarImage src={userAvatar} alt={userName} />
                            <AvatarFallback>{userName.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel onClick={() => {
                                router.push('/dashboard/profile')
                            }} className="font-normal flex flex-col gap-1.5 p-2 cursor-pointer">
                                <p className="text-sm font-medium leading-none text-[#0F1219]">{userName}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {userEmail}
                                </p>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.preventDefault(); // keep menu mounted until the mutation finishes
                                handleLogout();
                            }}
                            disabled={isLoggingOut}
                            className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer flex items-center gap-2 p-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoggingOut ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <LogOut className="h-4 w-4" />
                            )}
                            <span className="font-medium">
                                {isLoggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}