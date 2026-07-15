
"use client"
import { Button } from '../ui/button'


const SecondaryButton = ({ text, icon, href, className }: { text: string, icon: React.ReactNode, href?: string, className?: string }) => {


    return (
        <Button   className={`gap-2 md:w-[246px] md:text-[18px] h-[40px] border border-[#C8C2FC] md:h-[47px] rounded-lg bg-[#FFFFFF] text-[#1B1B1B] hover:bg-[#FFFFFF] ${className}`}>
            {icon}
            {text}
        </Button>
    )
}

export default SecondaryButton