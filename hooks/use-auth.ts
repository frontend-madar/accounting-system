// use-auth.ts

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { getErrorMessage } from "@/lib/axios";
import type {
  LoginPayload,
  SignupPayload,
  VerifyOtpPayload,
  ResendOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  InviteAccountantPayload,
  AcceptInvitationPayload,
} from "@/types/auth.types";

export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: SignupPayload) => authService.signup(payload),
    onSuccess: (res, variables) => {
      toast.success(res.data.message);
      router.push(`/verify?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء إنشاء الحساب"));
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: ({ data }) => {
      setSession(data.user, data.accessToken, data.expiresIn);
      toast.success("تم تسجيل الدخول بنجاح!");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "البريد الإلكتروني أو كلمة المرور غير صحيحة"));
    },
  });
}

export function useVerifyOtp() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authService.verifyOtp(payload),
    onSuccess: ({ data }) => {
      setSession(data.user, data.accessToken, data.expiresIn);
      toast.success("تم تفعيل الحساب بنجاح!");
      router.push("/create-departments");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "رمز التحقق غير صحيح"));
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (payload: ResendOtpPayload) => authService.resendOtp(payload),
    onSuccess: (res) => {
      toast.success(res.data.message);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر إعادة إرسال الرمز"));
    },
  });
}

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => authService.forgotPassword(payload),
    onSuccess: (res, variables) => {
      toast.success(res.data.message);
      router.push(`/reset-password?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر إرسال رمز إعادة التعيين"));
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authService.resetPassword(payload),
    onSuccess: (res) => {
      toast.success(res.data.message);
      router.push("/login");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر إعادة تعيين كلمة المرور"));
    },
  });
}

export function useInviteAccountant() {
  return useMutation({
    mutationFn: (payload: InviteAccountantPayload) => authService.inviteAccountant(payload),
    onSuccess: (res) => {
      toast.success(res.message ?? "تم إرسال الدعوة بنجاح");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر إرسال الدعوة"));
    },
  });
}

 
export function useAcceptInvitation() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (payload: AcceptInvitationPayload) => authService.acceptInvitation(payload),
    onSuccess: ({ data }) => {
      setSession(data.user, data.accessToken, data.expiresIn);
      toast.success("تم تفعيل حسابك بنجاح!");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "تعذر تفعيل الدعوة"));
    },
  });
}