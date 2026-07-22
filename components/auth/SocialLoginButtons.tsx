import React from 'react'
import { Button } from '../ui/button'
import { FacebookIcon, GoogleIcon } from '@/icons'

const SocialLoginButtons = () => {
    return (
        <div className="grid md:grid-cols-2 gap-3">
            <Button
                variant="outline"
                type="button"
                className="w-full h-[50px] text-[#1E1F1F] text-[15px] font-medium border-[#E4E5E7] bg-white hover:bg-[#F8F9FF] hover:border-[#40369F] hover:text-[#40369F] transition-all duration-200 rounded-xl gap-3 group"
            >
                <FacebookIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                سجل من خلال فيسبوك
            </Button>
            <Button
                variant="outline"
                type="button"
                className="w-full h-[50px] text-[#1E1F1F] text-[15px] font-medium border-[#E4E5E7] bg-white hover:bg-[#F8F9FF] hover:border-[#40369F] hover:text-[#40369F] transition-all duration-200 rounded-xl gap-3 group"
            >
                <GoogleIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                سجل من خلال جوجل
            </Button>
        </div>
    )
}

export default SocialLoginButtons