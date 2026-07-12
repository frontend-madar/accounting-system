
import { cn } from "@/lib/utils";

interface InfoColumnProps {
    label: string;
    value: React.ReactNode;
    className?: string;
}

export function InfoColumn({ label, value, className }: InfoColumnProps) {
    return (
        <div className={cn("text-center", className)}>
            <p className="text-[16px] text-[#868DA6]">{label}</p>
            <p className="mt-1 text-[20px] font-semibold text-[#1E2128]">{value} </p>
        </div>
    );
}