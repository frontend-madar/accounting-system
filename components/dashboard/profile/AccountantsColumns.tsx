"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AccountantData } from "@/types/accountant.types";

interface GetAccountantColumnsProps {
    onDelete: (accountant: AccountantData) => void;
}

const AVATAR_COLORS: Record<string, string> = {
    M: "bg-[#D9F2E6] text-[#1F9D63]",
    H: "bg-[#DCE9FB] text-[#2E6FD9]",
    S: "bg-[#FBEFC7] text-[#C69A1C]",
};

function AccountantAvatar({ name }: { name: string }) {
    const initial = name.trim().charAt(0).toUpperCase();
    const colorClass = AVATAR_COLORS[initial] ?? "bg-[#EDEBF7] text-[#5B4FE0]";

    return (
        <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold ${colorClass}`}
        >
            {initial}
        </div>
    );
}

export function getAccountantColumns({
    onDelete,
}: GetAccountantColumnsProps): ColumnDef<AccountantData>[] {
    return [
        {
            accessorKey: "name",
            header: "المحاسب",
            cell: ({ row }) => {
                const accountant = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[15px] font-semibold text-[#232323]">
                                {accountant.name}
                            </p>
                            <p className="text-[13px] text-muted-foreground">
                                {accountant.email}
                            </p>
                        </div>
                        <AccountantAvatar name={accountant.name} />
                    </div>
                );
            },
        },
        {
            accessorKey: "role",
            header: "الصلاحية",
            cell: ({ row }) => (
                <Badge
                    variant="outline"
                    className="rounded-full border-none bg-[#EDEBF7] px-3 py-1 text-[13px] font-medium text-[#5B4FE0] hover:bg-[#EDEBF7]"
                >
                    {row.original.role}
                </Badge>
            ),
        },
        {
            accessorKey: "status",
            header: "الحالة",
            cell: ({ row }) => {
                const isActive = row.original.status === "active";
                return (
                    <Badge
                        variant="outline"
                        className={`gap-1.5 rounded-full border-none px-3 py-1 text-[13px] font-medium ${
                            isActive
                                ? "bg-[#E4F8EC] text-[#1F9D63] hover:bg-[#E4F8EC]"
                                : "bg-[#FBEAEA] text-[#D14343] hover:bg-[#FBEAEA]"
                        }`}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${
                                isActive ? "bg-[#1F9D63]" : "bg-[#D14343]"
                            }`}
                        />
                        {isActive ? "نشط" : "غير نشط"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "joinDate",
            header: "تاريخ الانضمام",
            cell: ({ row }) => (
                <span className="text-[14px] text-[#5B5B5B]">
                    {row.original.joinDate}
                </span>
            ),
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => {
                const accountant = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E4E4E7] text-[#232323] hover:bg-[#F5F6F7]"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                                onClick={() => onDelete(accountant)}
                                className="cursor-pointer gap-2 text-[#D14343] focus:text-[#D14343]"
                            >
                                <Trash2 className="h-4 w-4" />
                                حذف المحاسب
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}