import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    status: string;
    verified: boolean;
    national_id: string;
    contact_phone: string;
  };
}

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

interface VerifyOTPRequest {
  email: string;
  otp: string;
}

interface VerifyOTPResponse {
  success: boolean;
  message: string;
}

interface ResetPasswordRequest {
  email: string;
  otp: string;
  new_password: string;
  //new_password: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export const AuthApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login", // 👈 Added auth/
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "auth/register", // 👈 Added auth/
        method: "POST",
        body: userData,
      }),
    }),
    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (emailData) => ({
        url: "auth/forgot-password", // 👈 Added auth/
        method: "POST",
        body: emailData,
      }),
    }),
    verifyOTP: builder.mutation<VerifyOTPResponse, VerifyOTPRequest>({
      query: (otpData) => ({
        url: "auth/verify-otp", // 👈 Added auth/
        method: "POST",
        body: otpData,
      }),
    }),
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (resetData) => ({
        url: "auth/reset-password", // 👈 Added auth/
        method: "POST",
        body: resetData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
} = AuthApi;
