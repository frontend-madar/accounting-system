import React from 'react'

const FooterTerm = () => {
    return (
        <div className="text-center text-[12px] text-[#8B8E92] mt-6 leading-relaxed px-4">
            بإنشاء حسابك، أنت توافق على{" "}
            <span className="font-semibold text-[#5C5F63] hover:text-[#40369F] transition-colors duration-200 cursor-pointer">
                شروط الاستخدام
            </span>
            {" و "}
            <span className="font-semibold text-[#5C5F63] hover:text-[#40369F] transition-colors duration-200 cursor-pointer">
                سياسة الخصوصية
            </span>
            {" "} الخاصة بالنظام.
        </div>
    )
}

export default FooterTerm