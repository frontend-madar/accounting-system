"use client";

import { useRef } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";

import { FormSection } from "@/components/dashboard/invoice/FormSection";
import { ProfileForm } from "@/components/dashboard/profile/ProfileForm";
import SecondaryButton from "@/components/dashboard/shared/SecondaryButton";
import { Topbar } from "@/components/dashboard/Topbar";
import { ProfileCompanyIcon, ProfileEmailIcon, ProfilePhoneIcon } from "@/icons";
import { useGetProfile, useUpdateAvatar } from "@/hooks/use-profile";
import { useAuthStore } from "@/store/auth-store";

import { Skeleton } from "@/components/ui/skeleton";
import AccountantsManagements from "@/components/dashboard/profile/AccountantsManagements";

const ProfilePage = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: profileResponse, isLoading } = useGetProfile();
    const { mutate: updateAvatar, isPending: isAvatarUploading } = useUpdateAvatar();
    const role = useAuthStore((s) => s.user?.role);
    const isManager = role === "MANAGER";

    const profile = profileResponse?.data;

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            updateAvatar(file);
        }
    };

    return (
        <div className="space-y-5 px-4">
            <Topbar title="الملف الشخصي" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <FormSection title="" gridClassName="!grid-cols-1" className="h-fit">
                    {isLoading ? (
                        <div className="space-y-6 p-2">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-[70px] w-[70px] rounded-full shrink-0" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-36" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-11 w-11 rounded-full shrink-0" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-5 w-28" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-11 w-11 rounded-full shrink-0" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-3 w-24" />
                                        <Skeleton className="h-5 w-40" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-11 w-11 rounded-full shrink-0" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-5 w-32" />
                                    </div>
                                </div>
                            </div>
                            <Skeleton className="h-12 w-full rounded-2xl" />
                        </div>
                    ) : (
                        <>
                            <div className="flex gap-3 items-center">
                                <div className="relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-full border border-gray-200">
                                    <Image
                                        src={profile?.avatar || "/user.png"}
                                        alt="user avatar"
                                        fill
                                        className="object-cover"
                                        unoptimized={Boolean(profile?.avatar)}
                                    />
                                    {isAvatarUploading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            <Loader2 className="h-5 w-5 animate-spin text-white" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-[#000000] text-[22px] md:text-[26px] font-semibold">
                                        {profile?.name || "---"}
                                    </h3>
                                    <p className="text-[#676A6E] text-[16px]">
                                        {profile?.departments?.length ? profile.departments.join(" • ") : profile?.role || "---"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 items-center">
                                <div className="flex items-center justify-center bg-[#EDEBF7] w-11 h-11 rounded-full shrink-0">
                                    <ProfileCompanyIcon />
                                </div>
                                <div>
                                    <p className="text-[#676A6E] text-[14px]">الشركة</p>
                                    <h3 className="text-[#000000] text-[18px] md:text-[22px] font-semibold">
                                        {profile?.businessName || "---"}
                                    </h3>
                                </div>
                            </div>

                            <div className="flex gap-3 items-center">
                                <div className="flex items-center justify-center bg-[#EDEBF7] w-11 h-11 rounded-full shrink-0">
                                    <ProfileEmailIcon />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[#676A6E] text-[14px]">البريد الالكتروني</p>
                                    <h3 className="text-[#000000] text-[16px] md:text-[20px] font-semibold truncate">
                                        {profile?.email || "---"}
                                    </h3>
                                </div>
                            </div>

                            <div className="flex gap-3 items-center">
                                <div className="flex items-center justify-center bg-[#EDEBF7] w-11 h-11 rounded-full shrink-0">
                                    <ProfilePhoneIcon />
                                </div>
                                <div>
                                    <p className="text-[#676A6E] text-[14px]">رقم الجوال</p>
                                    <h3 className="text-[#000000] text-[18px] md:text-[22px] font-semibold dir-ltr">
                                        {profile?.phone ? `${profile.countryCode ?? ''} ${profile.phone}` : "---"}
                                    </h3>
                                </div>
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />

                            <SecondaryButton
                                text={isAvatarUploading ? "جاري التحديث..." : "تغيير الصورة"}
                                icon={<Camera className="h-4 w-4" />}
                                disabled={isAvatarUploading}
                                onClick={() => fileInputRef.current?.click()}
                            />
                        </>
                    )}
                </FormSection>

                <div className="lg:col-span-2">
                    <ProfileForm />
                    {isManager && <AccountantsManagements />}
                </div>
            </div>

        </div>
    );
};

export default ProfilePage;