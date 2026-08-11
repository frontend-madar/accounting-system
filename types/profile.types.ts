export interface UserProfile {
    id: string;
    name: string;
    businessName: string;
    email: string;
    countryCode: string;
    phone: string;
    departments: string[];
    isVerified: boolean;
    role: string;
    avatar: string | null;
    companyId: string;
    provider: string | null;
    socialId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface GetProfileResponse {
    success: boolean;
    data: UserProfile;
    message: string;
}

export interface UpdateProfilePayload {
    name?: string;
    phone?: string;
    departments?: string[];
    oldPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
}

export interface UpdateProfileResponse {
    success: boolean;
    data: UserProfile;
    message: string;
}

export interface UpdateAvatarResponse {
    success: boolean;
    data: UserProfile;
    message: string;
}
