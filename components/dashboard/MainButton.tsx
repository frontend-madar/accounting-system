
"use client"
import Link from 'next/link';
import { Button } from '../ui/button'


const MainButton = ({ text, icon, href, className, }: { text: string, icon?: React.ReactNode, href?: string, className?: string }) => {

  return (
    <> {
      href ? (<Link href={href}
        className={`gap-2 flex text-white items-center justify-center md:w-[246px] md:text-[18px] h-[40px] md:h-[47px] rounded-lg bg-[#463BAF] hover:bg-[#332a80] ${className}`}
      >
        {icon}
        {text}
      </Link>) :
        (<Button type="submit" className={`gap-2 md:w-[246px] md:text-[18px] h-[40px] md:h-[47px] rounded-lg bg-[#463BAF] hover:bg-[#332a80] ${className}`}

        >
          {icon}
          {text}
        </Button>)
    }
    </>
  )
}

export default MainButton