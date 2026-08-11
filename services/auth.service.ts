// auth.service.ys

import { api } from "@/lib/axios";
import type {
  SignupPayload,
  SignupResponse,
  LoginPayload,
  LoginResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
  ResendOtpPayload,
  ResendOtpResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  InviteAccountantPayload,
  InviteAccountantResponse,
  AcceptInvitationPayload,
  RefreshTokenResponse,
  LogoutResponse,
} from "@/types/auth.types";

export const authService = {
  signup: (payload: SignupPayload) =>
    api.post<SignupResponse>("/auth/signup", payload).then((res) => res.data),

  login: (payload: LoginPayload) =>
    api.post<LoginResponse>("/auth/login", payload).then((res) => res.data),

  verifyOtp: (payload: VerifyOtpPayload) =>
    api.post<VerifyOtpResponse>("/auth/verify-otp", payload).then((res) => res.data),

  resendOtp: (payload: ResendOtpPayload) =>
    api.post<ResendOtpResponse>("/auth/resend-otp", payload).then((res) => res.data),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    api.post<ForgotPasswordResponse>("/auth/forgot-password", payload).then((res) => res.data),

  resetPassword: (payload: ResetPasswordPayload) =>
    api.post<ResetPasswordResponse>("/auth/reset-password", payload).then((res) => res.data),

  inviteAccountant: (payload: InviteAccountantPayload) =>
    api.post<InviteAccountantResponse>("/auth/invite-accountant", payload).then((res) => res.data),

  acceptInvitation: (payload: AcceptInvitationPayload) =>
    api.post<any>("/auth/accept-invitation", payload).then((res) => res.data),

  refreshToken: () =>
    api.post<RefreshTokenResponse>("/auth/refresh").then((res) => res.data),

  logout: () =>
    api.post<LogoutResponse>("/auth/logout").then((res) => res.data),
};