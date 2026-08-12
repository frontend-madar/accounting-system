import { Clock, Users } from "lucide-react";

interface AccountantsStatsProps {
    pendingInvites: number;
    totalAccountants: number;
}

export function AccountantsStats({
    pendingInvites,
    totalAccountants,
}: AccountantsStatsProps) {
    return (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-2xl border border-[#EEEEF0] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDEBF7]">
                    <Users className="h-5 w-5 text-[#5B4FE0]" />
                </div>
                <div className="text-right">
                    <p className="text-[14px] text-muted-foreground">إجمالي المحاسبين</p>
                    <p className="text-[22px] font-semibold text-[#232323]">{totalAccountants}</p>
                </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-[#EEEEF0] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FDF3E3]">
                    <Clock className="h-5 w-5 text-[#E0A62F]" />
                </div>
                <div className="text-right">
                    <p className="text-[14px] text-muted-foreground">دعوة معلّقة</p>
                    <p className="text-[22px] font-semibold text-[#232323]">{pendingInvites}</p>
                </div>
            </div>


        </div>
    );
}