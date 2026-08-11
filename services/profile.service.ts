import { api } from "@/lib/axios";
import type {
    GetProfileResponse,
    UpdateProfilePayload,
    UpdateProfileResponse,
    UpdateAvatarResponse,
} from "@/types/profile.types";

export const profileService = {
    getProfile: () =>
        api.get<GetProfileResponse>("/users/my-profile").then((res) => res.data),

    updateProfile: (payload: UpdateProfilePayload) =>
        api.patch<UpdateProfileResponse>("/users/my-profile", payload).then((res) => res.data),

    updateAvatar: (avatarFile: File) => {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        return api
            .patch<UpdateAvatarResponse>("/users/my-profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => res.data);
    },
};
