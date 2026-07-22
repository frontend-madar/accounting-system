"use client"
import { Button } from '../ui/button'

interface SecondaryButtonProps {
    text: string;
    icon: React.ReactNode;
    href?: string;
    className?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
}

const SecondaryButton = ({ text, icon, href, className, onClick, type = "button" }: SecondaryButtonProps) => {

    return (
        <Button
            type={type}
            onClick={onClick}
            className={`gap-2 md:w-[246px] md:text-[18px] h-[40px] border border-[#C8C2FC] md:h-[47px] rounded-lg bg-[#FFFFFF] text-[#1B1B1B] hover:bg-[#FFFFFF] ${className}`}
        >
            {icon}
            {text}
        </Button>
    )
}

export default SecondaryButton