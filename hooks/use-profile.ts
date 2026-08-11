import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileService } from "@/services/profile.service";
import { getErrorMessage } from "@/lib/axios";
import { useProfileStore } from "@/store/profile.store";
import type { UpdateProfilePayload } from "@/types/profile.types";

export const PROFILE_QUERY_KEY = ["profile"];

export function useGetProfile() {
    const setProfile = useProfileStore((s) => s.setProfile);

    return useQuery({
        queryKey: PROFILE_QUERY_KEY,
        queryFn: async () => {
            const res = await profileService.getProfile();
            if (res?.data) {
                setProfile(res.data);
            }
            return res;
        },
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const setProfile = useProfileStore((s) => s.setProfile);

    return useMutation({
        mutationFn: (payload: UpdateProfilePayload) => profileService.updateProfile(payload),
        onSuccess: (res) => {
            if (res?.data) {
                setProfile(res.data);
            }
            queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
            toast.success(res.message || "تم تحديث الملف الشخصي بنجاح");
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, "حدث خطأ أثناء تحديث الملف الشخصي"));
        },
    });
}

export function useUpdateAvatar() {
    const queryClient = useQueryClient();
    const setProfile = useProfileStore((s) => s.setProfile);

    return useMutation({
        mutationFn: (file: File) => profileService.updateAvatar(file),
        onSuccess: (res) => {
            if (res?.data) {
                setProfile(res.data);
            }
            queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
            toast.success(res.message || "تم تحديث الصورة الشخصية بنجاح");
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, "حدث خطأ أثناء تحديث الصورة الشخصية"));
        },
    });
}
