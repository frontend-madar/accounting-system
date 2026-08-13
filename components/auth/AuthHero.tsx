import { AuthIcon } from "@/icons";
import Image from "next/image";

export function AuthHero() {
    return (
        <div className="relative h-full flex-1 rounded-3xl overflow-hidden px-6 py-8 flex-col justify-between hidden lg:flex">
            
            {/* Background Images Container */}
            <div className="absolute inset-0">
                <Image 
                    src={'/bg-test.png'} 
                    alt="Background pattern" 
                    fill 
                    className="object-cover"
                    priority
                />
                <Image 
                    src={'/login-img.png'} 
                    alt="Login illustration" 
                    fill  
                    className="object-cover"
                    priority
                />
                {/* Gradient Overlays for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1040]/90 via-[#1A1040]/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#1A1040]/20"></div>
            </div>

            {/* Brand Section - Top Right */}
            <div className="relative z-10 flex items-center gap-3">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg shadow-black/5 transition-all duration-300 hover:bg-white/15 hover:scale-[1.02]">
                     <AuthIcon />
                    <span className="text-[28px] font-bold text-white tracking-tight">أستاذ</span>
                </div>
            </div>

            {/* Content Card - Bottom */}
            <div className="relative z-10 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 p-6 shadow-xl shadow-black/10 transition-all duration-300 hover:bg-white/15">
                <h2 className="text-[24px] xl:text-[28px] font-bold leading-snug text-white">
                    منصة محاسبية تدير كل تفاصيل أعمالك المالية
                </h2>
                <p className="mt-3 text-white/90 text-[14px] xl:text-[17px] leading-relaxed">
                    صُممت لتبسيط العمليات المحاسبية، من إصدار الفواتير وحتى إعداد
                    التقارير المالية، مع تجربة استخدام حديثة وسهلة.
                </p>

                <div className="mt-5 flex items-center justify-start gap-3">
                    <div className="flex -space-x-2 space-x-reverse">
                        {[...Array(3)].map((_, index) => (
                            <div 
                                key={index}
                                className="relative border-2 border-white/20 rounded-full shadow-lg shadow-black/10 transition-all duration-300 hover:scale-110 hover:border-white/40"
                                style={{ transform: `translateX(${index * 10}px)` }}
                            >
                                <Image
                                    src="/user.png"
                                    alt={`Team member ${index + 1}`}
                                    width={42}
                                    height={42}
                                    className="rounded-full"
                                />
                            </div>
                        ))}
                    </div>
                    <span className="text-[15px] xl:text-[17px] font-medium text-white/90">
                        موثوق من <span className="font-bold text-white">فرق العمل</span>
                    </span>
                </div>
            </div>
        </div>
    );
}