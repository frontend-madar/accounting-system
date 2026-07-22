export interface SignupPayload {
  businessName: string;
  email: string;
  countryCode: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface AuthUser {
  id: string;
  businessName: string;
  email: string;
  countryCode: string;
  phone: string;
  isVerified: boolean;
  provider: string | null;
  socialId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  accessToken: string;
  tokenType: string;
  expiresIn: number; // seconds
  user: AuthUser;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
  confirm_password: string;
}



export interface InviteAccountantPayload {
  email: string;
}


export interface AcceptInvitationPayload {
  token: string;
  email: string;
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
}


export type ResetPasswordResponse = ApiResponse<{ message: string }>;
export type ForgotPasswordResponse = ApiResponse<{ message: string }>;
export type SignupResponse = ApiResponse<{ message: string }>;
export type ResendOtpResponse = ApiResponse<{ message: string }>;
export type VerifyOtpResponse = ApiResponse<AuthSession>;
export type LoginResponse = ApiResponse<AuthSession>;

export interface InviteAccountantResponse {
  success: boolean;
  data: {
    invitationLink: string;
    token: string;
    email: string;
  };
  message: string;
}
