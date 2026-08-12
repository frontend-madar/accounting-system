"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Link2, Plus } from "lucide-react";

import { DataTable } from "../DataTable";
import { AccountantsStats } from "./AccountantsStats";
import { getAccountantColumns } from "./AccountantsColumns";
import MainButton from "../shared/MainButton";
import { ConfirmDeleteDialog } from "../shared/ConfirmDeleteDialog";
import { InviteFrom } from "@/components/auth/InviteFrom";
import { useAccounts, useDeleteAccount } from "@/hooks/use-profile";
import { AccountantData } from "@/types/accountant.types";


const AccountantsManagement = () => {
    const { data: accountsRes, isLoading } = useAccounts();
    const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

    const [accountantToDelete, setAccountantToDelete] = useState<AccountantData | null>(null);
    const [showInvite, setShowInvite] = useState(false);

    const accountants = accountsRes?.data ?? [];
    const totalAccountants = accountsRes?.totalAccountants ?? 0;
    const pendingInvitations = accountsRes?.pendingInvitations ?? 0;

    function confirmDelete() {
        if (!accountantToDelete) return;
        deleteAccount(accountantToDelete.id, {
            onSuccess: () => setAccountantToDelete(null),
        });
    }

    function handleCopyInviteLink() {
        // TODO: replace with the real invite link
        navigator.clipboard.writeText(`${window.location.origin}/invite/general-link`);
    }

    const columns = useMemo(
        () =>
            getAccountantColumns({
                onDelete: (accountant) => setAccountantToDelete(accountant),
            }),
        []
    );

    return (
        <div className="rounded-2xl ctm-shadow bg-white p-4 md:p-6 mt-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="order-2 text-right sm:order-1">
                    <h2 className="text-[20px] font-semibold text-[#232323]">إدارة المحاسبين</h2>
                    <p className="mt-1 text-[14px] text-muted-foreground">
                        أضف المحاسبين وتحكم في صلاحياتهم وصولهم
                    </p>
                </div>

                <MainButton
                    text="اضافة محاسب"
                    icon={<Plus className="h-4 w-4" />}
                    className="order-1 !w-full sm:order-2 sm:!w-auto"
                    onClick={() => setShowInvite(true)}
                />
            </div>

            <AccountantsStats pendingInvites={pendingInvitations} totalAccountants={totalAccountants} />

            <div className="mt-4 overflow-x-auto rounded-2xl border border-[#EEEEF0]">
                <DataTable columns={columns} data={accountants} isLoading={isLoading} />
            </div>

            <ConfirmDeleteDialog
                open={!!accountantToDelete}
                onOpenChange={(open) => !open && setAccountantToDelete(null)}
                isLoading={isDeleting}
                title="تأكيد الحذف"
                description={`هل أنت متأكد من حذف المحاسب ${accountantToDelete?.name}؟ لا يمكن التراجع عن هذا الإجراء.`}
                onConfirm={confirmDelete}
            />

            {showInvite && <InviteFrom onClose={() => setShowInvite(false)} />}
        </div>
    );
};

export default AccountantsManagement;