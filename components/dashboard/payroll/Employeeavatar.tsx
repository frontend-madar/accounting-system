interface EmployeeAvatarProps {
    name: string;
    className?: string;
}

/** Circular avatar showing the first letter of the employee's name. */
export function EmployeeAvatar({ name, className }: EmployeeAvatarProps) {
    const initial = name.trim().charAt(0);

    return (
        <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EDEBFB] text-[13px] font-medium text-[#6C4CD6] ${className ?? ""}`}
        >
            {initial}
        </span>
    );
}